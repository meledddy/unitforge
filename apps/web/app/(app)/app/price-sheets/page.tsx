import { Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";
import { setPriceSheetStatusAction } from "@/server/price-sheets/actions";
import { getPriceSheetErrorMessage, listWorkspacePriceSheets } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

const statusFilterValues = ["all", "published", "draft"] as const;
const priceSheetsPageSize = 5;

type PriceSheetListStatusFilter = (typeof statusFilterValues)[number];

interface PriceSheetsPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    status?: string | string[];
    limit?: string | string[];
  }>;
}

export default async function PriceSheetsPage({ searchParams }: PriceSheetsPageProps) {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const searchQuery = getFirstQueryParamValue(resolvedSearchParams.q)?.trim() ?? "";
  const activeStatusFilter = parseStatusFilter(getFirstQueryParamValue(resolvedSearchParams.status));
  const visibleLimit = parseVisibleLimit(getFirstQueryParamValue(resolvedSearchParams.limit));
  const hasActiveListTools = searchQuery.length > 0 || activeStatusFilter !== "all";
  const messages = getMessages(locale);
  const dateTimeLocale = getInterfaceNumberLocale(locale);

  try {
    const priceSheets = await listWorkspacePriceSheets(session, {
      query: searchQuery || undefined,
      status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
    });
    const visiblePriceSheets = priceSheets.slice(0, visibleLimit);
    const hasMorePriceSheets = visiblePriceSheets.length < priceSheets.length;
    const nextVisibleLimit = Math.min(visibleLimit + priceSheetsPageSize, priceSheets.length);
    const currentListHref = buildPriceSheetsListHref({
      query: searchQuery,
      status: activeStatusFilter,
      limit: visibleLimit,
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

        <div className="rounded-3xl border border-border/70 bg-card/85 p-3 shadow-[0_18px_55px_rgba(31,22,34,0.06)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <form action="/app/price-sheets" className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center" method="get">
              <Input
                className="h-10 min-w-0 bg-background/85 sm:min-w-[320px]"
                defaultValue={searchQuery}
                name="q"
                placeholder={messages.priceSheets.searchPlaceholder}
                type="search"
              />
              {activeStatusFilter !== "all" ? <input name="status" type="hidden" value={activeStatusFilter} /> : null}
              <Button className="h-10 w-full sm:w-auto" size="sm" type="submit" variant="outline">
                {messages.shared.search}
              </Button>
              {hasActiveListTools ? (
                <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "h-10 w-full sm:w-auto")} href="/app/price-sheets">
                  {messages.shared.reset}
                </Link>
              ) : null}
            </form>

            <div className="flex flex-wrap gap-2 rounded-full border border-border/70 bg-background/70 p-1">
              {statusFilterValues.map((statusFilter) => (
                <Link
                  key={statusFilter}
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: activeStatusFilter === statusFilter ? "default" : "outline",
                    }),
                    "h-8 min-w-[82px] flex-1 rounded-full px-3 text-xs shadow-none sm:flex-none",
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
          {priceSheets.length > 0 ? (
            <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              {messages.priceSheets.resultsShowing} {visiblePriceSheets.length} {messages.priceSheets.resultsOf} {priceSheets.length}
            </p>
          ) : null}
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
          <div className="space-y-4">
            <div className="grid gap-3">
              {visiblePriceSheets.map((priceSheet) => {
                const nextStatus = priceSheet.status === "published" ? "draft" : "published";
                const statusActionLabel = priceSheet.status === "published" ? messages.priceSheets.unpublish : messages.priceSheets.publish;
                const publishedMetadata = priceSheet.publishedAt
                  ? priceSheet.publishedAt.toLocaleString(dateTimeLocale)
                  : messages.priceSheets.notYetPublished;

                return (
                  <Card className="overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-[0_12px_36px_rgba(31,22,34,0.04)]" key={priceSheet.id}>
                    <CardHeader className="gap-4 p-4 sm:p-5">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                        <div className="min-w-0 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <PriceSheetStatusBadge locale={locale} status={priceSheet.status} />
                            <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
                              {priceSheet.itemCount} {messages.priceSheets.itemsCount}
                            </span>
                            <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              {priceSheet.currency}
                            </span>
                            <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
                              {priceSheet.defaultContentLocale}
                            </span>
                          </div>
                          <div className="min-w-0 space-y-1.5">
                            <CardTitle className="text-base leading-6 sm:text-lg">
                              <Link className="break-words transition-colors hover:text-primary" href={`/app/price-sheets/${priceSheet.id}`}>
                                {priceSheet.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                              <span>{messages.priceSheets.slugLabel}:</span>
                              <span className="break-all font-mono text-[11px] uppercase tracking-[0.14em]">/{priceSheet.slug}</span>
                            </CardDescription>
                            {priceSheet.description ? <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{priceSheet.description}</p> : null}
                          </div>
                        </div>

                        <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-start lg:max-w-[260px] lg:justify-end">
                          <Link
                            className={cn(buttonVariants({ size: "sm" }), "w-full min-w-[92px] sm:w-auto")}
                            href={`/app/price-sheets/${priceSheet.id}`}
                          >
                            {messages.priceSheets.editSheet}
                          </Link>
                          <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, currentListHref)} className="min-w-0">
                            <Button className="w-full whitespace-normal sm:w-auto" size="sm" type="submit" variant="outline">
                              {statusActionLabel}
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="border-t border-border/60 px-4 pb-4 pt-3 sm:px-5">
                      <dl className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                        <div className="min-w-0">
                          <dt className="font-medium text-foreground/70">{messages.priceSheets.defaultLocaleLabel}</dt>
                          <dd>{priceSheet.defaultContentLocale}</dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="font-medium text-foreground/70">{messages.priceSheets.updatedPrefix}</dt>
                          <dd>{priceSheet.updatedAt.toLocaleString(dateTimeLocale)}</dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="font-medium text-foreground/70">{messages.priceSheets.publishedPrefix}</dt>
                          <dd>{publishedMetadata}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {hasMorePriceSheets ? (
              <div className="flex justify-center pt-2">
                <Link
                  className={cn(buttonVariants({ variant: "outline" }), "min-w-[180px]")}
                  href={buildPriceSheetsListHref({
                    query: searchQuery,
                    status: activeStatusFilter,
                    limit: nextVisibleLimit,
                  })}
                >
                  {messages.priceSheets.loadMore}
                </Link>
              </div>
            ) : null}
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

function parseVisibleLimit(value?: string) {
  if (!value) {
    return priceSheetsPageSize;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= priceSheetsPageSize) {
    return priceSheetsPageSize;
  }

  return parsedValue;
}

function buildPriceSheetsListHref(input: {
  query: string;
  status: PriceSheetListStatusFilter;
  limit?: number;
}) {
  const params = new URLSearchParams();

  if (input.query.trim().length > 0) {
    params.set("q", input.query.trim());
  }

  if (input.status !== "all") {
    params.set("status", input.status);
  }

  if (input.limit && input.limit > priceSheetsPageSize) {
    params.set("limit", String(input.limit));
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
