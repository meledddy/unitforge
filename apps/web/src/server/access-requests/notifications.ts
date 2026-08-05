import type { AccessRequestLocale } from "@unitforge/db";

import type { AccessRequestSource } from "@/features/access-requests/access-request-form";
import { getRuntimeEnvValue } from "@/server/runtime-env";

const WEBHOOK_URL_ENV = "ACCESS_REQUEST_NOTIFICATION_WEBHOOK_URL";
const WEBHOOK_SECRET_ENV = "ACCESS_REQUEST_NOTIFICATION_WEBHOOK_SECRET";
const WEBHOOK_TIMEOUT_MS = 1_500;

interface AccessRequestTraceInput {
  id: string;
  source: AccessRequestSource;
  locale: AccessRequestLocale;
  createdAt: Date;
}

interface AccessRequestTraceEvent {
  event: "access_request.created";
  accessRequestId: string;
  source: AccessRequestSource;
  locale: AccessRequestLocale;
  createdAt: string;
  inboxPath: string;
  inboxUrl: string | null;
}

export async function traceAccessRequestCreated(
  input: AccessRequestTraceInput,
) {
  const event: AccessRequestTraceEvent = {
    event: "access_request.created",
    accessRequestId: input.id,
    source: input.source,
    locale: input.locale,
    createdAt: input.createdAt.toISOString(),
    inboxPath: "/app/access-requests",
    inboxUrl: getAbsoluteInboxUrl(),
  };

  console.info("[access-requests] Request stored.", event);
  await sendNotification(event);
}

async function sendNotification(event: AccessRequestTraceEvent) {
  const webhookUrl = getRuntimeEnvValue(WEBHOOK_URL_ENV)?.trim();

  if (!webhookUrl) {
    console.warn(
      "[access-requests] Notification webhook is not configured; the request remains available in the admin inbox.",
      {
        env: WEBHOOK_URL_ENV,
        accessRequestId: event.accessRequestId,
        source: event.source,
      },
    );
    return;
  }

  const parsedWebhookUrl = getSafeWebhookUrl(webhookUrl);

  if (!parsedWebhookUrl) {
    console.warn(
      "[access-requests] Notification webhook URL is invalid; the request remains available in the admin inbox.",
      {
        env: WEBHOOK_URL_ENV,
        accessRequestId: event.accessRequestId,
        source: event.source,
      },
    );
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
      body: JSON.stringify(event),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(
        "[access-requests] Notification webhook returned a non-success status.",
        {
          accessRequestId: event.accessRequestId,
          source: event.source,
          status: response.status,
        },
      );
    }
  } catch (error) {
    console.warn(
      "[access-requests] Notification webhook failed; the request remains stored.",
      {
        accessRequestId: event.accessRequestId,
        source: event.source,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

function getSafeWebhookUrl(webhookUrl: string) {
  try {
    const parsedUrl = new URL(webhookUrl);

    if (
      process.env.NODE_ENV === "production" &&
      parsedUrl.protocol !== "https:"
    ) {
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

function getAbsoluteInboxUrl() {
  const appUrl = getRuntimeEnvValue("NEXT_PUBLIC_APP_URL")?.trim();

  if (!appUrl) {
    return null;
  }

  try {
    return new URL("/app/access-requests", appUrl).toString();
  } catch {
    return null;
  }
}
