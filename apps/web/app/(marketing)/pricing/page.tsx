import { studioPlans } from "@unitforge/billing";
import { Badge, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { getInterfaceNumberLocale } from "@/i18n/interface-locale";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getCurrentAppShellSession } from "@/server/current-session";

const pricingContent = {
  en: {
    badge: "Early access",
    title: "Simple pricing for the first Unitforge workspace.",
    description:
      "Pilot access includes one workspace, public price sheets, inquiry capture, and protected access for your team. Self-serve billing will come later.",
    primaryCta: "Start free",
    primaryCtaSignedIn: "Open app",
    secondaryCta: "Back to site",
    heroNote:
      "One focused offer for teams that want to publish prices and receive requests now.",
    pilotEyebrow: "Included in the pilot",
    pilotHeading: "Everything needed for the first launch.",
    pilotDescription:
      "Everything needed for the first public launch is already inside the Studio setup.",
    planDescription:
      "The first step to public prices and simple request intake.",
    pricingSuffix: "/ month",
    priceMeta: "for one workspace",
    planBadge: "Early access",
    planNote:
      "Cancel anytime. No card required while billing is still in pilot.",
    inclusions: [
      {
        title: "Public price sheets",
        description: "Create polished price pages and publish them in minutes.",
        icon: "globe",
      },
      {
        title: "Request capture",
        description: "Clients send requests directly from your page.",
        icon: "inbox",
      },
      {
        title: "Team access",
        description: "Protected workspace access for your team only.",
        icon: "shield",
      },
      {
        title: "Easy updates",
        description: "Change prices and content without rebuilding the page.",
        icon: "pencil",
      },
      {
        title: "Two languages",
        description: "Publish pages in English and Russian.",
        icon: "languages",
      },
      {
        title: "One calm place",
        description: "Prices, requests, and clients stay in one workspace.",
        icon: "chart",
      },
    ],
    detailsTitle: "What to know",
    detailsDescription:
      "A short explanation of how onboarding works now and what early access already includes.",
    details: [
      {
        title: "Pilot onboarding",
        description:
          "Workspaces are connected directly so early customers can start without a long setup.",
        icon: "person",
      },
      {
        title: "Public pages and requests",
        description:
          "The live value today is publishing clear pages and collecting client requests.",
        icon: "document",
      },
      {
        title: "Billing comes later",
        description:
          "Self-serve billing will be added later. Early-access terms are coordinated directly.",
        icon: "calendar",
      },
    ],
    supportItems: [
      {
        title: "Launch help",
        description: "We help you assemble the first page and start.",
        icon: "support",
      },
      {
        title: "Safe start",
        description: "Access stays with your team. Data is protected.",
        icon: "lock",
      },
      {
        title: "Early customer support",
        description: "We stay close and react quickly while the product grows.",
        icon: "heart",
      },
    ],
  },
  ru: {
    badge: "Ранний доступ",
    title: "Простая цена для первого рабочего пространства Unitforge.",
    description:
      "Пилотный доступ включает одно рабочее пространство, публичные прайс-листы, сбор заявок и защищённый доступ для команды. Самостоятельная оплата появится позже.",
    primaryCta: "Начать бесплатно",
    primaryCtaSignedIn: "Открыть приложение",
    secondaryCta: "Вернуться на сайт",
    heroNote:
      "Один понятный тариф для команд, которые хотят публиковать цены и принимать заявки уже сейчас.",
    pilotEyebrow: "Включено в пилот",
    pilotHeading: "Всё, что нужно для первого запуска.",
    pilotDescription:
      "В первом Studio уже есть всё, что нужно для понятного публичного запуска.",
    planDescription: "Первый шаг к публичным ценам и простому приёму заявок.",
    pricingSuffix: "/ мес",
    priceMeta: "за одно рабочее пространство",
    planBadge: "Ранний доступ",
    planNote:
      "Отмените в любой момент. Без карты, пока биллинг остаётся в пилоте.",
    inclusions: [
      {
        title: "Публичные прайс-листы",
        description:
          "Создавайте аккуратные страницы цен и публикуйте их за пару минут.",
        icon: "globe",
      },
      {
        title: "Сбор заявок",
        description: "Клиенты отправляют заявки прямо с вашей страницы.",
        icon: "inbox",
      },
      {
        title: "Доступ для команды",
        description: "Защищённый доступ к кабинету только для вашей команды.",
        icon: "shield",
      },
      {
        title: "Легко обновлять",
        description:
          "Меняйте цены и контент без разработки. Изменения публикуются сразу.",
        icon: "pencil",
      },
      {
        title: "Два языка",
        description: "Публикуйте страницы на русском и английском языках.",
        icon: "languages",
      },
      {
        title: "Всё в одном месте",
        description:
          "Цены, заявки и клиенты остаются в одном удобном кабинете.",
        icon: "chart",
      },
    ],
    detailsTitle: "Что важно знать",
    detailsDescription:
      "Коротко о подключении, текущей ценности и том, как устроен ранний доступ.",
    details: [
      {
        title: "Пилотное подключение",
        description:
          "Рабочие пространства подключаются напрямую, чтобы первые команды могли быстро начать работу.",
        icon: "person",
      },
      {
        title: "Публичные страницы и заявки",
        description:
          "Главная ценность сейчас — публиковать понятные страницы и собирать обращения клиентов.",
        icon: "document",
      },
      {
        title: "Оплата позже",
        description:
          "Самостоятельная оплата появится позже. Условия раннего доступа согласуются напрямую.",
        icon: "calendar",
      },
    ],
    supportItems: [
      {
        title: "Поможем на старте",
        description: "Подскажем, как собрать первую страницу и запуститься.",
        icon: "support",
      },
      {
        title: "Безопасный запуск",
        description: "Доступ только у вашей команды. Данные защищены.",
        icon: "lock",
      },
      {
        title: "Поддержка ранних клиентов",
        description: "Мы рядом и быстро реагируем. Ваш успех для нас важен.",
        icon: "heart",
      },
    ],
  },
} as const;

type PricingIconName =
  | (typeof pricingContent.en.inclusions)[number]["icon"]
  | (typeof pricingContent.en.details)[number]["icon"]
  | (typeof pricingContent.en.supportItems)[number]["icon"];

function getStudioPlanOrThrow() {
  const studioPlan = studioPlans[0];

  if (!studioPlan) {
    throw new Error("Studio plan configuration is missing.");
  }

  return studioPlan;
}

export default async function PricingPage() {
  const studioPlan = getStudioPlanOrThrow();
  const [locale, session] = await Promise.all([
    getCurrentInterfaceLocale(),
    getCurrentAppShellSession(),
  ]);

  const copy = pricingContent[locale];
  const primaryCtaLabel = session ? copy.primaryCtaSignedIn : copy.primaryCta;
  const planPrice = new Intl.NumberFormat(getInterfaceNumberLocale(locale), {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(studioPlan.monthlyPriceInCents / 100);

  return (
    <div
      className="relative isolate overflow-x-clip pb-12 sm:pb-16"
      style={{
        background:
          "radial-gradient(ellipse 62rem 34rem at 73% 10%, hsl(var(--marketing-glow) / 0.18), hsl(var(--marketing-accent-soft) / 0.13) 38%, transparent 72%), radial-gradient(ellipse 48rem 28rem at 25% 8%, hsl(var(--marketing-surface-elevated) / 0.76), transparent 72%), radial-gradient(ellipse 82rem 36rem at 50% 39%, hsl(var(--marketing-accent-soft) / 0.24), transparent 74%), radial-gradient(ellipse 60rem 29rem at 74% 67%, hsl(var(--marketing-glow) / 0.08), transparent 74%), radial-gradient(ellipse 54rem 26rem at 32% 88%, hsl(var(--marketing-surface-muted) / 0.72), transparent 74%), linear-gradient(180deg, hsl(var(--marketing-bg-soft)) 0%, hsl(var(--marketing-bg)) 45%, hsl(var(--marketing-bg-soft)) 100%)",
      }}
    >
      <section className="container relative grid gap-10 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[minmax(0,0.9fr),minmax(24rem,0.96fr)] lg:items-center lg:gap-12 lg:py-[5.75rem] xl:gap-16">
        <div className="max-w-[42rem] space-y-7">
          <Badge
            className="border-[hsl(var(--marketing-border-strong)/0.42)] bg-[hsl(var(--marketing-accent-soft)/0.42)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--marketing-foreground-soft))]"
            variant="outline"
          >
            {copy.badge}
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-balance font-serif text-[2.9rem] font-medium leading-[0.93] tracking-[-0.055em] text-[hsl(var(--marketing-foreground))] sm:text-[4.2rem] lg:text-[5rem]">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-[1.04rem] leading-7 text-[hsl(var(--marketing-foreground-soft))] sm:text-[1.22rem] sm:leading-8">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "marketing-focus-ring h-14 w-full rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-7 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_28px_68px_-34px_hsl(var(--marketing-shadow)/0.38)] sm:w-auto",
              )}
              href="/app"
              prefetch={false}
            >
              <PricingIcon className="mr-2 h-4 w-4" name="spark" />
              {primaryCtaLabel}
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "marketing-focus-ring h-14 w-full rounded-full border-[hsl(var(--marketing-border-strong)/0.38)] bg-[hsl(var(--marketing-surface)/0.62)] px-6 text-base font-medium text-[hsl(var(--marketing-foreground))] shadow-[0_18px_44px_-34px_hsl(var(--marketing-shadow)/0.14)] sm:w-auto",
              )}
              href="/"
            >
              {copy.secondaryCta}
            </Link>
          </div>

          <div className="max-w-xl rounded-[1.5rem] border border-[hsl(var(--marketing-border)/0.54)] bg-[hsl(var(--marketing-surface)/0.58)] px-4 py-3 text-sm leading-6 text-[hsl(var(--marketing-foreground-muted))] shadow-[0_20px_42px_-36px_hsl(var(--marketing-shadow)/0.12)] backdrop-blur-sm">
            {copy.heroNote}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[40rem] lg:justify-self-end">
          <PricingArtifact />
        </div>
      </section>

      <section className="container relative" id="offer">
        <div className="relative overflow-hidden rounded-[2.3rem] border border-[hsl(var(--marketing-pricing-edge)/0.78)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)/0.98),hsl(var(--marketing-pricing-surface)/0.88))] p-4 shadow-[0_48px_124px_-62px_hsl(var(--marketing-shadow)/0.4),0_0_0_1px_hsl(var(--marketing-surface-elevated)/0.46)_inset] sm:rounded-[2.8rem] sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-[hsl(var(--marketing-glow)/0.1)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-32 w-32 rounded-full bg-[hsl(var(--marketing-glow)/0.06)] blur-3xl" />

          <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.42fr),minmax(0,0.58fr)] lg:gap-5">
            <article className="rounded-[2rem] border border-[hsl(var(--marketing-pricing-edge)/0.72)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)),hsl(var(--marketing-surface)/0.96))] p-6 shadow-[0_28px_76px_-52px_hsl(var(--marketing-shadow)/0.32),0_1px_0_hsl(var(--marketing-surface-elevated)/0.8)_inset] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <h2 className="font-serif text-[3rem] font-medium leading-none tracking-[-0.05em] text-[hsl(var(--marketing-foreground))]">
                    {studioPlan.name}
                  </h2>
                  <p className="max-w-sm text-base leading-7 text-[hsl(var(--marketing-foreground-soft))]">
                    {copy.planDescription}
                  </p>
                </div>
                <span className="rounded-full border border-[hsl(var(--marketing-border)/0.6)] bg-[hsl(var(--marketing-accent-soft)/0.4)] px-4 py-2 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))]">
                  {copy.planBadge}
                </span>
              </div>

              <div className="mt-8 rounded-[1.9rem] border border-[hsl(var(--marketing-pricing-edge)/0.66)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)),hsl(var(--marketing-surface-muted)/0.72))] p-5 shadow-[0_28px_68px_-50px_hsl(var(--marketing-shadow)/0.26),0_1px_0_hsl(var(--marketing-surface-elevated)/0.9)_inset] sm:p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <p className="text-[3.6rem] font-semibold leading-none tracking-[-0.08em] text-[hsl(var(--marketing-foreground))] sm:text-[4.25rem]">
                        {planPrice}
                      </p>
                      <p className="pb-2 text-xl text-[hsl(var(--marketing-foreground-soft))]">
                        {copy.pricingSuffix}
                      </p>
                    </div>
                    <p className="text-sm text-[hsl(var(--marketing-foreground-muted))]">
                      {copy.priceMeta}
                    </p>
                  </div>

                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "marketing-focus-ring h-14 w-full rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-6 text-base font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_22px_56px_-34px_hsl(var(--marketing-shadow)/0.4)]",
                    )}
                    href="/app"
                    prefetch={false}
                  >
                    {primaryCtaLabel}
                  </Link>

                  <div className="rounded-full border border-[hsl(var(--marketing-border)/0.52)] bg-[hsl(var(--marketing-surface-muted)/0.82)] px-4 py-3 text-sm leading-6 text-[hsl(var(--marketing-foreground-muted))]">
                    {copy.planNote}
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[hsl(var(--marketing-pricing-edge)/0.68)] bg-[hsl(var(--marketing-surface-elevated)/0.76)] p-6 shadow-[0_24px_64px_-52px_hsl(var(--marketing-shadow)/0.24),0_1px_0_hsl(var(--marketing-surface-elevated)/0.72)_inset] sm:p-7">
              <div className="max-w-xl space-y-3">
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--marketing-foreground-muted))]">
                  {copy.pilotEyebrow}
                </p>
                <h3 className="font-serif text-[2rem] font-medium tracking-[-0.05em] text-[hsl(var(--marketing-foreground))] sm:text-[2.2rem]">
                  {copy.pilotHeading}
                </h3>
                <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))] sm:text-[0.96rem]">
                  {copy.pilotDescription}
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {copy.inclusions.map((item) => (
                  <div
                    key={item.title}
                    className="h-full"
                  >
                    <div className="h-full min-h-[9.5rem] rounded-[1.55rem] border border-[hsl(var(--marketing-border)/0.7)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)/0.98),hsl(var(--marketing-surface)/0.78))] px-4 py-4 shadow-[0_20px_48px_-42px_hsl(var(--marketing-shadow)/0.2),0_1px_0_hsl(var(--marketing-surface-elevated)/0.72)_inset] sm:min-h-[10.2rem]">
                      <div className="flex gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-[hsl(var(--marketing-border)/0.56)] bg-[hsl(var(--marketing-accent-soft)/0.48)] text-[hsl(var(--marketing-accent))]">
                          <PricingIcon className="h-5 w-5" name={item.icon} />
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-base font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">
                            {item.title}
                          </h4>
                          <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="container relative py-12 sm:py-16" id="pilot-notes">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,0.3fr),minmax(0,0.7fr)] xl:gap-8">
          <div className="max-w-sm space-y-3">
            <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[hsl(var(--marketing-foreground))]">
              {copy.detailsTitle}
            </h2>
            <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-muted))]">
              {copy.detailsDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {copy.details.map((item, index) => (
              <div
                key={item.title}
                className="h-full"
              >
                <article className="relative h-full rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface-elevated)/0.64)] p-5 shadow-[0_20px_56px_-48px_hsl(var(--marketing-shadow)/0.2),0_1px_0_hsl(var(--marketing-surface-elevated)/0.66)_inset] backdrop-blur-sm sm:p-6">
                  <div className="flex items-start gap-4 pr-10">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[hsl(var(--marketing-border)/0.54)] bg-[hsl(var(--marketing-accent-soft)/0.46)] text-[hsl(var(--marketing-accent))]">
                      <PricingIcon className="h-5 w-5" name={item.icon} />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[hsl(var(--marketing-border)/0.46)] bg-[hsl(var(--marketing-surface-elevated)/0.82)] text-sm font-semibold text-[hsl(var(--marketing-foreground-soft))]">
                    {index + 1}
                  </span>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container relative pb-10 sm:pb-14" id="support">
        <div className="overflow-hidden rounded-[1.9rem] border border-[hsl(var(--marketing-border)/0.66)] bg-[hsl(var(--marketing-surface-elevated)/0.58)] shadow-[0_20px_54px_-46px_hsl(var(--marketing-shadow)/0.18),0_1px_0_hsl(var(--marketing-surface-elevated)/0.68)_inset] backdrop-blur-sm">
          <div className="grid divide-y divide-[hsl(var(--marketing-border)/0.44)] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {copy.supportItems.map((item) => (
              <article
                key={item.title}
                className="flex items-start gap-4 px-5 py-5 sm:px-6 lg:px-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--marketing-border)/0.5)] bg-[hsl(var(--marketing-accent-soft)/0.4)] text-[hsl(var(--marketing-accent))]">
                  <PricingIcon className="h-5 w-5" name={item.icon} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-[-0.03em] text-[hsl(var(--marketing-foreground))]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[hsl(var(--marketing-foreground-soft))]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingArtifact() {
  return (
    <div className="relative isolate mx-auto flex min-h-[15.5rem] w-full max-w-[40rem] items-center justify-center px-2 sm:min-h-[22rem] sm:px-4 lg:min-h-[28rem]">
      <div className="absolute inset-x-[9%] top-[18%] bottom-[17%] rounded-[2.6rem] border border-[hsl(var(--marketing-border)/0.58)] bg-[linear-gradient(135deg,hsl(var(--marketing-surface-elevated)/0.72),hsl(var(--marketing-pricing-surface)/0.38)_54%,hsl(var(--marketing-surface)/0.56))] shadow-[0_42px_112px_-70px_hsl(var(--marketing-shadow)/0.34),0_1px_0_hsl(var(--marketing-surface-elevated)/0.68)_inset]" />
      <div className="absolute left-[25%] top-[21%] h-[56%] w-[18%] -rotate-[7deg] rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.36)] bg-[linear-gradient(180deg,hsl(var(--marketing-logo-plane-light)/0.52),hsl(var(--marketing-surface-elevated)/0.12))] shadow-[inset_0_1px_0_hsl(var(--marketing-surface-elevated)/0.72)]" />
      <div className="absolute right-[25%] top-[21%] h-[56%] w-[18%] rotate-[7deg] rounded-[1.8rem] border border-[hsl(var(--marketing-border)/0.3)] bg-[linear-gradient(180deg,hsl(var(--marketing-logo-ink)/0.18),hsl(var(--marketing-surface-elevated)/0.06))] shadow-[inset_0_1px_0_hsl(var(--marketing-surface-elevated)/0.24)]" />
      <div className="absolute bottom-[23%] left-1/2 h-10 w-[48%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--marketing-shadow)/0.18),transparent_68%)] blur-xl" />
      <div className="absolute left-1/2 top-[48%] h-[48%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-[2.4rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--marketing-glow)/0.24),hsl(var(--marketing-glow)/0.08)_46%,transparent_74%)] blur-2xl" />

      <div className="relative flex h-[11.8rem] w-[11.8rem] items-center justify-center rounded-[2.4rem] border border-[hsl(var(--marketing-border-strong)/0.46)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)/0.82),hsl(var(--marketing-surface)/0.42))] shadow-[0_30px_84px_-52px_hsl(var(--marketing-shadow)/0.42),0_1px_0_hsl(var(--marketing-surface-elevated)/0.78)_inset] backdrop-blur-sm sm:h-[14rem] sm:w-[14rem]">
        <div className="absolute inset-[14%] rounded-[1.7rem] border border-[hsl(var(--marketing-border)/0.34)] bg-[linear-gradient(145deg,hsl(var(--marketing-surface-elevated)/0.18),transparent_68%)]" />
        <div className="absolute bottom-[24%] h-px w-[54%] bg-[linear-gradient(90deg,transparent,hsl(var(--marketing-logo-copper)/0.64),transparent)]" />
        <UnitforgeLogo
          className="relative h-[7.4rem] w-[7.4rem] drop-shadow-[0_18px_36px_hsl(var(--marketing-shadow)/0.26)] sm:h-[8.6rem] sm:w-[8.6rem]"
          variant="icon"
        />
      </div>
    </div>
  );
}

function PricingIcon({
  className,
  name,
}: {
  className?: string;
  name: PricingIconName | "spark";
}) {
  if (name === "spark") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.8 1.8L9.8 5.7L13.5 7L9.8 8.3L8.8 12.2L6.8 8.8L3 7L6.8 5.2L8.8 1.8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.8 12H20.2M12 3.5C14.2 5.8 15.2 8.6 15.2 12C15.2 15.4 14.2 18.2 12 20.5C9.8 18.2 8.8 15.4 8.8 12C8.8 8.6 9.8 5.8 12 3.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "inbox") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 5.5H19V18.5H5V5.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M8 14.5H10.2C10.7 15.5 11.4 16 12 16C12.6 16 13.3 15.5 13.8 14.5H16M8.5 9H15.5M8.5 11.5H15.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "shield" || name === "lock") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L18.5 6.5V11.5C18.5 15.6 15.9 19.2 12 20.5C8.1 19.2 5.5 15.6 5.5 11.5V6.5L12 4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M9.5 12.3L11.2 14L14.8 10.3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "pencil") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 18.8L6.2 14.1L15.2 5.1C16 4.3 17.2 4.3 18 5.1L18.9 6C19.7 6.8 19.7 8 18.9 8.8L9.9 17.8L5 18.8Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M14 6.5L17.5 10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "languages") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 7H13.5M9 4.5V7M7 18.5L10.5 10.5L14 18.5M8.1 16H12.9M6.5 7C7.1 10.1 9.4 12.3 13 13.2M12.4 7C11.8 9.8 9.8 12.1 6.2 13.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 19V11M10 19V7M15 19V13M20 19V5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.9"
        />
        <path
          d="M3.5 19.5H21"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "person") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="8"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5.5 19C6.6 15.7 8.8 14 12 14C15.2 14 17.4 15.7 18.5 19"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 4.5H14.2L18.5 8.8V19.5H7V4.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M14 4.8V9H18M9.5 13H15.5M9.5 16H14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="6"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 4V8M16 4V8M4.5 10H19.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 13.5V11.5C6.5 8.5 8.9 6 12 6C15.1 6 17.5 8.5 17.5 11.5V13.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <rect
          x="4"
          y="12.5"
          width="3.5"
          height="5.5"
          rx="1.8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="16.5"
          y="12.5"
          width="3.5"
          height="5.5"
          rx="1.8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 20S5 15.8 5 9.7C5 7.2 6.9 5.5 9.2 5.5C10.5 5.5 11.5 6.1 12 7.1C12.5 6.1 13.5 5.5 14.8 5.5C17.1 5.5 19 7.2 19 9.7C19 15.8 12 20 12 20Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return null;
}
