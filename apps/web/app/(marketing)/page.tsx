import { studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const landingContent = {
  en: {
    badge: "Pricing operations",
    title: "Publish clear price sheets and handle inquiries in one workspace.",
    description:
      "Unitforge helps service businesses keep pricing public, current, and easy to manage. Share polished pricing pages, update them quickly, and review new inquiries in one secure app.",
    primaryCta: "Open app",
    secondaryCta: "View pricing",
    foundationTitle: "What is live today",
    foundationDescription: "The first Unitforge release is focused and practical for pilot teams.",
    foundationItems: ["Public price sheets", "Secure operator workspace", "Inquiry capture and review"],
    readyTitle: "Built for the first pilot customers.",
    readyDescription: "Start with one calm workflow for publishing pricing and handling inquiries, then expand as more tools are released.",
    platformEyebrow: "Product",
    platformTitle: "One calm workspace for pricing and follow-up.",
    capabilities: [
      {
        title: "Public price sheets",
        description: "Publish structured pricing pages with sections, localized content, and a shareable public link.",
      },
      {
        title: "Protected workspace",
        description: "Manage drafts, updates, and publishing behind a secure operator login.",
      },
      {
        title: "Inquiry capture",
        description: "Collect customer inquiries from the public page and review them without leaving the workspace.",
      },
    ],
    pricingSuffix: "per month, per workspace",
    planDescription: "Early access to the first Unitforge workspace for client-facing pricing and inquiry handling.",
    planFeatures: [
      "One workspace for your team",
      "Public price sheets with EN/RU content support",
      "Built-in inquiry capture and operator review",
    ],
    productAreasTitle: "Start with Price Sheets",
    productAreasDescription: "Price Sheets is live today. Additional workflows will arrive as the product expands.",
    priceSheetsTitle: "Price Sheets",
    priceSheetsDescription: "Publish public pricing pages, keep them current, and capture inquiries in one flow.",
    comingSoonTitle: "More workflows soon",
    comingSoonDescription: "New operational tools will be added without changing your current workspace.",
  },
  ru: {
    badge: "Ценовые операции",
    title: "Публикуйте понятные прайс-листы и собирайте заявки в одном рабочем пространстве.",
    description:
      "Unitforge помогает сервисным бизнесам держать цены публичными, актуальными и удобными в управлении. Публикуйте аккуратные ценовые страницы, быстро обновляйте их и разбирайте новые заявки в одном защищенном приложении.",
    primaryCta: "Открыть приложение",
    secondaryCta: "Посмотреть тарифы",
    foundationTitle: "Что уже доступно",
    foundationDescription: "Первый релиз Unitforge сфокусирован на практичном пилотном сценарии.",
    foundationItems: ["Публичные прайс-листы", "Защищенное рабочее пространство", "Сбор и просмотр заявок"],
    readyTitle: "Подходит для первых пилотных клиентов.",
    readyDescription: "Начните с одного понятного сценария для публикации цен и обработки заявок, а затем подключайте новые инструменты по мере развития продукта.",
    platformEyebrow: "Продукт",
    platformTitle: "Одно спокойное рабочее пространство для цен и заявок.",
    capabilities: [
      {
        title: "Публичные прайс-листы",
        description: "Публикуйте структурированные ценовые страницы с разделами, локализованным контентом и публичной ссылкой.",
      },
      {
        title: "Защищенное приложение",
        description: "Управляйте черновиками, обновлениями и публикацией через защищенный вход для операторов.",
      },
      {
        title: "Сбор заявок",
        description: "Получайте заявки с публичной страницы и просматривайте их прямо в рабочем пространстве.",
      },
    ],
    pricingSuffix: "в месяц за одно рабочее пространство",
    planDescription: "Ранний доступ к первому рабочему пространству Unitforge для публичных прайс-листов и обработки заявок.",
    planFeatures: [
      "Одно рабочее пространство для команды",
      "Публичные прайс-листы с поддержкой EN/RU контента",
      "Встроенный сбор заявок и операторский просмотр",
    ],
    productAreasTitle: "Начните с прайс-листов",
    productAreasDescription: "Прайс-листы уже доступны. Следующие рабочие сценарии появятся по мере развития продукта.",
    priceSheetsTitle: "Прайс-листы",
    priceSheetsDescription: "Публикуйте публичные ценовые страницы, обновляйте их и собирайте заявки в одном потоке.",
    comingSoonTitle: "Следующие сценарии позже",
    comingSoonDescription: "Новые операционные инструменты будут добавляться без изменений в вашем текущем рабочем пространстве.",
  },
} as const;

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
  const copy = landingContent[locale];
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);

  return (
    <div className="pb-16">
      <section className="container py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="secondary">{copy.badge}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
              <p className="max-w-2xl text-lg text-muted-foreground">{copy.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/app">
                {copy.primaryCta}
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/pricing">
                {copy.secondaryCta}
              </Link>
            </div>
          </div>

          <Card className="border-primary/10 bg-card/90">
            <CardHeader>
              <CardTitle>{copy.foundationTitle}</CardTitle>
              <CardDescription>{copy.foundationDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {copy.foundationItems.map((item) => (
                  <li key={item} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
                <p className="font-medium">{copy.readyTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{copy.readyDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-20" id="platform">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{copy.platformEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{copy.platformTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.capabilities.map((capability) => (
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
            <CardTitle>{copy.productAreasTitle}</CardTitle>
            <CardDescription>{copy.productAreasDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link
              href="/app/price-sheets"
              className="rounded-3xl border border-border/70 bg-background/70 p-5 transition-colors hover:border-accent"
            >
              <p className="font-medium">{copy.priceSheetsTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.priceSheetsDescription}</p>
            </Link>
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="font-medium">{copy.comingSoonTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{copy.comingSoonDescription}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
