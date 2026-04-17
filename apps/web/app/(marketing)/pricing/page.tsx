import { getStripeScaffoldState, studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default async function PricingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const stripe = getStripeScaffoldState(process.env);
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);
  const localizedPlanDescription =
    locale === "ru" ? "Общая операционная база для каждой новой vertical от Unitforge." : studioPlan.description;
  const localizedPlanFeatures =
    locale === "ru"
      ? [
          "Переиспользуемая модель workspace и membership",
          "Общие контракты биллинга и аналитики",
          "Зона продукта Price Sheets уже подготовлена внутри app shell",
        ]
      : studioPlan.features;

  return (
    <div className="container space-y-10 py-20">
      <div className="space-y-4">
        <Badge variant="secondary">{messages.marketing.pricing.badge}</Badge>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{messages.marketing.pricing.title}</h1>
          <p className="text-lg text-muted-foreground">{messages.marketing.pricing.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/app/settings">
            {messages.marketing.pricing.settingsCta}
          </Link>
          <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/app">
            {messages.marketing.pricing.dashboardCta}
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{studioPlan.name}</CardTitle>
            <CardDescription>{localizedPlanDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold tracking-tight">{planPrice}</p>
              <p className="text-sm text-muted-foreground">{messages.marketing.pricing.baselineSuffix}</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {localizedPlanFeatures.map((feature) => (
                <li key={feature} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.marketing.pricing.stripeTitle}</CardTitle>
            <CardDescription>{messages.marketing.pricing.stripeDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium text-foreground">{messages.marketing.pricing.readinessTitle}</p>
              <p className="mt-2">
                {stripe.configured ? messages.marketing.pricing.readinessConfigured : messages.marketing.pricing.readinessIncomplete}
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium text-foreground">{messages.marketing.pricing.missingKeysTitle}</p>
              <p className="mt-2">{stripe.missingKeys.length > 0 ? stripe.missingKeys.join(", ") : messages.shared.none}</p>
            </div>
            <div className="rounded-3xl border border-dashed border-border/80 bg-background/70 p-4">
              <p className="font-medium text-foreground">{messages.marketing.pricing.nextStepTitle}</p>
              <p className="mt-2">{messages.marketing.pricing.nextStepDescription}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
