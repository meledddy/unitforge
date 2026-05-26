import { Button, buttonVariants, Card, CardContent, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { DeletePriceSheetConfirmation } from "@/features/price-sheets/delete-price-sheet-confirmation";
import { PriceSheetForm } from "@/features/price-sheets/price-sheet-form";
import { PriceSheetLeadsSummary } from "@/features/price-sheets/price-sheet-leads-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
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

  try {
    const [priceSheet, leads] = await Promise.all([
      getWorkspacePriceSheetForEdit(session, priceSheetId),
      listWorkspacePriceSheetLeads(session, priceSheetId),
    ]);
    const nextStatus = priceSheet.status === "published" ? "draft" : "published";
    const statusActionLabel = priceSheet.status === "published" ? messages.priceSheets.unpublish : messages.priceSheets.publish;
    const presentationAppearanceLabel =
      priceSheet.publicSettings.presentationAppearance === "dark"
        ? messages.priceSheetForm.presentationAppearanceDark
        : messages.priceSheetForm.presentationAppearanceLight;

    return (
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-72 h-80 w-80 rounded-full bg-amber-200/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent"
        />

      <div className="relative space-y-7">
        <Link className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="/app/price-sheets">
          {messages.priceSheets.backToList}
        </Link>

        <PageHeader
          eyebrow={messages.priceSheets.editEyebrow}
          title={priceSheet.title}
          description={messages.priceSheets.editDescription}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <form action={duplicatePriceSheetAction.bind(null, priceSheet.id)}>
                <Button className="w-full bg-card/70 sm:w-auto" size="sm" type="submit" variant="outline">
                  {messages.shared.duplicate}
                </Button>
              </form>
              {priceSheet.status === "published" ? (
                <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full bg-card/70 sm:w-auto")} href={priceSheet.publicUrl}>
                  {messages.priceSheets.publicPage}
                </Link>
              ) : null}
            </div>
          }
        />

        <PriceSheetLeadsSummary
          inquiriesHref={`/app/price-sheets/${priceSheet.id}/inquiries`}
          inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
          leads={leads}
          locale={locale}
          status={priceSheet.status}
        />

        <div className="grid gap-5 xl:grid-cols-[1fr,320px]">
          <PriceSheetForm
            action={updatePriceSheetAction.bind(null, priceSheet.id)}
            cancelHref="/app/price-sheets"
            initialValues={priceSheet.formValues}
            locale={locale}
            mode="edit"
          />

          <div className="space-y-4">
            <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.22)] dark:before:via-primary/35">
              <CardHeader className="border-b border-border/55 bg-gradient-to-r from-muted/20 via-card/80 to-muted/10 p-5 dark:from-primary/10 dark:via-card/80 dark:to-transparent">
                <CardTitle>{messages.priceSheets.stateTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <PriceSheetStatusBadge locale={locale} status={priceSheet.status} />
                  <span className="rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground">
                    {priceSheet.itemCount} {messages.priceSheets.itemsCount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border/70 bg-background/85 p-1 dark:bg-background/55">
                  <span
                    className={cn(
                      "rounded-xl px-3 py-2 text-center text-xs font-medium transition-colors",
                      priceSheet.status === "published" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {messages.priceSheets.statusPublished}
                  </span>
                  <span
                    className={cn(
                      "rounded-xl px-3 py-2 text-center text-xs font-medium transition-colors",
                      priceSheet.status === "draft" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {messages.priceSheets.statusDraft}
                  </span>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-muted-foreground dark:bg-background/45">
                    <span>{messages.priceSheets.slugLabel}</span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">/{priceSheet.slug}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-muted-foreground dark:bg-background/45">
                    <span>{messages.priceSheets.themeLabel}</span>
                    <span className="text-foreground">{priceSheet.theme}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-muted-foreground dark:bg-background/45">
                    <span>{messages.priceSheets.appearanceLabel}</span>
                    <span className="text-foreground">{presentationAppearanceLabel}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-muted-foreground dark:bg-background/45">
                    <span>{messages.priceSheets.currencyLabel}</span>
                    <span className="text-foreground">{priceSheet.currency}</span>
                  </div>
                </div>

                <form action={setPriceSheetStatusAction.bind(null, priceSheet.id, nextStatus, `/app/price-sheets/${priceSheet.id}`)}>
                  <Button className="w-full" type="submit" variant="outline">
                    {statusActionLabel}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-[1.45rem] border-destructive/20 bg-card/80 shadow-[0_12px_30px_rgba(15,23,42,0.03)] dark:bg-card/70">
              <CardContent className="p-4">
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
      </div>
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
