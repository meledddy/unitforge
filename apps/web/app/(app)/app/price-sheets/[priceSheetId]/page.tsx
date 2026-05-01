import { Badge, Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { DeletePriceSheetConfirmation } from "@/features/price-sheets/delete-price-sheet-confirmation";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { PriceSheetLeadsPanel, PriceSheetLeadsSummary } from "@/features/price-sheets/price-sheet-leads-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";
import { listWorkspacePriceSheetLeads } from "@/server/price-sheet-leads/service";
import {
  deletePriceSheetAction,
  duplicatePriceSheetAction,
  setPriceSheetStatusAction,
  updatePriceSheetAction,
} from "@/server/price-sheets/actions";
import { getPriceSheetErrorMessage, getWorkspacePriceSheetForEdit, isKnownPriceSheetError } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

interface PriceSheetEditPageProps {
  params: Promise<{
    priceSheetId: string;
  }>;
}

export default async function PriceSheetEditPage({ params }: PriceSheetEditPageProps) {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const { priceSheetId } = await params;
  const messages = getMessages(locale);
  const dateTimeLocale = getInterfaceNumberLocale(locale);

  try {
    const [priceSheet, leads] = await Promise.all([
      getWorkspacePriceSheetForEdit(session, priceSheetId),
      listWorkspacePriceSheetLeads(session, priceSheetId),
    ]);
    const nextStatus = priceSheet.status === "published" ? "draft" : "published";
    const statusActionLabel = priceSheet.status === "published" ? messages.priceSheets.unpublish : messages.priceSheets.publish;
    const leadCountLabel = `${messages.priceSheets.leadCountLabel}: ${leads.length}`;

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={messages.priceSheets.editEyebrow}
          title={priceSheet.title}
          description={messages.priceSheets.editDescription}
          actions={
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge className="h-8 rounded-full px-3" variant="secondary">
                {leadCountLabel}
              </Badge>
              <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href="#sheet-leads">
                {messages.priceSheets.leadsLink}
              </Link>
              <form action={duplicatePriceSheetAction.bind(null, priceSheet.id)}>
                <Button className="w-full sm:w-auto" size="sm" type="submit" variant="outline">
                  {messages.shared.duplicate}
                </Button>
              </form>
              {priceSheet.status === "published" ? (
                <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href={priceSheet.publicUrl}>
                  {messages.priceSheets.publicPage}
                </Link>
              ) : null}
            </div>
          }
        />

        <PriceSheetLeadsSummary
          inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
          leads={leads}
          locale={locale}
          publicUrl={priceSheet.publicUrl}
          status={priceSheet.status}
        />

        <div className="grid gap-6 xl:grid-cols-[1fr,320px]">
          <PriceSheetForm
            action={updatePriceSheetAction.bind(null, priceSheet.id)}
            cancelHref="/app/price-sheets"
            initialValues={priceSheet.formValues}
            locale={locale}
            mode="edit"
          />

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{messages.priceSheets.stateTitle}</CardTitle>
                <CardDescription>{messages.priceSheets.stateDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <PriceSheetStatusBadge locale={locale} status={priceSheet.status} />
                  <span className="rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground">
                    {priceSheet.itemCount} {messages.priceSheets.itemsCount}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3 text-muted-foreground">
                    <span>{messages.priceSheets.slugLabel}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">/{priceSheet.slug}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-muted-foreground">
                    <span>{messages.priceSheets.themeLabel}</span>
                    <span className="text-foreground">{priceSheet.theme}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-muted-foreground">
                    <span>{messages.priceSheets.currencyLabel}</span>
                    <span className="text-foreground">{priceSheet.currency}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-muted-foreground">
                    <span>{messages.priceSheets.defaultLocaleLabel}</span>
                    <span className="text-foreground">{priceSheet.defaultContentLocale}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-muted-foreground">
                    <span>{messages.shared.updated}</span>
                    <span className="text-right text-foreground">{priceSheet.updatedAt.toLocaleString(dateTimeLocale)}</span>
                  </div>
                </div>

                <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, `/app/price-sheets/${priceSheet.id}`)}>
                  <Button className="w-full" type="submit" variant="outline">
                    {statusActionLabel}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{messages.priceSheets.deleteTitle}</CardTitle>
                <CardDescription>{messages.priceSheets.deleteDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <DeletePriceSheetConfirmation
                  action={deletePriceSheetAction.bind(null, priceSheet.id, "/app/price-sheets")}
                  cancelLabel={messages.priceSheets.deleteCancelButton}
                  confirmButtonLabel={messages.priceSheets.deleteConfirmButton}
                  consequence={messages.priceSheets.deleteConfirmConsequence}
                  description={messages.priceSheets.deleteConfirmDescription}
                  sheetLabel={messages.priceSheets.deleteConfirmSheetLabel}
                  sheetTitle={priceSheet.title}
                  title={messages.priceSheets.deleteConfirmTitle}
                  triggerLabel={messages.priceSheets.deleteButton}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <PriceSheetLeadsPanel
          inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
          leads={leads}
          locale={locale}
          publicUrl={priceSheet.publicUrl}
          status={priceSheet.status}
        />
      </div>
    );
  } catch (error) {
    if (isKnownPriceSheetError(error) && error.code === "NOT_FOUND") {
      notFound();
    }

    return (
      <div className="space-y-8">
        <PageHeader eyebrow={messages.priceSheets.editEyebrow} title={messages.priceSheets.editUnavailableTitle} description={messages.priceSheets.editUnavailableDescription} />
        <PlaceholderPanel title={messages.priceSheets.editUnavailableTitle} description={getPriceSheetErrorMessage(error)} />
      </div>
    );
  }
}
