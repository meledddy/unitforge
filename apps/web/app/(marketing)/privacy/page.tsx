import type { Metadata } from "next";
import Link from "next/link";

import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentInterfaceLocale();

  return locale === "ru"
    ? {
        title: "Конфиденциальность",
        description:
          "Как Unitforge обрабатывает данные аккаунта, кабинета и заявок.",
      }
    : {
        title: "Privacy",
        description:
          "How Unitforge handles account, workspace, and inquiry data.",
      };
}

const privacyContent = {
  en: {
    eyebrow: "Privacy",
    title: "Your data supports your workspace—not an advertising profile.",
    intro:
      "This notice explains the information Unitforge uses to provide price pages and inquiry management.",
    effective: "Effective 16 July 2026",
    sections: [
      {
        title: "Information we handle",
        body: "We process account and workspace details, price-page content, inquiries submitted by visitors, and basic technical logs needed to operate the service.",
      },
      {
        title: "How we use it",
        body: "We use this information to provide, secure, support, and improve Unitforge. We do not sell personal information or use inquiry data for advertising.",
      },
      {
        title: "Service providers",
        body: "We may use vetted infrastructure providers to host, store, and deliver the service. They receive only the access needed for that work. We may also disclose information when required by law or to protect the service.",
      },
      {
        title: "Retention and control",
        body: "We keep information while it is needed for an active workspace, security, or legal obligations, then delete or anonymise it. Customers are responsible for the notices and lawful basis covering inquiries collected on their public pages.",
      },
    ],
    contactTitle: "Questions or data requests",
    contactBody:
      "Email us to request access, correction, export, or deletion of your information.",
    contactAction: "Send a data request",
  },
  ru: {
    eyebrow: "Конфиденциальность",
    title: "Данные нужны для работы кабинета, а не для рекламного профиля.",
    intro:
      "Здесь описано, какие данные Unitforge использует для страниц с ценами и обработки заявок.",
    effective: "Действует с 16 июля 2026 года",
    sections: [
      {
        title: "Какие данные мы обрабатываем",
        body: "Данные аккаунта и кабинета, содержимое страниц с ценами, заявки посетителей и базовые технические журналы, необходимые для работы сервиса.",
      },
      {
        title: "Зачем они нужны",
        body: "Чтобы предоставлять, защищать, поддерживать и улучшать Unitforge. Мы не продаём персональные данные и не используем заявки для рекламы.",
      },
      {
        title: "Поставщики сервиса",
        body: "Для хостинга, хранения и доставки сервиса мы можем привлекать проверенных поставщиков инфраструктуры. Они получают только необходимый доступ. Раскрытие также возможно по требованию закона или для защиты сервиса.",
      },
      {
        title: "Хранение и контроль",
        body: "Мы храним данные, пока они нужны активному кабинету, безопасности или для выполнения требований закона, затем удаляем или обезличиваем. Клиент отвечает за уведомления и правовые основания сбора заявок на своей публичной странице.",
      },
    ],
    contactTitle: "Вопросы и запросы по данным",
    contactBody:
      "Напишите нам, чтобы запросить доступ, исправление, экспорт или удаление ваших данных.",
    contactAction: "Отправить запрос по данным",
  },
} as const;

export default async function PrivacyPage() {
  const locale = await getCurrentInterfaceLocale();
  const copy = privacyContent[locale];
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
