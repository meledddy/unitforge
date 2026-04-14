import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import type { PriceSheetLeadView } from "@/server/price-sheet-leads/service";

interface PriceSheetLeadsPanelProps {
  leads: PriceSheetLeadView[];
  status: "draft" | "published";
  inquiryEnabled: boolean;
  publicUrl: string;
}

export function PriceSheetLeadsSummary({ leads, status, inquiryEnabled, publicUrl }: PriceSheetLeadsPanelProps) {
  const latestLead = leads[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr),repeat(2,minmax(0,1fr))]">
      <Card className="border-border/80 bg-background/90">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary">Lead visibility</Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">{formatLeadCount(leads.length)}</CardTitle>
                <CardDescription className="max-w-xl text-sm leading-6">
                  Public inquiries for this sheet are surfaced as an operational area, separate from the pricing editor.
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href="#sheet-leads">
                Open leads
              </Link>
              {status === "published" ? (
                <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href={publicUrl}>
                  Open public page
                </Link>
              ) : null}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <CardDescription>Latest inquiry</CardDescription>
          <CardTitle>{latestLead ? latestLead.contactName : "No inquiries yet"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {latestLead ? (
            <>
              <p>{latestLead.createdAt.toLocaleString()}</p>
              <p>{latestLead.email}</p>
            </>
          ) : (
            <p>New submissions from the public page will appear here as soon as they are received.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-background/90">
        <CardHeader className="pb-3">
          <CardDescription>Public intake</CardDescription>
          <CardTitle>{getLeadIntakeLabel(status, inquiryEnabled)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{getLeadIntakeDescription(status, inquiryEnabled)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function PriceSheetLeadsPanel({ leads, status, inquiryEnabled, publicUrl }: PriceSheetLeadsPanelProps) {
  return (
    <section className="rounded-[2rem] border border-border/80 bg-card/95 shadow-sm" id="sheet-leads">
      <div className="flex flex-col gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary">Leads</Badge>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Lead inbox</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Submitted inquiries for this Price Sheet live here as an operational area. They stay separate from pricing edits so
              operators can review demand without hunting through the form.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 sm:min-w-40">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lead count</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{leads.length}</p>
        </div>
      </div>

      <div className="p-6 pt-6">
        {leads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-6 sm:p-7">
            <div className="space-y-3">
              <p className="text-lg font-semibold tracking-tight">No leads yet</p>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {getLeadEmptyStateDescription(status, inquiryEnabled)}
              </p>
              {status === "published" ? (
                <div className="flex flex-wrap gap-3">
                  <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full sm:w-auto")} href={publicUrl}>
                    Open public page
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
                    <p>{lead.createdAt.toLocaleString()}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">{lead.sheetSlugSnapshot}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</p>
                    <p className="mt-2 text-sm font-medium break-all">{lead.email}</p>
                  </div>

                  {lead.phoneOrHandle ? (
                    <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Phone / handle</p>
                      <p className="mt-2 text-sm font-medium break-all">{lead.phoneOrHandle}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 sm:px-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Inquiry</p>
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

function formatLeadCount(count: number) {
  return `${count} ${count === 1 ? "lead" : "leads"}`;
}

function getLeadIntakeLabel(status: "draft" | "published", inquiryEnabled: boolean) {
  if (status !== "published") {
    return "Draft only";
  }

  return inquiryEnabled ? "Receiving inquiries" : "Form hidden";
}

function getLeadIntakeDescription(status: "draft" | "published", inquiryEnabled: boolean) {
  if (status !== "published") {
    return "Draft Price Sheets are private. Leads can start arriving only after the sheet is published.";
  }

  if (!inquiryEnabled) {
    return "The public page is live, but the inquiry form is hidden in the public settings for this sheet.";
  }

  return "The public page is published and the inquiry form is active. New submissions will land in this inbox.";
}

function getLeadEmptyStateDescription(status: "draft" | "published", inquiryEnabled: boolean) {
  if (status !== "published") {
    return "This Price Sheet is still in draft, so visitors cannot open it publicly or submit inquiries yet.";
  }

  if (!inquiryEnabled) {
    return "The public inquiry form is currently hidden. Enable it in the sheet settings when you want to start collecting leads.";
  }

  return "The public inquiry form is active. When a visitor submits a request from the published page, it will appear here immediately.";
}
