import { z } from "zod";

import { getBillingPlan } from "./plans";

const stripeScaffoldEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_STUDIO_MONTHLY_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

export const stripeCheckoutRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  planSlug: z.string().min(1),
  successPath: z.string().startsWith("/").default("/app/settings"),
  cancelPath: z.string().startsWith("/").default("/pricing"),
});

export type StripeCheckoutRequest = z.infer<typeof stripeCheckoutRequestSchema>;

export function getStripeScaffoldState(env: Record<string, string | undefined>) {
  const parsed = stripeScaffoldEnvSchema.parse(env);
  const missingKeys = [
    !parsed.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY" : null,
    !parsed.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" : null,
    !parsed.STRIPE_WEBHOOK_SECRET ? "STRIPE_WEBHOOK_SECRET" : null,
    !parsed.STRIPE_PRICE_STUDIO_MONTHLY_ID ? "STRIPE_PRICE_STUDIO_MONTHLY_ID" : null,
  ].filter((value): value is string => value !== null);

  return {
    configured: missingKeys.length === 0,
    missingKeys,
    publishableKeyPresent: Boolean(parsed.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    secretKeyPresent: Boolean(parsed.STRIPE_SECRET_KEY),
    webhookSecretPresent: Boolean(parsed.STRIPE_WEBHOOK_SECRET),
    priceConfigured: Boolean(parsed.STRIPE_PRICE_STUDIO_MONTHLY_ID),
  };
}

export function buildStripeCheckoutUrls(appUrl: string, input: Pick<StripeCheckoutRequest, "successPath" | "cancelPath">) {
  const baseUrl = new URL(appUrl);

  return {
    successUrl: new URL(input.successPath, baseUrl).toString(),
    cancelUrl: new URL(input.cancelPath, baseUrl).toString(),
  };
}

export function getStripeCheckoutScaffold(planSlug: string) {
  const plan = getBillingPlan(planSlug);

  if (!plan) {
    return null;
  }

  return {
    planSlug: plan.slug,
    priceLookupKey: plan.stripePriceLookupKey ?? null,
  };
}
