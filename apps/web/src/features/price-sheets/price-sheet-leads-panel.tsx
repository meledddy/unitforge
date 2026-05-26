import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { PriceSheetLeadView } from "@/server/price-sheet-leads/service";

interface PriceSheetLeadsPanelProps {
  locale: InterfaceLocale;
  leads: PriceSheetLeadView[];
  status: "draft" | "published";
  inquiryEnabled: boolean;
}

interface PriceSheetLeadsSummaryProps extends PriceSheetLeadsPanelProps {
  inquiriesHref: string;
  actionLabel?: string;
  showAction?: boolean;
}

export function PriceSheetLeadsSummary({
  actionLabel,
  inquiriesHref,
  inquiryEnabled,
  leads,
  locale,
  showAction = true,
  status,
}: PriceSheetLeadsSummaryProps) {
  const latestLead = leads[0];
  const messages = getMessages(locale);
  const isLive = status === "published" && inquiryEnabled;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr),repeat(2,minmax(0,1fr))]">
      <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_16px_45px_rgba(15,23,42,0.04)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_16px_45px_rgba(0,0,0,0.18)] dark:before:via-primary/35">
        <CardHeader className="gap-4 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary">{messages.priceSheets.totalReceived}</Badge>
              <div className="flex items-end gap-3">
                <CardTitle className="text-3xl sm:text-4xl">{leads.length}</CardTitle>
              </div>
            </div>

            {showAction ? (
              <a className="inline-flex h-9 items-center justify-center rounded-full border border-border/70 bg-background/80 px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary dark:bg-background/55" href={inquiriesHref}>
                {actionLabel ?? messages.priceSheets.openInquiries}
              </a>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_16px_45px_rgba(15,23,42,0.04)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_16px_45px_rgba(0,0,0,0.18)] dark:before:via-primary/35">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5 pb-3">
          <div className="space-y-2">
            <CardDescription>{messages.priceSheets.latestRequest}</CardDescription>
            <CardTitle>{latestLead ? latestLead.contactName : messages.priceSheets.noInquiriesYet}</CardTitle>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-background/95 to-muted/30 dark:from-background/70 dark:to-primary/10" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-primary/35" />
          </span>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {latestLead ? (
            <>
              <p>{latestLead.createdAt.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</p>
              <p>{latestLead.email}</p>
            </>
          ) : (
            <p>{messages.priceSheets.latestInquiryEmpty}</p>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_16px_45px_rgba(15,23,42,0.04)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_16px_45px_rgba(0,0,0,0.18)] dark:before:via-primary/35">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5 pb-3">
          <div className="space-y-2">
            <CardDescription>{messages.priceSheets.pageStatus}</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {isLive ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> : null}
              {getLeadIntakeLabel(locale, status, inquiryEnabled)}
            </CardTitle>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-background/95 to-muted/30 dark:from-background/70 dark:to-primary/10" aria-hidden="true">
            <span className="h-4 w-1.5 rounded-full bg-emerald-500/70" />
          </span>
        </CardHeader>
      </Card>
    </div>
  );
}

export function PriceSheetLeadsPanel({ inquiryEnabled, leads, locale, status }: PriceSheetLeadsPanelProps) {
  const messages = getMessages(locale);

  return (
    <section className="relative overflow-hidden rounded-[1.65rem] border border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/25 before:to-transparent dark:bg-card/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.2)] dark:before:via-primary/35" id="sheet-leads">
      <div className="flex flex-col gap-4 border-b border-border/60 bg-gradient-to-r from-muted/20 via-card/80 to-muted/10 p-5 sm:flex-row sm:items-center sm:justify-between dark:from-primary/10 dark:via-card/80 dark:to-transparent">
        <div className="flex min-w-0 items-center gap-3">
          <div className="space-y-1">
            <Badge variant="secondary">{messages.priceSheets.inquiryReceived}</Badge>
            <h2 className="text-lg font-semibold tracking-tight">{messages.priceSheets.inbox}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3 shadow-sm sm:min-w-36 dark:bg-background/55">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{messages.priceSheets.totalReceived}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{leads.length}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {leads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 sm:p-7 dark:bg-background/45">
            <div className="space-y-3">
              <p className="text-lg font-semibold tracking-tight">{messages.priceSheets.noLeadsYet}</p>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {getLeadEmptyStateDescription(locale, status, inquiryEnabled)}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-[1.35rem] border border-border/75 bg-background/85 p-4 shadow-sm sm:p-5 dark:bg-background/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">{lead.contactName}</h3>
                      <Badge variant="outline">{lead.locale}</Badge>
                      <Badge variant="secondary">{messages.priceSheets.inquiryReceived}</Badge>
                    </div>
                    {lead.companyOrBusinessName ? <p className="text-sm text-muted-foreground">{lead.companyOrBusinessName}</p> : null}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                    <p>{lead.createdAt.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">{lead.sheetSlugSnapshot}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 dark:bg-card/55">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.email}</p>
                    <p className="mt-2 text-sm font-medium break-all">{lead.email}</p>
                  </div>

                  {lead.phoneOrHandle ? (
                    <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 dark:bg-card/55">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.phoneOrHandle}</p>
                      <p className="mt-2 text-sm font-medium break-all">{lead.phoneOrHandle}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 sm:px-5 dark:bg-card/55">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.inquiry}</p>
                  <p className="mt-3 text-sm leading-6">{lead.message}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function PriceSheetLeadNotificationHint({ locale }: { locale: InterfaceLocale }) {
  const messages = getMessages(locale);

  return (
    <Card className="relative overflow-hidden rounded-[1.65rem] border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent dark:bg-card/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <CardHeader className="space-y-3 p-5">
        <Badge variant="secondary">{messages.priceSheets.notificationHintBadge}</Badge>
        <CardTitle>{messages.priceSheets.notificationHintTitle}</CardTitle>
        <CardDescription className="leading-6">{messages.priceSheets.notificationHintDescription}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function getLeadIntakeLabel(locale: InterfaceLocale, status: "draft" | "published", inquiryEnabled: boolean) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftOnly;
  }

  return inquiryEnabled ? messages.priceSheets.receivingInquiries : messages.priceSheets.formHidden;
}

function getLeadEmptyStateDescription(locale: InterfaceLocale, status: "draft" | "published", inquiryEnabled: boolean) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftLeadEmpty;
  }

  if (!inquiryEnabled) {
    return messages.priceSheets.hiddenLeadEmpty;
  }

  return messages.priceSheets.activeLeadEmpty;
}
