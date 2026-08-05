import { Badge, Card, CardContent } from "@unitforge/ui";

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
}

export function PriceSheetLeadsSummary({
  actionLabel,
  inquiriesHref,
  inquiryEnabled,
  leads,
  locale,
  status,
}: PriceSheetLeadsSummaryProps) {
  const latestLead = leads[0];
  const messages = getMessages(locale);
  const isLive = status === "published" && inquiryEnabled;

  return (
    <Card className="border-border/75 bg-card/95 before:via-primary/25 dark:bg-card/90 dark:before:via-primary/35 relative overflow-hidden rounded-[1.55rem] shadow-[0_16px_45px_rgba(15,23,42,0.04)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:to-transparent dark:shadow-[0_16px_45px_rgba(0,0,0,0.18)]">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground flex h-11 min-w-11 items-center justify-center rounded-2xl text-lg font-semibold">
              {leads.length}
            </span>
            <div>
              <p className="text-sm font-semibold">
                {messages.priceSheets.totalReceived}
              </p>
              <p className="text-muted-foreground text-xs">
                {getLeadIntakeLabel(locale, status, inquiryEnabled)}
              </p>
            </div>
          </div>
          <a
            className="border-border/70 bg-background/80 hover:border-primary/40 hover:text-primary dark:bg-background/55 inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-3 text-sm font-medium transition-[border-color,color,transform] duration-200 hover:-translate-y-px motion-reduce:transition-none"
            href={inquiriesHref}
          >
            {actionLabel ?? messages.priceSheets.openInquiries}
          </a>
        </div>

        <div className="border-border/60 bg-background/65 dark:bg-background/40 flex items-start gap-3 rounded-2xl border px-3.5 py-3">
          <span
            className={
              isLive
                ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                : "bg-muted-foreground/35 mt-1.5 h-2 w-2 shrink-0 rounded-full"
            }
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.16em]">
              {messages.priceSheets.latestRequest}
            </p>
            <p className="mt-1 truncate text-sm font-medium">
              {latestLead
                ? latestLead.contactName
                : messages.priceSheets.noInquiriesYet}
            </p>
            {latestLead ? (
              <p className="text-muted-foreground mt-1 text-xs">
                {latestLead.createdAt.toLocaleDateString(
                  locale === "ru" ? "ru-RU" : "en-US",
                  { day: "numeric", month: "short" },
                )}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PriceSheetLeadsPanel({
  inquiryEnabled,
  leads,
  locale,
  status,
}: PriceSheetLeadsPanelProps) {
  const messages = getMessages(locale);

  return (
    <section
      className="border-border/75 bg-card/95 before:via-primary/25 dark:bg-card/90 dark:before:via-primary/35 relative overflow-hidden rounded-[1.65rem] border shadow-[0_18px_55px_rgba(15,23,42,0.045)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:to-transparent dark:shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
      id="sheet-leads"
    >
      <div className="border-border/60 from-muted/20 via-card/80 to-muted/10 dark:from-primary/10 dark:via-card/80 flex flex-col gap-4 border-b bg-gradient-to-r p-5 sm:flex-row sm:items-center sm:justify-between dark:to-transparent">
        <div className="flex min-w-0 items-center gap-3">
          <div className="space-y-1">
            <Badge variant="secondary">
              {messages.priceSheets.inquiryReceived}
            </Badge>
            <h2 className="text-lg font-semibold tracking-tight">
              {messages.priceSheets.inbox}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="border-border/70 bg-background/85 dark:bg-background/55 rounded-2xl border px-4 py-3 shadow-sm sm:min-w-36">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              {messages.priceSheets.totalReceived}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {leads.length}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {leads.length === 0 ? (
          <div className="border-border/80 bg-background/70 dark:bg-background/45 rounded-3xl border border-dashed p-6 sm:p-7">
            <div className="space-y-3">
              <p className="text-lg font-semibold tracking-tight">
                {messages.priceSheets.noLeadsYet}
              </p>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                {getLeadEmptyStateDescription(locale, status, inquiryEnabled)}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {leads.map((lead) => (
              <article
                key={lead.id}
                className="border-border/75 bg-background/85 dark:bg-background/50 rounded-[1.35rem] border p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {lead.contactName}
                      </h3>
                      <Badge variant="outline">{lead.locale}</Badge>
                      <Badge variant="secondary">
                        {messages.priceSheets.inquiryReceived}
                      </Badge>
                    </div>
                    {lead.companyOrBusinessName ? (
                      <p className="text-muted-foreground text-sm">
                        {lead.companyOrBusinessName}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-muted-foreground space-y-1 text-sm sm:text-right">
                    <p>
                      {lead.createdAt.toLocaleString(
                        locale === "ru" ? "ru-RU" : "en-US",
                      )}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">
                      {lead.sheetSlugSnapshot}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border-border/70 bg-card/70 dark:bg-card/55 rounded-2xl border px-4 py-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                      {messages.priceSheets.email}
                    </p>
                    <p className="mt-2 break-all text-sm font-medium">
                      {lead.email}
                    </p>
                  </div>

                  {lead.phoneOrHandle ? (
                    <div className="border-border/70 bg-card/70 dark:bg-card/55 rounded-2xl border px-4 py-3">
                      <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                        {messages.priceSheets.phoneOrHandle}
                      </p>
                      <p className="mt-2 break-all text-sm font-medium">
                        {lead.phoneOrHandle}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="border-border/70 bg-card/70 dark:bg-card/55 mt-4 rounded-2xl border px-4 py-4 sm:px-5">
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                    {messages.priceSheets.inquiry}
                  </p>
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

function getLeadIntakeLabel(
  locale: InterfaceLocale,
  status: "draft" | "published",
  inquiryEnabled: boolean,
) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftOnly;
  }

  return inquiryEnabled
    ? messages.priceSheets.receivingInquiries
    : messages.priceSheets.formHidden;
}

function getLeadEmptyStateDescription(
  locale: InterfaceLocale,
  status: "draft" | "published",
  inquiryEnabled: boolean,
) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftLeadEmpty;
  }

  if (!inquiryEnabled) {
    return messages.priceSheets.hiddenLeadEmpty;
  }

  return messages.priceSheets.activeLeadEmpty;
}
