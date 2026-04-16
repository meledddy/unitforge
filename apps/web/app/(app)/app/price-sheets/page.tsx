import { Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
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
  const session = await requireCurrentAppShellSession();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const searchQuery = getFirstQueryParamValue(resolvedSearchParams.q)?.trim() ?? "";
  const activeStatusFilter = parseStatusFilter(getFirstQueryParamValue(resolvedSearchParams.status));
  const hasActiveListTools = searchQuery.length > 0 || activeStatusFilter !== "all";

  try {
    const priceSheets = await listWorkspacePriceSheets(session, {
      query: searchQuery || undefined,
      status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
    });

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Product area"
          title="Price sheets"
          description="Create and manage public-facing price sheets for the current workspace."
          actions={
            <Link className={cn(buttonVariants({ size: "sm" }), "w-full sm:w-auto")} href="/app/price-sheets/new">
              New Price Sheet
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
                placeholder="Search by title, slug, description, or translation"
                type="search"
              />
              {activeStatusFilter !== "all" ? <input name="status" type="hidden" value={activeStatusFilter} /> : null}
              <Button className="w-full sm:w-auto" type="submit" variant="outline">
                Search
              </Button>
              {hasActiveListTools ? (
                <Link className={cn(buttonVariants({ size: "default", variant: "ghost" }), "w-full sm:w-auto")} href="/app/price-sheets">
                  Reset
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
                  {getStatusFilterLabel(statusFilter)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {priceSheets.length === 0 ? (
          hasActiveListTools ? (
            <PlaceholderPanel
              title="No matching price sheets"
              description="Try a different search or adjust the status filter for this workspace."
              actionHref="/app/price-sheets"
              actionLabel="Clear search and filters"
            >
              <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
                Search matches title, slug, description, and translated sheet content within the current workspace only.
              </div>
            </PlaceholderPanel>
          ) : (
            <PlaceholderPanel
              title="No price sheets yet"
              description="Create the first sheet for this workspace and publish it when it is ready."
              actionHref="/app/price-sheets/new"
              actionLabel="Create your first Price Sheet"
            >
              <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
                Sheets stay empty until you add real content. Only the bootstrap operator account and workspace are seeded for local verification.
              </div>
            </PlaceholderPanel>
          )
        ) : (
          <div className="grid gap-4 sm:gap-5">
            {priceSheets.map((priceSheet) => {
              const nextStatus = priceSheet.status === "published" ? "draft" : "published";
              const statusActionLabel = priceSheet.status === "published" ? "Unpublish" : "Publish";

              return (
                <Card key={priceSheet.id}>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <PriceSheetStatusBadge status={priceSheet.status} />
                          <p className="text-sm text-muted-foreground">{priceSheet.itemCount} items</p>
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
                            Duplicate
                          </Button>
                        </form>
                        {priceSheet.status === "published" ? (
                          <Link
                            className={cn(buttonVariants({ size: "default", variant: "outline" }), "w-full sm:w-auto")}
                            href={`/price-sheets/${priceSheet.slug}`}
                          >
                            Public page
                          </Link>
                        ) : null}
                        <Link className={cn(buttonVariants({ size: "default" }), "w-full sm:w-auto")} href={`/app/price-sheets/${priceSheet.id}`}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>Updated {priceSheet.updatedAt.toLocaleString()}</p>
                    <p>{priceSheet.publishedAt ? `Published ${priceSheet.publishedAt.toLocaleString()}` : "Not yet published"}</p>
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
          eyebrow="Product area"
          title="Price sheets"
          description="The workspace shell is ready, but the Price Sheets data layer could not be reached."
        />
        <PlaceholderPanel title="Price Sheets unavailable" description={getPriceSheetErrorMessage(error)} />
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

function getStatusFilterLabel(status: PriceSheetListStatusFilter) {
  if (status === "published") {
    return "Published";
  }

  if (status === "draft") {
    return "Draft";
  }

  return "All";
}

