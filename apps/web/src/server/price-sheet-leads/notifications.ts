import { getRuntimeEnvValue } from "@/server/runtime-env";

const WEBHOOK_URL_ENV = "PRICE_SHEET_LEAD_NOTIFICATION_WEBHOOK_URL";
const WEBHOOK_SECRET_ENV = "PRICE_SHEET_LEAD_NOTIFICATION_WEBHOOK_SECRET";
const WEBHOOK_TIMEOUT_MS = 1_500;

interface PriceSheetLeadTraceInput {
  lead: {
    id: string;
    priceSheetId: string;
    sheetSlugSnapshot: string;
    locale: string;
    createdAt: Date;
  };
  priceSheet: {
    workspaceId: string;
  };
}

interface PriceSheetLeadTraceEvent {
  event: "price_sheet_lead.created";
  leadId: string;
  priceSheetId: string;
  workspaceId: string;
  sheetSlugSnapshot: string;
  locale: string;
  createdAt: string;
  leadInboxPath: string;
  leadInboxUrl: string | null;
}

export async function tracePriceSheetLeadCreated(input: PriceSheetLeadTraceInput) {
  const traceEvent = getPriceSheetLeadTraceEvent(input);

  console.info("[price-sheet-leads] Public lead created.", traceEvent);

  await sendLeadNotification(traceEvent);
}

function getPriceSheetLeadTraceEvent(input: PriceSheetLeadTraceInput): PriceSheetLeadTraceEvent {
  const leadInboxPath = `/app/price-sheets/${input.lead.priceSheetId}#sheet-leads`;

  return {
    event: "price_sheet_lead.created",
    leadId: input.lead.id,
    priceSheetId: input.lead.priceSheetId,
    workspaceId: input.priceSheet.workspaceId,
    sheetSlugSnapshot: input.lead.sheetSlugSnapshot,
    locale: input.lead.locale,
    createdAt: input.lead.createdAt.toISOString(),
    leadInboxPath,
    leadInboxUrl: getAbsoluteLeadInboxUrl(leadInboxPath),
  };
}

async function sendLeadNotification(traceEvent: PriceSheetLeadTraceEvent) {
  const webhookUrl = getRuntimeEnvValue(WEBHOOK_URL_ENV)?.trim();

  if (!webhookUrl) {
    console.warn("[price-sheet-leads] Lead notification webhook is not configured; lead was stored without an external alert.", {
      env: WEBHOOK_URL_ENV,
      leadId: traceEvent.leadId,
      priceSheetId: traceEvent.priceSheetId,
      workspaceId: traceEvent.workspaceId,
    });
    return;
  }

  const parsedWebhookUrl = getSafeWebhookUrl(webhookUrl);

  if (!parsedWebhookUrl) {
    console.warn("[price-sheet-leads] Lead notification webhook URL is invalid; lead was stored without an external alert.", {
      env: WEBHOOK_URL_ENV,
      leadId: traceEvent.leadId,
      priceSheetId: traceEvent.priceSheetId,
      workspaceId: traceEvent.workspaceId,
    });
    return;
  }

  const secret = getRuntimeEnvValue(WEBHOOK_SECRET_ENV)?.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };

    if (secret) {
      headers.authorization = `Bearer ${secret}`;
    }

    const response = await fetch(parsedWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(traceEvent),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("[price-sheet-leads] Lead notification webhook returned a non-success status.", {
        leadId: traceEvent.leadId,
        priceSheetId: traceEvent.priceSheetId,
        workspaceId: traceEvent.workspaceId,
        status: response.status,
      });
    }
  } catch (error) {
    console.warn("[price-sheet-leads] Lead notification webhook failed; lead remains stored.", {
      leadId: traceEvent.leadId,
      priceSheetId: traceEvent.priceSheetId,
      workspaceId: traceEvent.workspaceId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  } finally {
    clearTimeout(timeout);
  }
}

function getSafeWebhookUrl(webhookUrl: string) {
  try {
    const parsedUrl = new URL(webhookUrl);

    if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
      return null;
    }

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return null;
    }

    return parsedUrl;
  } catch {
    return null;
  }
}

function getAbsoluteLeadInboxUrl(path: string) {
  const appUrl = getRuntimeEnvValue("NEXT_PUBLIC_APP_URL")?.trim();

  if (!appUrl) {
    return null;
  }

  try {
    return new URL(path, appUrl).toString();
  } catch {
    return null;
  }
}
