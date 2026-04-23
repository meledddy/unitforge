import { studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { BrandMark } from "@/components/marketing/brand-mark";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getCurrentAppShellSession } from "@/server/current-session";

const surfaceTransitionClassName =
  "transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const landingContent = {
  en: {
    badge: "For service businesses",
    title: "Show services clearly and receive new requests in one place",
    description: "One clean public page with prices, work examples, and a request form. Everything stays under your brand.",
    primaryCta: "Start free",
    secondaryCta: "See a sample",
    trustPoints: ["No card", "Ready in minutes", "Cancel anytime"],
    showcaseEyebrow: "Your public page",
    showcaseTitle: "Services and prices",
    showcaseBadge: "Under your brand",
    showcaseItems: [
      { name: "Website design", price: "from $490" },
      { name: "Ongoing support", price: "from $150 / month" },
      { name: "SEO review", price: "from $100" },
    ],
    showcaseCta: "Send request",
    showcaseResponse: "Clients can send a request right away",
    showcaseDelivery: "Every request lands in one calm inbox.",
    showcaseMetricLabel: "Requests this week",
    showcaseMetricValue: "12",
    showcaseMetricMeta: "All from the public page",
    requestTitle: "New request",
    requestMeta: "Kitchen renovation • 2 min ago",
    requestBody: "Asked for an estimate and a call today.",
    benefitsEyebrow: "What you get",
    benefitsTitle: "Everything you need to launch a page clients understand.",
    benefitsDescription: "No complex setup. Just clear services, incoming requests, and simple updates when prices change.",
    capabilities: [
      {
        title: "A clear public page",
        description: "Services, prices, and examples arranged the way clients expect to read them.",
      },
      {
        title: "Requests in one place",
        description: "Every request lands in one calm place instead of disappearing across chats and email.",
      },
      {
        title: "Easy to keep current",
        description: "Change prices or services quickly without rebuilding the page every time something shifts.",
      },
    ],
    pricingEyebrow: "Simple price",
    pricingLead: "Start with one branded page, request forms, and the essentials to start receiving enquiries quickly.",
    pricingSuffix: "/ month",
    planDescription: "Everything you need to present services clearly and start receiving requests.",
    pricingHighlights: ["Best for one public service page", "Setup help included"],
    pricingCta: "Try for free",
    pricingTrial: "14 days free, no card",
    planFeatures: [
      "One public page with your services",
      "Request form and notifications",
      "Reviews and work examples",
      "Your logo and domain",
      "Email support",
      "Updates and security",
    ],
    supportEyebrow: "Included with every account",
    supportItems: [
      {
        title: "14-day free trial",
        description: "Start without risk and cancel whenever you want.",
      },
      {
        title: "Requests kept safe",
        description: "Client requests stay in one protected place.",
      },
      {
        title: "Help with setup",
        description: "We help you publish the first page and answer early questions.",
      },
    ],
  },
  ru: {
    badge: "Для сервисных бизнесов",
    title: "Покажите услуги и получайте новые заявки в одном месте",
    description: "Одна аккуратная публичная страница с ценами, примерами работ и формой заявки. Всё под вашим брендом.",
    primaryCta: "Запустить бесплатно",
    secondaryCta: "Посмотреть пример",
    trustPoints: ["Без карты", "Запуск за минуты", "Отмена в любой момент"],
    showcaseEyebrow: "Ваша публичная страница",
    showcaseTitle: "Услуги и цены",
    showcaseBadge: "Под вашим брендом",
    showcaseItems: [
      { name: "Разработка сайта", price: "от 49 000 ₽" },
      { name: "Поддержка и обновления", price: "от 15 000 ₽ / мес" },
      { name: "SEO-аудит", price: "от 10 000 ₽" },
    ],
    showcaseCta: "Оставить заявку",
    showcaseResponse: "Клиент может оставить заявку сразу на странице",
    showcaseDelivery: "Каждая заявка попадает в одно спокойное место.",
    showcaseMetricLabel: "Заявок за неделю",
    showcaseMetricValue: "12",
    showcaseMetricMeta: "Все пришли с публичной страницы",
    requestTitle: "Новая заявка",
    requestMeta: "Кухня под ключ • 2 минуты назад",
    requestBody: "Попросили смету и звонок сегодня.",
    benefitsEyebrow: "Что входит",
    benefitsTitle: "Всё, чтобы быстро запустить страницу, которую клиент понимает с первого взгляда.",
    benefitsDescription: "Без лишней настройки. Только понятные услуги, входящие заявки и простые обновления.",
    capabilities: [
      {
        title: "Понятная публичная страница",
        description: "Услуги, цены и примеры работ в формате, который клиенту легко просмотреть.",
      },
      {
        title: "Заявки в одном месте",
        description: "Каждая заявка попадает в одно спокойное место, а не теряется в переписках и почте.",
      },
      {
        title: "Легко поддерживать в порядке",
        description: "Меняйте цены и услуги без переделки страницы каждый раз, когда что-то обновилось.",
      },
    ],
    pricingEyebrow: "Простая цена",
    pricingLead: "Стартуйте с одной брендированной страницы, формой заявки и всем, что нужно для первых обращений.",
    pricingSuffix: "/ мес",
    planDescription: "Всё, чтобы спокойно показать услуги и начать получать заявки.",
    pricingHighlights: ["Подходит для одной публичной страницы", "Поможем с запуском"],
    pricingCta: "Попробовать бесплатно",
    pricingTrial: "14 дней бесплатно, без карты",
    planFeatures: [
      "Одна публичная страница с вашими услугами",
      "Форма заявки и уведомления",
      "Отзывы и примеры работ",
      "Ваш логотип и домен",
      "Поддержка по email",
      "Обновления и безопасность",
    ],
    supportEyebrow: "В каждом аккаунте",
    supportItems: [
      {
        title: "14 дней бесплатно",
        description: "Начните без риска и отмените в любой момент.",
      },
      {
        title: "Заявки под защитой",
        description: "Все обращения клиентов остаются в одном защищённом месте.",
      },
      {
        title: "Помощь со стартом",
        description: "Подскажем, как собрать первую страницу и быстро запуститься.",
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

export default async function LandingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const [locale, session] = await Promise.all([getCurrentInterfaceLocale(), getCurrentAppShellSession()]);
  const copy = landingContent[locale];
  const primaryCtaHref = session ? "/app" : "/login";
  const primaryCtaLabel = session ? (locale === "ru" ? "Открыть приложение" : "Open app") : copy.primaryCta;
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);

  return (
    <div className="relative overflow-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,hsl(var(--marketing-glow)/0.12),transparent_58%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[13rem] h-[19rem] w-[19rem] -translate-x-1/2 rounded-full bg-[hsl(var(--marketing-glow)/0.1)] blur-3xl sm:h-[24rem] sm:w-[24rem]" />

      <section className="container relative py-12 sm:py-16 lg:py-24">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.86fr),minmax(0,1.14fr)] xl:items-center xl:gap-14">
          <div className="space-y-8">
            <Badge
              className={cn(
                "border-[hsl(var(--marketing-border-strong)/0.4)] bg-[hsl(var(--marketing-accent-soft)/0.44)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--marketing-foreground-soft))]",
                surfaceTransitionClassName,
              )}
              variant="outline"
            >
              {copy.badge}
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-serif text-[3.15rem] font-medium leading-[0.9] tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[4.45rem] lg:text-[5.25rem]">
                {copy.title}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[hsl(var(--marketing-foreground-soft))] sm:text-[1.45rem] sm:leading-8">
                {copy.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-full border border-[hsl(var(--marketing-border-strong)/0.32)] bg-[hsl(var(--marketing-primary))] px-7 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_28px_60px_-30px_hsl(var(--marketing-shadow)/0.42)] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:opacity-95 motion-reduce:transition-none",
                )}
                href={primaryCtaHref}
              >
                {primaryCtaLabel}
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "group h-14 rounded-full border-[hsl(var(--marketing-border-strong)/0.4)] bg-[hsl(var(--marketing-surface)/0.68)] px-6 text-base font-medium text-[hsl(var(--marketing-foreground))] shadow-[0_20px_42px_-34px_hsl(var(--marketing-shadow)/0.16)] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-[hsl(var(--marketing-surface-elevated))] motion-reduce:transition-none",
                )}
                href="/#showcase"
              >
                <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full border border-[hsl(var(--marketing-border-strong)/0.4)] text-[hsl(var(--marketing-accent))] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none">
                  <MarketingIcon className="h-3.5 w-3.5" name="play" />
                </span>
                {copy.secondaryCta}
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {copy.trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--marketing-accent)/0.18)] text-[hsl(var(--marketing-accent))]">
                    <MarketingIcon className="h-3.5 w-3.5" name="check" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative xl:pl-8" id="showcase">
            <div className="pointer-events-none absolute inset-x-[12%] bottom-6 h-28 rounded-full bg-[hsl(var(--marketing-glow)/0.16)] blur-3xl" />

            <div
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] border border-[hsl(var(--marketing-border)/0.74)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface)),hsl(var(--marketing-surface-muted)))] p-5 shadow-[0_36px_90px_-48px_hsl(var(--marketing-shadow)/0.36)] sm:p-7",
                surfaceTransitionClassName,
              )}
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),14rem]">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface-elevated))] text-[hsl(var(--marketing-accent))] shadow-[0_18px_40px_-28px_hsl(var(--marketing-shadow)/0.24)]",
                          surfaceTransitionClassName,
                        )}
                      >
                        <BrandMark className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-[hsl(var(--marketing-foreground-muted))]">
                          {copy.showcaseEyebrow}
                        </p>
                        <p className="mt-1 text-[1.7rem] font-semibold tracking-[-0.05em] text-[hsl(var(--marketing-foreground))]">
                          {copy.showcaseTitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface-elevated)/0.72)] px-3 py-2 text-xs font-medium text-[hsl(var(--marketing-foreground-soft))]",
                        surfaceTransitionClassName,
                      )}
                    >
                      {copy.showcaseBadge}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "overflow-hidden rounded-[1.55rem] border border-[hsl(var(--marketing-border)/0.74)] bg-[hsl(var(--marketing-surface-elevated)/0.76)]",
                      surfaceTransitionClassName,
                    )}
                  >
                    {copy.showcaseItems.map((item, index) => (
                      <div
                        key={item.name}
                        className={cn(
                          "flex items-center justify-between gap-4 px-5 py-4 text-sm sm:text-base",
                          index !== copy.showcaseItems.length - 1 && "border-b border-[hsl(var(--marketing-border)/0.52)]",
                        )}
                      >
                        <span className="font-medium text-[hsl(var(--marketing-foreground))]">{item.name}</span>
                        <span className="text-[hsl(var(--marketing-foreground-soft))]">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={cn(
                      "rounded-[1.55rem] border border-[hsl(var(--marketing-border)/0.74)] bg-[hsl(var(--marketing-surface-elevated)/0.72)] p-4",
                      surfaceTransitionClassName,
                    )}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-base font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">{copy.showcaseResponse}</p>
                        <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">{copy.showcaseDelivery}</p>
                      </div>
                      <div className="flex h-12 items-center justify-center gap-3 rounded-full border border-[hsl(var(--marketing-border-strong)/0.36)] bg-[linear-gradient(135deg,hsl(var(--marketing-accent-soft)),hsl(var(--marketing-accent)/0.62))] px-5 text-base font-semibold text-[hsl(var(--marketing-foreground))] shadow-[0_18px_42px_-26px_hsl(var(--marketing-shadow)/0.26)] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] motion-reduce:transition-none">
                        <span>{copy.showcaseCta}</span>
                        <MarketingIcon className="h-4 w-4" name="send" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.74)] bg-[hsl(var(--marketing-surface-elevated)/0.84)] p-5 shadow-[0_20px_48px_-34px_hsl(var(--marketing-shadow)/0.24)]",
                    surfaceTransitionClassName,
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--marketing-accent-soft)/0.72)] text-[hsl(var(--marketing-accent))]">
                      <MarketingIcon className="h-5 w-5" name="mail" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[hsl(var(--marketing-foreground))]">{copy.requestTitle}</p>
                      <p className="text-xs text-[hsl(var(--marketing-foreground-muted))]">{copy.requestMeta}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">{copy.requestBody}</p>

                  <div className="mt-5 border-t border-[hsl(var(--marketing-border)/0.58)] pt-4">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[hsl(var(--marketing-foreground-muted))]">
                      {copy.showcaseMetricLabel}
                    </p>
                    <div className="mt-3 flex items-end gap-3">
                      <p className="text-[2.8rem] font-semibold leading-none tracking-[-0.06em] text-[hsl(var(--marketing-foreground))]">
                        {copy.showcaseMetricValue}
                      </p>
                      <p className="pb-1 text-sm text-[hsl(var(--marketing-foreground-soft))]">{copy.showcaseMetricMeta}</p>
                    </div>
                    <svg aria-hidden="true" className="mt-4 h-10 w-full text-[hsl(var(--marketing-accent))]" fill="none" viewBox="0 0 132 40">
                      <path
                        d="M2 28C15 23 25 31 37 26C49 21 56 30 69 23C79 18 86 27 97 18C106 10 115 20 130 12"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container relative py-12 sm:py-16" id="benefits">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.7fr),minmax(0,1.3fr)] xl:items-start xl:gap-12">
          <div className="max-w-xl space-y-4">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-[hsl(var(--marketing-foreground-muted))]">
              {copy.benefitsEyebrow}
            </p>
            <h2 className="max-w-2xl text-balance text-[2.5rem] font-semibold tracking-[-0.06em] text-[hsl(var(--marketing-foreground))] sm:text-[3.15rem]">
              {copy.benefitsTitle}
            </h2>
            <p className="max-w-lg text-base leading-7 text-[hsl(var(--marketing-foreground-soft))] sm:text-lg sm:leading-8">
              {copy.benefitsDescription}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {copy.capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className={cn(
                  "group rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.62)] bg-[hsl(var(--marketing-surface)/0.44)] p-6 shadow-[0_18px_48px_-44px_hsl(var(--marketing-shadow)/0.24)] backdrop-blur-sm hover:-translate-y-[2px] hover:border-[hsl(var(--marketing-border-strong)/0.46)] hover:bg-[hsl(var(--marketing-surface)/0.64)]",
                  surfaceTransitionClassName,
                )}
              >
                <span
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-[hsl(var(--marketing-border)/0.56)] bg-[hsl(var(--marketing-surface-elevated)/0.76)] text-[hsl(var(--marketing-accent))]",
                    surfaceTransitionClassName,
                  )}
                >
                  <MarketingIcon className="h-6 w-6" name={getCapabilityIcon(index)} />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-[hsl(var(--marketing-foreground))]">{capability.title}</h3>
                <p className="mt-3 text-base leading-7 text-[hsl(var(--marketing-foreground-soft))]">{capability.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container relative py-12 sm:py-16" id="offer">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.7rem] border border-[hsl(var(--marketing-pricing-edge)/0.72)] bg-[linear-gradient(135deg,hsl(var(--marketing-surface)),hsl(var(--marketing-pricing-surface))_46%,hsl(var(--marketing-surface)))] px-6 py-7 shadow-[0_42px_110px_-56px_hsl(var(--marketing-shadow)/0.38)] sm:px-8 sm:py-9",
            surfaceTransitionClassName,
          )}
        >
          <div className="pointer-events-none absolute right-16 top-0 h-36 w-36 rounded-full bg-[hsl(var(--marketing-glow)/0.16)] blur-3xl" />

          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,0.82fr),minmax(0,1.18fr)] xl:gap-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-[hsl(var(--marketing-accent))]">{copy.pricingEyebrow}</p>
                <h2 className="font-serif text-[3rem] font-medium leading-none tracking-[-0.05em] text-[hsl(var(--marketing-foreground))] sm:text-[3.4rem]">
                  {studioPlan.name}
                </h2>
                <p className="max-w-xl text-lg leading-8 text-[hsl(var(--marketing-foreground-soft))]">{copy.pricingLead}</p>
              </div>

              <div
                className={cn(
                  "rounded-[2rem] border border-[hsl(var(--marketing-border)/0.74)] bg-[hsl(var(--marketing-surface-elevated)/0.82)] p-5 shadow-[0_22px_54px_-34px_hsl(var(--marketing-shadow)/0.24)]",
                  surfaceTransitionClassName,
                )}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-end gap-2">
                      <p className="text-[4rem] font-semibold leading-none tracking-[-0.08em] text-[hsl(var(--marketing-foreground))]">{planPrice}</p>
                      <p className="pb-2 text-lg text-[hsl(var(--marketing-foreground-soft))]">{copy.pricingSuffix}</p>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">{copy.planDescription}</p>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-14 rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-6 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_24px_54px_-28px_hsl(var(--marketing-shadow)/0.42)] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:opacity-95 motion-reduce:transition-none",
                      )}
                      href={primaryCtaHref}
                    >
                      {session ? primaryCtaLabel : copy.pricingCta}
                    </Link>
                    <p className="text-sm text-[hsl(var(--marketing-foreground-muted))]">{copy.pricingTrial}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {copy.pricingHighlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={cn(
                        "inline-flex items-center rounded-full border border-[hsl(var(--marketing-border)/0.62)] bg-[hsl(var(--marketing-surface)/0.72)] px-3 py-2 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))]",
                        surfaceTransitionClassName,
                      )}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {copy.planFeatures.map((feature) => (
                <div
                  key={feature}
                  className={cn(
                    "rounded-[1.55rem] border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface-elevated)/0.76)] px-4 py-4 shadow-[0_18px_42px_-38px_hsl(var(--marketing-shadow)/0.18)]",
                    surfaceTransitionClassName,
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--marketing-accent)/0.18)] text-[hsl(var(--marketing-accent))]">
                      <MarketingIcon className="h-3.5 w-3.5" name="check" />
                    </span>
                    <p className="text-base leading-7 text-[hsl(var(--marketing-foreground-soft))]">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container relative py-10 sm:py-14" id="support">
        <div
          className={cn(
            "rounded-[2rem] border border-[hsl(var(--marketing-border)/0.62)] bg-[hsl(var(--marketing-surface)/0.52)] px-5 py-6 shadow-[0_24px_60px_-48px_hsl(var(--marketing-shadow)/0.2)] backdrop-blur-sm sm:px-6",
            surfaceTransitionClassName,
          )}
        >
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.26em] text-[hsl(var(--marketing-foreground-muted))]">
            {copy.supportEyebrow}
          </p>

          <div className="grid gap-4 lg:grid-cols-3">
            {copy.supportItems.map((item, index) => (
              <article key={item.title} className="flex items-start gap-3 rounded-[1.4rem] border border-[hsl(var(--marketing-border)/0.54)] bg-[hsl(var(--marketing-surface-elevated)/0.56)] px-4 py-4">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-[hsl(var(--marketing-accent-soft)/0.5)] text-[hsl(var(--marketing-accent))]">
                  <MarketingIcon className="h-5 w-5" name={getSupportIcon(index)} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCapabilityIcon(index: number) {
  if (index === 0) {
    return "document" as const;
  }

  if (index === 1) {
    return "mail" as const;
  }

  return "sliders" as const;
}

function getSupportIcon(index: number) {
  if (index === 0) {
    return "shield" as const;
  }

  if (index === 1) {
    return "lock" as const;
  }

  return "support" as const;
}

function MarketingIcon({
  className,
  name,
}: {
  className?: string;
  name: "check" | "document" | "lock" | "mail" | "play" | "send" | "shield" | "sliders" | "support";
}) {
  if (name === "check") {
    return (
      <svg className={className} fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg className={className} fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4.5L11.5 8L5 11.5V4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "send") {
    return (
      <svg className={className} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17 3L9.25 10.75M17 3L12 17L9.25 10.75M17 3L3 8L9.25 10.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 3.5H14.5L19.5 8.5V20.5H8C6.9 20.5 6 19.6 6 18.5V5.5C6 4.4 6.9 3.5 8 3.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M14 3.5V8.5H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 7.5C4 6.4 4.9 5.5 6 5.5H18C19.1 5.5 20 6.4 20 7.5V16.5C20 17.6 19.1 18.5 18 18.5H6C4.9 18.5 4 17.6 4 16.5V7.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M5 7L12 12.5L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "sliders") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 7H19M5 17H19M5 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="9" cy="7" fill="currentColor" r="2" />
        <circle cx="15" cy="12" fill="currentColor" r="2" />
        <circle cx="11" cy="17" fill="currentColor" r="2" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 4L18.5 6.5V11.5C18.5 15.6 15.9 19.2 12 20.5C8.1 19.2 5.5 15.6 5.5 11.5V6.5L12 4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M9.5 12.3L11.2 14L14.8 10.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 10V7.8C8 5.7 9.8 4 12 4C14.2 4 16 5.7 16 7.8V10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <rect height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" width="12" x="6" y="10" />
        <path d="M12 14V16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 13.5V11.5C6.5 8.5 8.9 6 12 6C15.1 6 17.5 8.5 17.5 11.5V13.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <rect height="5.5" rx="1.8" stroke="currentColor" strokeWidth="1.8" width="3.5" x="4" y="12.5" />
        <rect height="5.5" rx="1.8" stroke="currentColor" strokeWidth="1.8" width="3.5" x="16.5" y="12.5" />
        <path d="M17.5 18C17.5 19.4 16.4 20.5 15 20.5H12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return null;
}
