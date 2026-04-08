import { formatPlanPrice, getStripeScaffoldState, studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default function PricingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const stripe = getStripeScaffoldState(process.env);

  return (
    <div className="container space-y-10 py-20">
      <div className="space-y-4">
        <Badge variant="secondary">Pricing placeholder</Badge>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Pricing is structured, not finalized.</h1>
          <p className="text-lg text-muted-foreground">
            The plan model and Stripe scaffold are ready. Final checkout, webhooks, and entitlements are intentionally still pending.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/app/settings">
            Open settings
          </Link>
          <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/app">
            Open dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{studioPlan.name}</CardTitle>
            <CardDescription>{studioPlan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold tracking-tight">{formatPlanPrice(studioPlan.monthlyPriceInCents)}</p>
              <p className="text-sm text-muted-foreground">per month for the studio baseline</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {studioPlan.features.map((feature) => (
                <li key={feature} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe scaffold status</CardTitle>
            <CardDescription>The integration surface exists, but no live checkout session is created yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium text-foreground">Readiness</p>
              <p className="mt-2">{stripe.configured ? "Configuration looks complete." : "Configuration is still incomplete."}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium text-foreground">Missing keys</p>
              <p className="mt-2">{stripe.missingKeys.length > 0 ? stripe.missingKeys.join(", ") : "None"}</p>
            </div>
            <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-4">
              <p className="font-medium text-foreground">Next billing step</p>
              <p className="mt-2">Connect checkout session creation and webhook processing when you are ready to enforce entitlements.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
