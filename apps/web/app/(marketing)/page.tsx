import { studioPlans } from "@unitforge/billing";
import { productSurfaces, studioCapabilities } from "@unitforge/core";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

const sharedPackages = ["ui", "core", "db", "billing", "analytics", "config"] as const;

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default async function LandingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);
  const localizedCapabilities = studioCapabilities.map((capability) => {
    if (capability.title === "Marketing pages") {
      return locale === "ru"
        ? { title: "Маркетинговые страницы", description: "Запускайте продуктовые нарративы из того же репозитория, токенов и UI-системы." }
        : capability;
    }

    if (capability.title === "Authenticated app") {
      return locale === "ru"
        ? { title: "Защищенное приложение", description: "Развивайте каждый продукт поверх общих примитивов workspace, биллинга и аналитики." }
        : capability;
    }

    return locale === "ru"
      ? { title: "Операционные инструменты", description: "Держите сфокусированные маршруты вроде прайс-листов и import workflows без раздувания базовой оболочки." }
      : capability;
  });
  const localizedProductSurfaces = productSurfaces.map((surface) => {
    if (surface.href === "/app/price-sheets") {
      return locale === "ru"
        ? { ...surface, title: "Прайс-листы", description: "Данные ценообразования в рамках workspace со схемой, готовой для Drizzle-запросов." }
        : surface;
    }

    return locale === "ru"
      ? { ...surface, title: "Import Margin", description: "Маршрут-заполнитель, зарезервированный для будущего import margin workflow." }
      : surface;
  });
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
    <div className="pb-16">
      <section className="container py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="secondary">{messages.marketing.home.badge}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                {messages.marketing.home.title}
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                {messages.marketing.home.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/app">
                {messages.marketing.home.primaryCta}
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/pricing">
                {messages.marketing.home.secondaryCta}
              </Link>
            </div>
          </div>
          <Card className="border-primary/10 bg-card/90">
            <CardHeader>
              <CardTitle>{messages.marketing.home.foundationTitle}</CardTitle>
              <CardDescription>{messages.marketing.home.foundationDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {sharedPackages.map((pkg) => (
                  <Badge key={pkg} variant="outline" className="px-3 py-1">
                    {pkg}
                  </Badge>
                ))}
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
                <p className="font-medium">{messages.marketing.home.readyTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{messages.marketing.home.readyDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-20" id="platform">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{messages.marketing.home.platformEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{messages.marketing.home.platformTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {localizedCapabilities.map((capability) => (
            <Card key={capability.title}>
              <CardHeader>
                <CardTitle>{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 pb-12 lg:grid-cols-[0.95fr,1.05fr]" id="pricing">
        <Card>
          <CardHeader>
            <CardTitle>{studioPlan.name}</CardTitle>
            <CardDescription>{localizedPlanDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold tracking-tight">{planPrice}</p>
              <p className="text-sm text-muted-foreground">{messages.marketing.home.pricingSuffix}</p>
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
            <CardTitle>{messages.marketing.home.productAreasTitle}</CardTitle>
            <CardDescription>{messages.marketing.home.productAreasDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {localizedProductSurfaces.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="rounded-3xl border border-border/70 bg-background/70 p-5 transition-colors hover:border-accent"
              >
                <p className="font-medium">{surface.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{surface.description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
