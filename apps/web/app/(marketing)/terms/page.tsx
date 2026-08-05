import type { Metadata } from "next";
import Link from "next/link";

import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentInterfaceLocale();

  return locale === "ru"
    ? {
        title: "Условия",
        description:
          "Условия пилота Unitforge и использования публичных страниц с ценами.",
      }
    : {
        title: "Terms",
        description:
          "Terms for using the Unitforge assisted pilot and hosted price pages.",
      };
}

const termsContent = {
  en: {
    eyebrow: "Terms",
    title: "Clear terms for the Unitforge pilot.",
    intro:
      "By using Unitforge, you agree to these terms. We will tell active customers before material changes take effect.",
    effective: "Effective 16 July 2026",
    sections: [
      {
        title: "Service",
        body: "Unitforge provides hosted service and price pages with an inquiry inbox. Access is currently offered as an assisted pilot, so features may evolve as the product develops.",
      },
      {
        title: "Account and content",
        body: "Keep account access secure and provide accurate, lawful content that you have the right to publish. You remain responsible for your prices, claims, customer communication, and visitor notices.",
      },
      {
        title: "Billing and cancellation",
        body: "Pilot access is billed by invoice at the price shown on the Pricing page. We confirm the billing period before activation. You may cancel before the next billing period to stop future charges.",
      },
      {
        title: "Fair use and availability",
        body: "Do not misuse the service, interfere with it, or try to access other accounts. We operate Unitforge with reasonable care but cannot promise uninterrupted availability. Access may be suspended for security, non-payment, or misuse.",
      },
      {
        title: "Liability",
        body: "To the extent permitted by law, Unitforge is not responsible for indirect loss or decisions based on customer-published content. Our total liability is limited to fees paid for the service in the previous three months.",
      },
    ],
    contactTitle: "Questions about these terms",
    contactBody: "Contact us before using the service if anything is unclear.",
    contactAction: "Contact Unitforge",
  },
  ru: {
    eyebrow: "Условия",
    title: "Понятные условия пилота Unitforge.",
    intro:
      "Используя Unitforge, вы соглашаетесь с этими условиями. О существенных изменениях мы заранее сообщим активным клиентам.",
    effective: "Действует с 16 июля 2026 года",
    sections: [
      {
        title: "Сервис",
        body: "Unitforge предоставляет публичные страницы услуг и цен со входящими заявками. Доступ пока работает как пилот с сопровождением, поэтому возможности продукта могут развиваться.",
      },
      {
        title: "Аккаунт и контент",
        body: "Защищайте доступ к аккаунту и публикуйте только точную и законную информацию, на которую у вас есть права. Вы отвечаете за цены, обещания, общение с клиентами и уведомления посетителей.",
      },
      {
        title: "Оплата и отмена",
        body: "Пилот оплачивается по счёту по цене на странице «Тариф». Период оплаты подтверждается до активации. Отменить продление можно до начала следующего оплачиваемого периода.",
      },
      {
        title: "Допустимое использование",
        body: "Нельзя злоупотреблять сервисом, мешать его работе или пытаться получить доступ к чужим аккаунтам. Мы поддерживаем Unitforge с разумной заботой, но не гарантируем бесперебойную работу. Доступ может быть приостановлен из-за угроз безопасности, неоплаты или нарушений.",
      },
      {
        title: "Ответственность",
        body: "В пределах, разрешённых законом, Unitforge не отвечает за косвенные убытки или решения на основе контента, опубликованного клиентом. Общая ответственность ограничена платежами за предыдущие три месяца.",
      },
    ],
    contactTitle: "Вопросы об условиях",
    contactBody:
      "Если что-то непонятно, свяжитесь с нами до начала использования сервиса.",
    contactAction: "Связаться с Unitforge",
  },
} as const;

export default async function TermsPage() {
  const locale = await getCurrentInterfaceLocale();
  const copy = termsContent[locale];
  const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL?.trim() || null;

  return (
    <div className="relative overflow-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,hsl(var(--marketing-glow)/0.11),transparent_70%)]" />
      <section className="container relative py-12 sm:py-16 lg:py-20">
        <MarketingReveal>
          <header className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--marketing-accent))]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-balance font-serif text-[2.7rem] font-medium leading-[0.98] tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[4rem]">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[hsl(var(--marketing-foreground-soft))]">
              {copy.intro}
            </p>
            <p className="mt-4 text-sm text-[hsl(var(--marketing-foreground-muted))]">
              {copy.effective}
            </p>
          </header>
        </MarketingReveal>

        <div className="mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {copy.sections.map((section, index) => (
            <MarketingReveal
              key={section.title}
              className="h-full"
              delay={index * 35}
              variant="quiet"
            >
              <article className="h-full rounded-[1.65rem] border border-[hsl(var(--marketing-border)/0.7)] bg-[hsl(var(--marketing-surface)/0.68)] p-5 sm:p-6">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[hsl(var(--marketing-foreground-soft))]">
                  {section.body}
                </p>
              </article>
            </MarketingReveal>
          ))}
        </div>

        <MarketingReveal className="mt-4 max-w-5xl" variant="quiet">
          <aside className="rounded-[1.65rem] border border-[hsl(var(--marketing-border)/0.7)] bg-[hsl(var(--marketing-accent-soft)/0.28)] p-5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">
              {copy.contactTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[hsl(var(--marketing-foreground-soft))]">
              {copy.contactBody}
            </p>
            {salesEmail ? (
              <a
                className="marketing-focus-ring mt-3 inline-flex rounded-md font-semibold text-[hsl(var(--marketing-foreground))] underline decoration-[hsl(var(--marketing-accent)/0.48)] underline-offset-4"
                href={`mailto:${salesEmail}`}
              >
                {salesEmail}
              </a>
            ) : (
              <Link
                className="marketing-focus-ring mt-3 inline-flex rounded-md font-semibold text-[hsl(var(--marketing-foreground))] underline decoration-[hsl(var(--marketing-accent)/0.48)] underline-offset-4"
                href="/contact#contact-form"
              >
                {copy.contactAction}
              </Link>
            )}
          </aside>
        </MarketingReveal>
      </section>
    </div>
  );
}
