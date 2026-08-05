import { formatPlanPrice, studioPlans } from "@unitforge/billing";
import { buttonVariants, cn } from "@unitforge/ui";
import type { Metadata } from "next";
import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { marketingLinks } from "@/components/marketing/marketing-links";
import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import {
  getCurrentAppShellSession,
  hasAppSubscriptionAccess,
} from "@/server/current-session";

const surfaceTransitionClassName =
  "transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentInterfaceLocale();

  return locale === "ru"
    ? {
        title: "Прайс по ссылке для сервисного бизнеса",
        description:
          "Публикуйте услуги и цены по одной ссылке и получайте заявки в Unitforge.",
      }
    : {
        title: "A price page for your service business",
        description:
          "Publish services and prices through one link and receive inquiries in Unitforge.",
      };
}

const landingContent = {
  en: {
    eyebrow: "A price page for service businesses",
    title: "Services, prices, and inquiries — one link.",
    description:
      "Build a clear price page, share it with clients, and receive inquiries in your workspace.",
    primaryCta: "Request access",
    signedInCta: "Open app",
    demoCta: "Open live demo",
    trialLine: "14 days · no card · first page built with us",
    previewLabel: "Live demo",
    previewOpen: "Open the full price page",
    previewBusiness: "Arev Dental",
    previewTitle: "Services and prices",
    previewItems: [
      { name: "Initial consultation", price: "12,000 AMD" },
      { name: "Professional cleaning", price: "28,000 AMD" },
      { name: "Ceramic crown", price: "145,000 AMD" },
    ],
    inboxLabel: "Workspace inbox",
    inquiryTitle: "New inquiry",
    inquiryService: "Initial consultation",
    inquiryBody: "Would like to book next week.",
    inquiryTime: "Today, 12:40",
    stepsLabel: "How Unitforge works",
    steps: [
      {
        number: "01",
        title: "Add your services",
        description: "Prices, categories, and contacts.",
      },
      {
        number: "02",
        title: "Share one link",
        description: "In messages, social media, or your bio.",
      },
      {
        number: "03",
        title: "Receive inquiries",
        description: "Every request appears in your workspace.",
      },
    ],
    pricingLabel: "One plan",
    pricingTitle: "Everything included.",
    monthlySuffix: "/ month",
    annualPrefix: "or",
    annualSuffix: "billed yearly",
    features: [
      "Public price page",
      "Russian and English",
      "Inquiry form and inbox",
      "Unlimited updates",
    ],
    pricingNote: "14-day assisted trial · no card · invoice after trial",
    inactiveAccess:
      "Your workspace access is inactive. Request access to continue.",
  },
  ru: {
    eyebrow: "Прайс по ссылке для сервисного бизнеса",
    title: "Услуги, цены и заявки — по одной ссылке.",
    description:
      "Создайте понятный прайс, отправьте его клиенту и получайте обращения в кабинете.",
    primaryCta: "Запросить доступ",
    signedInCta: "Открыть кабинет",
    demoCta: "Открыть демо",
    trialLine: "14 дней · без карты · первый прайс соберём вместе",
    previewLabel: "Живое демо",
    previewOpen: "Открыть полный прайс",
    previewBusiness: "Arev Dental",
    previewTitle: "Услуги и цены",
    previewItems: [
      { name: "Первичная консультация", price: "12 000 AMD" },
      { name: "Профессиональная гигиена", price: "28 000 AMD" },
      { name: "Керамическая коронка", price: "145 000 AMD" },
    ],
    inboxLabel: "Входящие в кабинете",
    inquiryTitle: "Новая заявка",
    inquiryService: "Первичная консультация",
    inquiryBody: "Хочу записаться на следующей неделе.",
    inquiryTime: "Сегодня, 12:40",
    stepsLabel: "Как работает Unitforge",
    steps: [
      {
        number: "01",
        title: "Добавьте услуги",
        description: "Цены, категории и контакты.",
      },
      {
        number: "02",
        title: "Отправьте ссылку",
        description: "В сообщении, соцсетях или профиле.",
      },
      {
        number: "03",
        title: "Получайте заявки",
        description: "Все обращения появятся в кабинете.",
      },
    ],
    pricingLabel: "Один тариф",
    pricingTitle: "Всё включено.",
    monthlySuffix: "/ месяц",
    annualPrefix: "или",
    annualSuffix: "при оплате за год",
    features: [
      "Публичный прайс",
      "Русский и английский",
      "Форма заявки и входящие",
      "Обновления без ограничений",
    ],
    pricingNote: "14 дней с сопровождением · без карты · затем счёт",
    inactiveAccess:
      "Доступ к кабинету неактивен. Запросите подключение, чтобы продолжить.",
  },
} as const;

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const studioPlan = getStudioPlanOrThrow();
  const [locale, session, resolvedSearchParams] = await Promise.all([
    getCurrentInterfaceLocale(),
    getCurrentAppShellSession(),
    searchParams,
  ]);
  const copy = landingContent[locale];
  const hasInactiveAccess = resolvedSearchParams.access === "inactive";
  const hasAppAccess = hasAppSubscriptionAccess(session?.subscription ?? null);
  const primaryCtaHref = hasAppAccess ? "/app" : "/request-access";
  const primaryCtaLabel = hasAppAccess ? copy.signedInCta : copy.primaryCta;
  const numberLocale = getInterfaceNumberLocale(locale);
  const monthlyPrice = formatPlanPrice(
    studioPlan.monthlyPrice,
    studioPlan.currency,
    numberLocale,
  );
  const annualPrice = formatPlanPrice(
    studioPlan.annualPrice,
    studioPlan.currency,
    numberLocale,
  );

  return (
    <div className="relative isolate overflow-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--marketing-glow)/0.16),hsl(var(--marketing-accent-soft)/0.08)_38%,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 h-[46rem] w-full max-w-[76rem] -translate-x-1/2 border-x border-[hsl(var(--marketing-border)/0.26)]" />
        <div className="absolute left-1/2 top-0 h-[34rem] w-px -translate-x-1/2 bg-[linear-gradient(180deg,hsl(var(--marketing-border)/0.48),transparent)] opacity-60" />
        <div className="absolute inset-x-0 top-[31rem] h-px bg-[linear-gradient(90deg,transparent,hsl(var(--marketing-border)/0.52),transparent)]" />
      </div>

      <section className="container relative py-10 sm:py-16 lg:py-[5.5rem]">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.86fr),minmax(0,1.14fr)] xl:items-center xl:gap-14">
          <div className="space-y-7">
            <MarketingReveal delay={30}>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-[hsl(var(--marketing-accent))]">
                {copy.eyebrow}
              </p>
            </MarketingReveal>

            <div className="space-y-5">
              <MarketingReveal delay={80}>
                <h1 className="max-w-4xl text-balance font-serif text-[2.85rem] font-medium leading-[0.94] tracking-[-0.058em] text-[hsl(var(--marketing-foreground))] sm:text-[4.2rem] lg:text-[5rem]">
                  {copy.title}
                </h1>
              </MarketingReveal>
              <MarketingReveal delay={130} variant="quiet">
                <p className="max-w-xl text-[1.05rem] leading-7 text-[hsl(var(--marketing-foreground-soft))] sm:text-xl sm:leading-8">
                  {copy.description}
                </p>
              </MarketingReveal>
            </div>

            <MarketingReveal delay={180} variant="quiet">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "marketing-focus-ring h-14 w-full rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-7 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_28px_60px_-30px_hsl(var(--marketing-shadow)/0.44)] transition-[transform,background-color,border-color,box-shadow,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_34px_70px_-28px_hsl(var(--marketing-shadow)/0.5)] hover:brightness-[1.02] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none sm:w-auto",
                  )}
                  href={primaryCtaHref}
                  prefetch={false}
                >
                  {primaryCtaLabel}
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "marketing-focus-ring group h-14 w-full rounded-full border-[hsl(var(--marketing-border-strong)/0.42)] bg-[hsl(var(--marketing-surface)/0.7)] px-6 text-base font-medium text-[hsl(var(--marketing-foreground))] shadow-[0_20px_42px_-34px_hsl(var(--marketing-shadow)/0.2)] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-[hsl(var(--marketing-surface-elevated))] hover:shadow-[0_24px_44px_-32px_hsl(var(--marketing-shadow)/0.26)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none sm:w-auto",
                  )}
                  href={marketingLinks.demo}
                >
                  {copy.demoCta}
                  <ArrowIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </Link>
              </div>
            </MarketingReveal>

            <MarketingReveal delay={220} variant="quiet">
              <p className="text-sm font-medium text-[hsl(var(--marketing-foreground-muted))]">
                {copy.trialLine}
              </p>
            </MarketingReveal>
          </div>

          <MarketingReveal delay={150} variant="showcase">
            <Link
              aria-label={copy.previewOpen}
              className={cn(
                "marketing-focus-ring group block rounded-[2.15rem] border border-[hsl(var(--marketing-border)/0.8)] bg-[linear-gradient(155deg,hsl(var(--marketing-surface-elevated)/0.96),hsl(var(--marketing-surface-muted)/0.9))] p-3 shadow-[0_42px_104px_-52px_hsl(var(--marketing-shadow)/0.42),0_1px_0_hsl(var(--marketing-surface-elevated)/0.86)_inset] sm:rounded-[2.6rem] sm:p-5 lg:hover:-translate-y-[3px] lg:hover:shadow-[0_48px_112px_-48px_hsl(var(--marketing-shadow)/0.48)]",
                surfaceTransitionClassName,
              )}
              href={marketingLinks.demo}
            >
              <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1 sm:px-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--marketing-accent))] shadow-[0_0_0_5px_hsl(var(--marketing-accent)/0.1)]" />
                  <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[hsl(var(--marketing-foreground-muted))]">
                    {copy.previewLabel}
                  </span>
                </div>
                <span className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))] transition-colors duration-200 group-hover:text-[hsl(var(--marketing-foreground))]">
                  <span className="hidden sm:inline">{copy.previewOpen}</span>
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr),minmax(12rem,0.75fr)]">
                <div className="rounded-[1.65rem] border border-[hsl(var(--marketing-border)/0.72)] bg-[hsl(var(--marketing-surface-elevated)/0.88)] p-4 shadow-[0_18px_46px_-38px_hsl(var(--marketing-shadow)/0.22)] sm:p-5">
                  <div className="flex items-center gap-3 border-b border-[hsl(var(--marketing-border)/0.52)] pb-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--marketing-border)/0.62)] bg-[hsl(var(--marketing-accent-soft)/0.58)] text-[hsl(var(--marketing-accent))]">
                      <UnitforgeLogo className="h-6 w-6" variant="icon" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold tracking-[-0.04em] text-[hsl(var(--marketing-foreground))]">
                        {copy.previewBusiness}
                      </p>
                      <p className="text-sm text-[hsl(var(--marketing-foreground-muted))]">
                        {copy.previewTitle}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-[hsl(var(--marketing-border)/0.45)]">
                    {copy.previewItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start justify-between gap-4 py-4 text-sm"
                      >
                        <span className="font-medium text-[hsl(var(--marketing-foreground))]">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-right font-medium text-[hsl(var(--marketing-foreground-soft))]">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-[15rem] flex-col rounded-[1.65rem] border border-[hsl(var(--marketing-border-strong)/0.45)] bg-[linear-gradient(145deg,hsl(var(--marketing-accent-soft)/0.46),hsl(var(--marketing-surface-elevated)/0.86))] p-5 shadow-[0_20px_52px_-38px_hsl(var(--marketing-shadow)/0.28)]">
                  <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.2em] text-[hsl(var(--marketing-foreground-muted))]">
                    {copy.inboxLabel}
                  </p>
                  <div className="mt-5 flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--marketing-accent))]" />
                    <div>
                      <p className="text-base font-semibold text-[hsl(var(--marketing-foreground))]">
                        {copy.inquiryTitle}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))]">
                        {copy.inquiryService}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
                    {copy.inquiryBody}
                  </p>
                  <p className="mt-auto pt-6 text-xs text-[hsl(var(--marketing-foreground-muted))]">
                    {copy.inquiryTime}
                  </p>
                </div>
              </div>
            </Link>
          </MarketingReveal>
        </div>
      </section>

      <section
        aria-label={copy.stepsLabel}
        className="container relative py-5 sm:py-8"
      >
        <MarketingReveal variant="quiet">
          <ol className="grid overflow-hidden rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface-elevated)/0.58)] shadow-[0_24px_64px_-52px_hsl(var(--marketing-shadow)/0.28)] backdrop-blur-sm md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li
                key={step.number}
                className={cn(
                  "flex gap-4 p-5 sm:p-6",
                  index > 0 &&
                    "border-t border-[hsl(var(--marketing-border)/0.55)] md:border-l md:border-t-0",
                )}
              >
                <span className="font-mono text-xs font-semibold tracking-[0.16em] text-[hsl(var(--marketing-accent))]">
                  {step.number}
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.025em] text-[hsl(var(--marketing-foreground))]">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </MarketingReveal>
      </section>

      <section
        className="container relative scroll-mt-24 py-10 sm:py-16"
        id="pricing"
      >
        <MarketingReveal className="mx-auto max-w-5xl" variant="pricing">
          <article
            className={cn(
              "relative overflow-hidden rounded-[2.25rem] border border-[hsl(var(--marketing-pricing-edge)/0.76)] bg-[linear-gradient(145deg,hsl(var(--marketing-surface-elevated)),hsl(var(--marketing-pricing-surface))_58%,hsl(var(--marketing-surface-elevated)/0.94))] p-6 shadow-[0_46px_118px_-56px_hsl(var(--marketing-shadow)/0.42),0_1px_0_hsl(var(--marketing-surface-elevated)/0.84)_inset] sm:rounded-[2.7rem] sm:p-9 lg:p-10",
              surfaceTransitionClassName,
            )}
          >
            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[hsl(var(--marketing-border)/0.34)]" />
            <div className="pointer-events-none absolute -right-2 -top-6 h-36 w-36 rounded-full border border-[hsl(var(--marketing-border)/0.24)]" />

            <div className="relative grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.82fr),minmax(0,1.18fr)] lg:gap-12">
              <div className="flex flex-col">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-[hsl(var(--marketing-accent))]">
                  {copy.pricingLabel}
                </p>
                <h2 className="mt-3 font-serif text-[2.7rem] font-medium leading-none tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[3.25rem]">
                  {copy.pricingTitle}
                </h2>

                <div className="mt-8 flex flex-wrap items-end gap-x-2.5 gap-y-1">
                  <span className="whitespace-nowrap text-[3.25rem] font-semibold leading-none tracking-[-0.075em] text-[hsl(var(--marketing-foreground))] sm:text-[3.8rem]">
                    {monthlyPrice}
                  </span>
                  <span className="pb-1.5 text-base text-[hsl(var(--marketing-foreground-muted))]">
                    {copy.monthlySuffix}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[hsl(var(--marketing-foreground-soft))]">
                  {copy.annualPrefix} {annualPrice} {copy.annualSuffix}
                </p>
              </div>

              <div className="flex min-h-full flex-col">
                <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {copy.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border-b border-[hsl(var(--marketing-border)/0.52)] pb-4 text-sm font-medium leading-6 text-[hsl(var(--marketing-foreground-soft))]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--marketing-accent)/0.16)] text-[hsl(var(--marketing-accent))]">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mt-auto lg:pt-10">
                  <p className="max-w-sm text-sm leading-6 text-[hsl(var(--marketing-foreground-muted))]">
                    {hasInactiveAccess
                      ? copy.inactiveAccess
                      : copy.pricingNote}
                  </p>
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "marketing-focus-ring h-14 w-full shrink-0 rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-7 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_26px_60px_-28px_hsl(var(--marketing-shadow)/0.48)] transition-[transform,background-color,border-color,box-shadow,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_32px_68px_-26px_hsl(var(--marketing-shadow)/0.54)] hover:brightness-[1.02] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none sm:w-auto",
                    )}
                    href={primaryCtaHref}
                    prefetch={false}
                  >
                    {primaryCtaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </MarketingReveal>
      </section>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8H13M9 4L13 8L9 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
