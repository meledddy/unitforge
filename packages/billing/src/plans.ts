import { z } from "zod";

const billingPlanSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  currency: z.literal("AMD"),
  monthlyPrice: z.number().int().nonnegative(),
  annualPrice: z.number().int().nonnegative(),
  trialDays: z.number().int().nonnegative(),
  billingMode: z.literal("assisted_invoice"),
  stripePriceLookupKey: z.string().min(1).optional(),
  features: z.array(z.string().min(1)).min(1),
});

export type BillingPlan = z.infer<typeof billingPlanSchema>;

export const studioPlans = billingPlanSchema.array().parse([
  {
    slug: "studio",
    name: "Unitforge",
    description:
      "A public price page and inquiry inbox for service businesses.",
    currency: "AMD",
    monthlyPrice: 5900,
    annualPrice: 59000,
    trialDays: 14,
    billingMode: "assisted_invoice",
    features: [
      "Public price sheets with your services and prices",
      "Russian and English content",
      "Built-in inquiry form and operator inbox",
      "Launch help for the first published page",
    ],
  },
]);

export function formatPlanPrice(
  price: number,
  currency: BillingPlan["currency"] = "AMD",
  locale = "en-US",
) {
  return new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getBillingPlan(planSlug: string) {
  return studioPlans.find((plan) => plan.slug === planSlug) ?? null;
}
