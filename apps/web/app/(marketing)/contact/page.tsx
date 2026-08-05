import { buttonVariants, cn } from "@unitforge/ui";
import type { Metadata } from "next";
import Link from "next/link";

import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { AccessRequestFormCard } from "@/features/access-requests/access-request-form-card";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentInterfaceLocale();

  return locale === "ru"
    ? {
        title: "Контакты",
        description:
          "Свяжитесь с Unitforge по вопросам доступа, оплаты, данных или продукта.",
      }
    : {
        title: "Contact",
        description:
          "Contact Unitforge about access, billing, privacy, or the product.",
      };
}

const contactContent = {
  en: {
    eyebrow: "Contact",
    title: "A direct line to Unitforge.",
    description:
      "Send one message for access, billing, product, or data questions.",
    pricingCta: "View pricing",
    emailLabel: "Or email us",
    emailSubject: "Unitforge enquiry",
  },
  ru: {
    eyebrow: "Контакты",
    title: "Свяжитесь с Unitforge напрямую.",
    description:
      "Одна форма для вопросов о доступе, оплате, продукте или данных.",
    pricingCta: "Посмотреть тариф",
    emailLabel: "Или напишите на почту",
    emailSubject: "Вопрос о Unitforge",
  },
} as const;

export default async function ContactPage() {
  const locale = await getCurrentInterfaceLocale();
  const copy = contactContent[locale];
  const salesEmail = getConfiguredSalesEmail();

  return (
    <div className="relative overflow-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--marketing-glow)/0.12),transparent_68%)]" />
      <section className="container relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr),minmax(25rem,0.78fr)] xl:items-start xl:gap-16">
          <div className="max-w-3xl space-y-6 xl:sticky xl:top-28">
            <MarketingReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--marketing-accent))]">
                {copy.eyebrow}
              </p>
            </MarketingReveal>
            <MarketingReveal delay={40}>
              <h1 className="text-balance font-serif text-[2.8rem] font-medium leading-[0.98] tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[4.2rem] lg:text-[4.8rem]">
                {copy.title}
              </h1>
            </MarketingReveal>
            <MarketingReveal delay={80} variant="quiet">
              <p className="max-w-2xl text-lg leading-8 text-[hsl(var(--marketing-foreground-soft))]">
                {copy.description}
              </p>
            </MarketingReveal>
            <MarketingReveal delay={110} variant="quiet">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "marketing-focus-ring h-12 rounded-full px-6",
                  )}
                  href="/#pricing"
                >
                  {copy.pricingCta}
                </Link>
                {salesEmail ? (
                  <a
                    className="marketing-focus-ring rounded-sm text-sm font-semibold text-[hsl(var(--marketing-foreground-soft))] underline decoration-[hsl(var(--marketing-accent)/0.45)] underline-offset-4"
                    href={`mailto:${salesEmail}?subject=${encodeURIComponent(copy.emailSubject)}`}
                  >
                    {copy.emailLabel}: {salesEmail}
                  </a>
                ) : null}
              </div>
            </MarketingReveal>
          </div>

          <MarketingReveal delay={60} variant="pricing">
            <AccessRequestFormCard locale={locale} source="contact" />
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
