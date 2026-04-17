import { Badge, Button, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
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
    const leadCountLabel = `${leads.length} ${leads.length === 1 ? messages.priceSheets.leadSingle : messages.priceSheets.leadPlural}`;

    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={messages.priceSheets.editEyebrow}
          title={priceSheet.title}
          description={messages.priceSheets.editDescription}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{leadCountLabel}</Badge>
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
                  <span className="text-sm text-muted-foreground">{priceSheet.itemCount} {messages.priceSheets.itemsCount}</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{messages.priceSheets.slugLabel}: {priceSheet.slug}</p>
                  <p>{messages.priceSheets.themeLabel}: {priceSheet.theme}</p>
                  <p>{messages.priceSheets.currencyLabel}: {priceSheet.currency}</p>
                  <p>{messages.priceSheets.defaultLocaleLabel}: {priceSheet.defaultContentLocale}</p>
                  {priceSheet.description ? <p>{messages.priceSheets.descriptionLabel}: {priceSheet.description}</p> : null}
                  <p>{messages.shared.updated}: {priceSheet.updatedAt.toLocaleString(dateTimeLocale)}</p>
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
                <form action={deletePriceSheetAction.bind(null, priceSheet.id, "/app/price-sheets")}>
                  <Button className="w-full" type="submit" variant="destructive">
                    {messages.priceSheets.deleteButton}
                  </Button>
                </form>
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
