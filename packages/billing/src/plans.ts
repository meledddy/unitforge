import { z } from "zod";

const billingPlanSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  monthlyPriceInCents: z.number().int().nonnegative(),
  stripePriceLookupKey: z.string().min(1).optional(),
  features: z.array(z.string().min(1)).min(1),
});

export type BillingPlan = z.infer<typeof billingPlanSchema>;

export const studioPlans = billingPlanSchema.array().parse([
  {
    slug: "studio",
    name: "Studio",
    description: "A shared operating baseline for each new Unitforge vertical.",
    monthlyPriceInCents: 4900,
    stripePriceLookupKey: "studio-monthly",
    features: [
      "Reusable workspace and membership model",
      "Shared billing and analytics contracts",
      "Price sheet product area scaffolded in the app shell",
    ],
  },
]);

export function formatPlanPrice(monthlyPriceInCents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
    maximumFractionDigits: 0,
  }).format(monthlyPriceInCents / 100);
}

export function getBillingPlan(planSlug: string) {
  return studioPlans.find((plan) => plan.slug === planSlug) ?? null;
}

