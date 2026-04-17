import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { PriceSheetLeadView } from "@/server/price-sheet-leads/service";

interface PriceSheetLeadsPanelProps {
  locale: InterfaceLocale;
  leads: PriceSheetLeadView[];
  status: "draft" | "published";
  inquiryEnabled: boolean;
  publicUrl: string;
}

export function PriceSheetLeadsSummary({ inquiryEnabled, leads, locale, publicUrl, status }: PriceSheetLeadsPanelProps) {
  const latestLead = leads[0];
  const messages = getMessages(locale);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr),repeat(2,minmax(0,1fr))]">
      <Card className="border-border/80 bg-background/90">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary">{messages.priceSheets.leadVisibilityBadge}</Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">{formatLeadCount(locale, leads.length)}</CardTitle>
                <CardDescription className="max-w-xl text-sm leading-6">
                  {messages.priceSheets.leadInboxDescription}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href="#sheet-leads">
                {messages.priceSheets.leadsLink}
              </Link>
              {status === "published" ? (
                <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href={publicUrl}>
                  {messages.priceSheets.publicPage}
                </Link>
              ) : null}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <CardDescription>{messages.priceSheets.latestInquiry}</CardDescription>
          <CardTitle>{latestLead ? latestLead.contactName : messages.priceSheets.noInquiriesYet}</CardTitle>
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

      <Card className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <CardDescription>{messages.priceSheets.publicIntake}</CardDescription>
          <CardTitle>{getLeadIntakeLabel(locale, status, inquiryEnabled)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{getLeadIntakeDescription(locale, status, inquiryEnabled)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function PriceSheetLeadsPanel({ inquiryEnabled, leads, locale, publicUrl, status }: PriceSheetLeadsPanelProps) {
  const messages = getMessages(locale);

  return (
    <section className="rounded-[2rem] border border-border/80 bg-card/95 shadow-sm" id="sheet-leads">
      <div className="flex flex-col gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary">{messages.priceSheets.leadsBadge}</Badge>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">{messages.priceSheets.leadInboxTitle}</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{messages.priceSheets.leadInboxDescription}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 sm:min-w-40">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{messages.priceSheets.leadCountLabel}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{leads.length}</p>
        </div>
      </div>

      <div className="p-6 pt-6">
        {leads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 sm:p-7">
            <div className="space-y-3">
              <p className="text-lg font-semibold tracking-tight">{messages.priceSheets.noLeadsYet}</p>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {getLeadEmptyStateDescription(locale, status, inquiryEnabled)}
              </p>
              {status === "published" ? (
                <div className="flex flex-wrap gap-3">
                  <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href={publicUrl}>
                    {messages.priceSheets.publicPage}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-3xl border border-border/80 bg-background/80 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">{lead.contactName}</h3>
                      <Badge variant="outline">{lead.locale}</Badge>
                    </div>
                    {lead.companyOrBusinessName ? <p className="text-sm text-muted-foreground">{lead.companyOrBusinessName}</p> : null}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                    <p>{lead.createdAt.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">{lead.sheetSlugSnapshot}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.email}</p>
                    <p className="mt-2 text-sm font-medium break-all">{lead.email}</p>
                  </div>

                  {lead.phoneOrHandle ? (
                    <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{messages.priceSheets.phoneOrHandle}</p>
                      <p className="mt-2 text-sm font-medium break-all">{lead.phoneOrHandle}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 sm:px-5">
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

function formatLeadCount(locale: InterfaceLocale, count: number) {
  const messages = getMessages(locale);

  return `${count} ${count === 1 ? messages.priceSheets.leadSingle : messages.priceSheets.leadPlural}`;
}

function getLeadIntakeLabel(locale: InterfaceLocale, status: "draft" | "published", inquiryEnabled: boolean) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftOnly;
  }

  return inquiryEnabled ? messages.priceSheets.receivingInquiries : messages.priceSheets.formHidden;
}

function getLeadIntakeDescription(locale: InterfaceLocale, status: "draft" | "published", inquiryEnabled: boolean) {
  const messages = getMessages(locale);

  if (status !== "published") {
    return messages.priceSheets.draftOnlyDescription;
  }

  if (!inquiryEnabled) {
    return messages.priceSheets.hiddenDescription;
  }

  return messages.priceSheets.activeDescription;
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
