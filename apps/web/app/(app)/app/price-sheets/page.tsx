import { Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getCurrentAppShellSession } from "@/server/current-session";
import { setPriceSheetStatusAction } from "@/server/price-sheets/actions";
import { getPriceSheetErrorMessage, listWorkspacePriceSheets } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

export default async function PriceSheetsPage() {
  const session = await getCurrentAppShellSession();

  try {
    const priceSheets = await listWorkspacePriceSheets(session);

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Product area"
          title="Price sheets"
          description="Create and manage public-facing price sheets for the current workspace."
          actions={
            <Link className={cn(buttonVariants({ size: "sm" }))} href="/app/price-sheets/new">
              New Price Sheet
            </Link>
          }
        />

        {priceSheets.length === 0 ? (
          <PlaceholderPanel
            title="No price sheets yet"
            description="Create the first sheet for this workspace and publish it when it is ready."
            actionHref="/app/price-sheets/new"
            actionLabel="Create your first Price Sheet"
          >
            <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 text-sm text-muted-foreground">
              Sheets stay empty until you add real content. Nothing is seeded beyond the current mock session and workspace.
            </div>
          </PlaceholderPanel>
        ) : (
          <div className="grid gap-4">
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
                            {priceSheet.locale}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, "/app/price-sheets")}>
                          <Button type="submit" variant="outline">
                            {statusActionLabel}
                          </Button>
                        </form>
                        {priceSheet.status === "published" ? (
                          <Link className={cn(buttonVariants({ size: "default", variant: "outline" }))} href={`/price-sheets/${priceSheet.slug}`}>
                            Public page
                          </Link>
                        ) : null}
                        <Link className={cn(buttonVariants({ size: "default" }))} href={`/app/price-sheets/${priceSheet.id}`}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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

