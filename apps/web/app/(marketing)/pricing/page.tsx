import { studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const pricingContent = {
  en: {
    badge: "Early access pricing",
    title: "Simple pricing for the first Unitforge workspace.",
    description:
      "Pilot access covers one workspace, public price sheets, inquiry capture, and secure operator access. Self-serve billing will open later.",
    primaryCta: "Open app",
    secondaryCta: "Back to site",
    planDescription: "Early access to the first live Unitforge workflow for public pricing and inquiry handling.",
    pricingSuffix: "per month, per workspace",
    planFeatures: [
      "One workspace for your team",
      "Public price sheets with EN/RU content support",
      "Built-in inquiry capture and review",
    ],
    detailsTitle: "What to expect",
    detailsDescription: "The current pilot release is intentionally focused and customer-safe.",
    details: [
      {
        title: "Pilot onboarding",
        description: "Workspaces are onboarded directly so the first teams can get started without friction.",
      },
      {
        title: "Customer-facing pricing",
        description: "Use the product to publish pricing pages, keep them current, and collect inquiries.",
      },
      {
        title: "Billing rollout",
        description: "Self-serve checkout will be added later. Early access is handled directly with pilot customers.",
      },
    ],
  },
  ru: {
    badge: "Ранний доступ",
    title: "Простая цена для первого рабочего пространства Unitforge.",
    description:
      "Пилотный доступ включает одно рабочее пространство, публичные прайс-листы, сбор заявок и защищенный доступ для операторов. Самостоятельная оплата появится позже.",
    primaryCta: "Открыть приложение",
    secondaryCta: "Вернуться на сайт",
    planDescription: "Ранний доступ к первому живому сценарию Unitforge для публичных цен и обработки заявок.",
    pricingSuffix: "в месяц за одно рабочее пространство",
    planFeatures: [
      "Одно рабочее пространство для команды",
      "Публичные прайс-листы с поддержкой EN/RU контента",
      "Встроенный сбор и просмотр заявок",
    ],
    detailsTitle: "Что важно знать",
    detailsDescription: "Текущий пилотный релиз намеренно сфокусирован и готов для первых клиентов.",
    details: [
      {
        title: "Пилотное подключение",
        description: "Рабочие пространства подключаются напрямую, чтобы первые команды могли быстро начать работу.",
      },
      {
        title: "Публичные цены",
        description: "Используйте продукт для публикации ценовых страниц, их обновления и сбора заявок.",
      },
      {
        title: "Запуск биллинга",
        description: "Самостоятельная оплата появится позже. На этапе раннего доступа условия согласуются напрямую с пилотными клиентами.",
      },
    ],
  },
} as const;

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default async function PricingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const locale = await getCurrentInterfaceLocale();
  const copy = pricingContent[locale];
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);

  return (
    <div className="container space-y-10 py-20">
      <div className="space-y-4">
        <Badge variant="secondary">{copy.badge}</Badge>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="text-lg text-muted-foreground">{copy.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/app">
            {copy.primaryCta}
          </Link>
          <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/">
            {copy.secondaryCta}
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{studioPlan.name}</CardTitle>
            <CardDescription>{copy.planDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold tracking-tight">{planPrice}</p>
              <p className="text-sm text-muted-foreground">{copy.pricingSuffix}</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {copy.planFeatures.map((feature) => (
                <li key={feature} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.detailsTitle}</CardTitle>
            <CardDescription>{copy.detailsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {copy.details.map((detail) => (
              <div key={detail.title} className="rounded-3xl border border-border/70 bg-background/70 p-4">
                <p className="font-medium text-foreground">{detail.title}</p>
                <p className="mt-2">{detail.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
