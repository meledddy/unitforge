import { Badge, buttonVariants, Card, CardContent, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import {
  PriceSheetLeadNotificationHint,
  PriceSheetLeadsPanel,
  PriceSheetLeadsSummary,
} from "@/features/price-sheets/price-sheet-leads-panel";
import { PriceSheetStatusBadge } from "@/features/price-sheets/price-sheet-status-badge";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";
import { listWorkspacePriceSheetLeads } from "@/server/price-sheet-leads/service";
import { getPriceSheetErrorMessage, getWorkspacePriceSheetForEdit, isKnownPriceSheetError } from "@/server/price-sheets/service";

export const dynamic = "force-dynamic";

interface PriceSheetInquiriesPageProps {
  params: Promise<{
    priceSheetId: string;
  }>;
}

export default async function PriceSheetInquiriesPage({ params }: PriceSheetInquiriesPageProps) {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const { priceSheetId } = await params;
  const messages = getMessages(locale);

  try {
    const [priceSheet, leads] = await Promise.all([
      getWorkspacePriceSheetForEdit(session, priceSheetId),
      listWorkspacePriceSheetLeads(session, priceSheetId),
    ]);
    const editorHref = `/app/price-sheets/${priceSheet.id}`;
    const latestLead = leads[0];

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
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link className="transition-colors hover:text-foreground" href="/app/price-sheets">
              {messages.priceSheets.listTitle}
            </Link>
            <span aria-hidden="true">/</span>
            <Link className="transition-colors hover:text-foreground" href={editorHref}>
              {priceSheet.title}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{messages.priceSheets.inbox}</span>
          </div>

          <PageHeader
            eyebrow={messages.priceSheets.inquiryReceived}
            title={messages.priceSheets.inquiriesPageTitle}
            description={messages.priceSheets.inquiriesPageDescription}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="h-8 rounded-full border-border/70 bg-card/70 px-3 text-muted-foreground" variant="outline">
                  {priceSheet.title}
                </Badge>
                <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full bg-card/70 sm:w-auto")} href={editorHref}>
                  {messages.priceSheets.backToEditor}
                </Link>
              </div>
            }
          />

          <PriceSheetLeadsSummary
            inquiriesHref="#sheet-leads"
            inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
            leads={leads}
            locale={locale}
            showAction={false}
            status={priceSheet.status}
          />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr),320px]">
            <PriceSheetLeadsPanel
              inquiryEnabled={priceSheet.publicSettings.inquiryEnabled}
              leads={leads}
              locale={locale}
              status={priceSheet.status}
            />

            <aside className="space-y-4">
              <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.2)] dark:before:via-primary/35">
                <CardHeader className="border-b border-border/55 bg-gradient-to-r from-muted/20 via-card/80 to-muted/10 p-5 dark:from-primary/10 dark:via-card/80 dark:to-transparent">
                  <CardTitle>{messages.priceSheets.sheetContextTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriceSheetStatusBadge locale={locale} status={priceSheet.status} />
                    <Badge variant="outline">
                      {leads.length} {leads.length === 1 ? messages.priceSheets.leadSingle : messages.priceSheets.leadPlural}
                    </Badge>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 dark:bg-background/45">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.slugLabel}</p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em]">/{priceSheet.slug}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 dark:bg-background/45">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.latestRequest}</p>
                    <p className="mt-2 font-medium">{latestLead ? latestLead.contactName : messages.priceSheets.noInquiriesYet}</p>
                  </div>
                </CardContent>
              </Card>

              <PriceSheetLeadNotificationHint locale={locale} />
            </aside>
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
        <PageHeader
          eyebrow={messages.priceSheets.leadsBadge}
          title={messages.priceSheets.editUnavailableTitle}
          description={messages.priceSheets.editUnavailableDescription}
        />
        <PlaceholderPanel title={messages.priceSheets.editUnavailableTitle} description={getPriceSheetErrorMessage(error)} />
      </div>
    );
  }
}
