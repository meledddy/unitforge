import { buildStripeCheckoutUrls, getBillingPlan, getStripeCheckoutScaffold, getStripeScaffoldState, stripeCheckoutRequestSchema } from "@unitforge/billing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = stripeCheckoutRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid checkout request.",
        issues: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  const plan = getBillingPlan(result.data.planSlug);

  if (!plan) {
    return NextResponse.json({ error: "Unknown billing plan." }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return NextResponse.json(
    {
      message: "Stripe checkout scaffold is in place, but live session creation is not enabled yet.",
      plan: {
        slug: plan.slug,
        name: plan.name,
      },
      checkout: getStripeCheckoutScaffold(plan.slug),
      urls: buildStripeCheckoutUrls(appUrl, result.data),
      stripe: getStripeScaffoldState(process.env),
    },
    { status: 501 },
  );
}

