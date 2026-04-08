import { Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getCurrentAppShellSession } from "@/server/current-session";
import { deletePriceSheetAction, setPriceSheetStatusAction, updatePriceSheetAction } from "@/server/price-sheets/actions";
import { getPriceSheetErrorMessage, getWorkspacePriceSheetForEdit,isKnownPriceSheetError } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

interface PriceSheetEditPageProps {
  params: Promise<{
    priceSheetId: string;
  }>;
}

export default async function PriceSheetEditPage({ params }: PriceSheetEditPageProps) {
  const session = await getCurrentAppShellSession();
  const { priceSheetId } = await params;

  try {
    const priceSheet = await getWorkspacePriceSheetForEdit(session, priceSheetId);
    const nextStatus = priceSheet.status === "published" ? "draft" : "published";
    const statusActionLabel = priceSheet.status === "published" ? "Unpublish" : "Publish";

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Edit"
          title={priceSheet.title}
          description="Update metadata, adjust items, and control publication state for this sheet."
          actions={
            priceSheet.status === "published" ? (
              <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href={priceSheet.publicUrl}>
                Public page
              </Link>
            ) : undefined
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1fr,320px]">
          <PriceSheetForm
            action={updatePriceSheetAction.bind(null, priceSheet.id)}
            cancelHref="/app/price-sheets"
            initialValues={priceSheet.formValues}
            mode="edit"
          />

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>State</CardTitle>
                <CardDescription>Publishing controls public visibility for the slug route.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <PriceSheetStatusBadge status={priceSheet.status} />
                  <span className="text-sm text-muted-foreground">{priceSheet.itemCount} items</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Slug: {priceSheet.slug}</p>
                  <p>Currency: {priceSheet.currency}</p>
                  <p>Locale: {priceSheet.locale}</p>
                  <p>Updated: {priceSheet.updatedAt.toLocaleString()}</p>
                </div>

                <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, `/app/price-sheets/${priceSheet.id}`)}>
                  <Button type="submit" variant="outline">
                    {statusActionLabel}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delete</CardTitle>
                <CardDescription>Delete removes the sheet and all items for the current workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={deletePriceSheetAction.bind(null, priceSheet.id, "/app/price-sheets")}>
                  <Button type="submit" variant="destructive">
                    Delete Price Sheet
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (isKnownPriceSheetError(error) && error.code === "NOT_FOUND") {
      notFound();
    }

    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Edit" title="Price Sheet unavailable" description="The requested sheet could not be loaded." />
        <PlaceholderPanel title="Price Sheet unavailable" description={getPriceSheetErrorMessage(error)} />
      </div>
    );
  }
}
