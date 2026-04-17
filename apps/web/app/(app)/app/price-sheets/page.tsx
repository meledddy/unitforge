import { Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";
import { duplicatePriceSheetAction, setPriceSheetStatusAction } from "@/server/price-sheets/actions";
import { getPriceSheetErrorMessage, listWorkspacePriceSheets } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

const statusFilterValues = ["all", "published", "draft"] as const;

type PriceSheetListStatusFilter = (typeof statusFilterValues)[number];

interface PriceSheetsPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
}

export default async function PriceSheetsPage({ searchParams }: PriceSheetsPageProps) {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const searchQuery = getFirstQueryParamValue(resolvedSearchParams.q)?.trim() ?? "";
  const activeStatusFilter = parseStatusFilter(getFirstQueryParamValue(resolvedSearchParams.status));
  const hasActiveListTools = searchQuery.length > 0 || activeStatusFilter !== "all";
  const messages = getMessages(locale);
  const dateTimeLocale = getInterfaceNumberLocale(locale);

  try {
    const priceSheets = await listWorkspacePriceSheets(session, {
      query: searchQuery || undefined,
      status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
    });

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={messages.priceSheets.eyebrow}
          title={messages.priceSheets.listTitle}
          description={messages.priceSheets.listDescription}
          actions={
            <Link className={cn(buttonVariants({ size: "sm" }), "w-full sm:w-auto")} href="/app/price-sheets/new">
              {messages.priceSheets.newButton}
            </Link>
          }
        />

        <div className="rounded-3xl border border-border/70 bg-background/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form action="/app/price-sheets" className="flex flex-col gap-3 sm:flex-row sm:items-center" method="get">
              <Input
                className="h-11 min-w-0 sm:min-w-[280px]"
                defaultValue={searchQuery}
                name="q"
                placeholder={messages.priceSheets.searchPlaceholder}
                type="search"
              />
              {activeStatusFilter !== "all" ? <input name="status" type="hidden" value={activeStatusFilter} /> : null}
              <Button className="w-full sm:w-auto" type="submit" variant="outline">
                {messages.shared.search}
              </Button>
              {hasActiveListTools ? (
                <Link className={cn(buttonVariants({ size: "default", variant: "ghost" }), "w-full sm:w-auto")} href="/app/price-sheets">
                  {messages.shared.reset}
                </Link>
              ) : null}
            </form>

            <div className="flex flex-wrap gap-2">
              {statusFilterValues.map((statusFilter) => (
                <Link
                  key={statusFilter}
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: activeStatusFilter === statusFilter ? "default" : "outline",
                    }),
                    "min-w-[84px]",
                  )}
                  href={buildPriceSheetsListHref({
                    query: searchQuery,
                    status: statusFilter,
                  })}
                >
                  {getStatusFilterLabel(locale, statusFilter)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {priceSheets.length === 0 ? (
          hasActiveListTools ? (
            <PlaceholderPanel
              title={messages.priceSheets.noMatchingTitle}
              description={messages.priceSheets.noMatchingDescription}
              actionHref="/app/price-sheets"
              actionLabel={messages.priceSheets.clearSearchAndFilters}
            >
              <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
                {messages.priceSheets.noMatchingHint}
              </div>
            </PlaceholderPanel>
          ) : (
            <PlaceholderPanel
              title={messages.priceSheets.emptyTitle}
              description={messages.priceSheets.emptyDescription}
              actionHref="/app/price-sheets/new"
              actionLabel={messages.priceSheets.firstSheetCta}
            >
              <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
                {messages.priceSheets.emptyHint}
              </div>
            </PlaceholderPanel>
          )
        ) : (
          <div className="grid gap-4 sm:gap-5">
            {priceSheets.map((priceSheet) => {
              const nextStatus = priceSheet.status === "published" ? "draft" : "published";
              const statusActionLabel = priceSheet.status === "published" ? messages.priceSheets.unpublish : messages.priceSheets.publish;

              return (
                <Card key={priceSheet.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <PriceSheetStatusBadge locale={locale} status={priceSheet.status} />
                          <p className="text-sm text-muted-foreground">{priceSheet.itemCount} {messages.priceSheets.itemsCount}</p>
                        </div>
                        <div>
                          <CardTitle>{priceSheet.title}</CardTitle>
                          <CardDescription>
                            <span className="font-mono text-xs uppercase tracking-[0.18em]">{priceSheet.slug}</span>
                            {" / "}
                            {priceSheet.currency}
                            {" / "}
                            {priceSheet.defaultContentLocale}
                            {" / "}
                            {priceSheet.theme}
                          </CardDescription>
                          {priceSheet.description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{priceSheet.description}</p> : null}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                        <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, "/app/price-sheets")}>
                          <Button className="w-full sm:w-auto" type="submit" variant="outline">
                            {statusActionLabel}
                          </Button>
                        </form>
                        <form action={duplicatePriceSheetAction.bind(null, priceSheet.id)}>
                          <Button className="w-full sm:w-auto" type="submit" variant="outline">
                            {messages.shared.duplicate}
                          </Button>
                        </form>
                        {priceSheet.status === "published" ? (
                          <Link
                            className={cn(buttonVariants({ size: "default", variant: "outline" }), "w-full sm:w-auto")}
                            href={`/price-sheets/${priceSheet.slug}`}
                          >
                            {messages.priceSheets.publicPage}
                          </Link>
                        ) : null}
                        <Link className={cn(buttonVariants({ size: "default" }), "w-full sm:w-auto")} href={`/app/price-sheets/${priceSheet.id}`}>
                          {messages.priceSheets.editSheet}
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>{messages.priceSheets.updatedPrefix} {priceSheet.updatedAt.toLocaleString(dateTimeLocale)}</p>
                    <p>
                      {priceSheet.publishedAt
                        ? `${messages.priceSheets.publishedPrefix} ${priceSheet.publishedAt.toLocaleString(dateTimeLocale)}`
                        : messages.priceSheets.notYetPublished}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={messages.priceSheets.eyebrow}
          title={messages.priceSheets.listTitle}
          description={messages.priceSheets.listErrorDescription}
        />
        <PlaceholderPanel title={messages.priceSheets.unavailableTitle} description={getPriceSheetErrorMessage(error)} />
      </div>
    );
  }
}

function getFirstQueryParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatusFilter(value?: string): PriceSheetListStatusFilter {
  return value === "published" || value === "draft" ? value : "all";
}

function buildPriceSheetsListHref(input: {
  query: string;
  status: PriceSheetListStatusFilter;
}) {
  const params = new URLSearchParams();

  if (input.query.trim().length > 0) {
    params.set("q", input.query.trim());
  }

  if (input.status !== "all") {
    params.set("status", input.status);
  }

  const queryString = params.toString();

  return queryString.length > 0 ? `/app/price-sheets?${queryString}` : "/app/price-sheets";
}

function getStatusFilterLabel(locale: "en" | "ru", status: PriceSheetListStatusFilter) {
  const messages = getMessages(locale);

  if (status === "published") {
    return messages.priceSheets.filterPublished;
  }

  if (status === "draft") {
    return messages.priceSheets.filterDraft;
  }

  return messages.priceSheets.filterAll;
}

