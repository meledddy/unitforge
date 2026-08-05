import { Badge, buttonVariants, cn } from "@unitforge/ui";
import type { Metadata } from "next";
import Link from "next/link";

import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { AccessRequestFormCard } from "@/features/access-requests/access-request-form-card";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentInterfaceLocale();

  return locale === "ru"
    ? {
        title: "Запросить доступ",
        description:
          "Оставьте заявку на пилот Unitforge и подготовьте первую страницу с ценами вместе с нами.",
      }
    : {
        title: "Request access",
        description:
          "Request assisted access to Unitforge and prepare your first price page with us.",
      };
}

const requestAccessContent = {
  en: {
    eyebrow: "Assisted pilot",
    title: "Launch your first price page with us.",
    description:
      "Send a short request. We will help prepare the page before it goes live.",
    formCta: "Request access",
    pricingCta: "View pricing",
    trial: "14-day assisted trial. No card required.",
    points: [
      "One public price link",
      "Russian and English",
      "Inquiries in your workspace",
    ],
    emailLabel: "Prefer email?",
    emailCta: "Write to Unitforge",
    emailSubject: "Unitforge access request",
  },
  ru: {
    eyebrow: "Пилот с сопровождением",
    title: "Запустите первый прайс вместе с нами.",
    description:
      "Оставьте короткую заявку. Мы поможем подготовить страницу к публикации.",
    formCta: "Запросить доступ",
    pricingCta: "Посмотреть тариф",
    trial: "14 дней с помощью в запуске. Карта не нужна.",
    points: [
      "Одна ссылка с ценами",
      "Русский и английский",
      "Заявки в вашем кабинете",
    ],
    emailLabel: "Удобнее по почте?",
    emailCta: "Написать Unitforge",
    emailSubject: "Запрос доступа к Unitforge",
  },
} as const;

export default async function RequestAccessPage() {
  const locale = await getCurrentInterfaceLocale();
  const copy = requestAccessContent[locale];
  const salesEmail = getConfiguredSalesEmail();
  const mailHref = salesEmail
    ? `mailto:${salesEmail}?subject=${encodeURIComponent(copy.emailSubject)}`
    : null;

  return (
    <div className="relative overflow-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--marketing-glow)/0.13),transparent_66%)]" />

      <section className="container relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr),minmax(25rem,0.78fr)] xl:items-start xl:gap-16">
          <div className="max-w-3xl space-y-7 xl:sticky xl:top-28">
            <MarketingReveal delay={20}>
              <Badge
                className="border-[hsl(var(--marketing-border-strong)/0.42)] bg-[hsl(var(--marketing-accent-soft)/0.42)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--marketing-foreground-soft))]"
                variant="outline"
              >
                {copy.eyebrow}
              </Badge>
            </MarketingReveal>

            <MarketingReveal delay={60}>
              <h1 className="text-balance font-serif text-[2.8rem] font-medium leading-[0.96] tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[4.2rem] lg:text-[5rem]">
                {copy.title}
              </h1>
            </MarketingReveal>

            <MarketingReveal delay={90} variant="quiet">
              <p className="max-w-2xl text-lg leading-8 text-[hsl(var(--marketing-foreground-soft))] sm:text-xl">
                {copy.description}
              </p>
            </MarketingReveal>

            <MarketingReveal delay={120} variant="quiet">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "marketing-focus-ring h-14 w-full rounded-full bg-[hsl(var(--marketing-primary))] px-7 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_24px_58px_-30px_hsl(var(--marketing-shadow)/0.46)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-0.5 hover:brightness-[1.02] active:translate-y-0 motion-reduce:transition-none sm:w-auto",
                  )}
                  href="#access-request-form"
                >
                  {copy.formCta}
                </a>
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "marketing-focus-ring h-14 w-full rounded-full border-[hsl(var(--marketing-border-strong)/0.42)] bg-[hsl(var(--marketing-surface)/0.68)] px-6 text-base text-[hsl(var(--marketing-foreground))] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-[hsl(var(--marketing-surface-elevated))] motion-reduce:transition-none sm:w-auto",
                  )}
                  href="/#pricing"
                >
                  {copy.pricingCta}
                </Link>
              </div>
              <p className="mt-3 text-sm text-[hsl(var(--marketing-foreground-muted))]">
                {copy.trial}
              </p>
            </MarketingReveal>

            <MarketingReveal delay={140} variant="quiet">
              <ul className="grid gap-3 border-t border-[hsl(var(--marketing-border)/0.62)] pt-6 sm:grid-cols-3">
                {copy.points.map((point) => (
                  <li
                    className="flex items-start gap-2 text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]"
                    key={point}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--marketing-accent))]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </MarketingReveal>
          </div>

          <MarketingReveal delay={70} variant="pricing">
            <div>
              <AccessRequestFormCard locale={locale} />
              {mailHref && salesEmail ? (
                <p className="mt-4 text-center text-sm text-[hsl(var(--marketing-foreground-muted))]">
                  {copy.emailLabel}{" "}
                  <a
                    className="marketing-focus-ring rounded-sm font-semibold text-[hsl(var(--marketing-foreground-soft))] underline decoration-[hsl(var(--marketing-accent)/0.45)] underline-offset-4"
                    href={mailHref}
                  >
                    {copy.emailCta}
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </MarketingReveal>
        </div>
      </section>
    </div>
  );
}

function getConfiguredSalesEmail() {
  const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL?.trim();

  if (!salesEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(salesEmail)) {
    return null;
  }

  return salesEmail;
}
