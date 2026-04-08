export type AnalyticsEventName =
  | "workspace_created"
  | "subscription_updated"
  | "price_sheet_opened"
  | "import_margin_requested";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackAnalyticsEvent(event: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, payload);
  }
}

