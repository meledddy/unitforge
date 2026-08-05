import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { marketingLinks } from "@/components/marketing/marketing-links";
import { SiteHeaderControls } from "@/components/marketing/site-header-controls";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import {
  getCurrentAppShellSession,
  hasAppSubscriptionAccess,
} from "@/server/current-session";

const siteHeaderContent = {
  en: {
    nav: [
      { href: marketingLinks.demo, label: "Demo" },
      { href: marketingLinks.pricing, label: "Pricing" },
    ],
    startCta: "Request access",
    signIn: "Sign in",
    signOut: "Sign out",
    mobileMenu: "Menu",
    themeLabel: "Toggle theme",
    languageLabel: "Language",
  },
  ru: {
    nav: [
      { href: marketingLinks.demo, label: "Демо" },
      { href: marketingLinks.pricing, label: "Цена" },
    ],
    startCta: "Запросить доступ",
    signIn: "Войти",
    signOut: "Выйти",
    mobileMenu: "Меню",
    themeLabel: "Переключить тему",
    languageLabel: "Язык",
  },
} as const;

export async function SiteHeader() {
  const [session, locale] = await Promise.all([
    getCurrentAppShellSession(),
    getCurrentInterfaceLocale(),
  ]);
  const messages = getMessages(locale);
  const copy = siteHeaderContent[locale];
  const hasAppAccess = hasAppSubscriptionAccess(session?.subscription ?? null);
  const ctaHref = hasAppAccess ? "/app" : "/request-access";
  const ctaLabel = hasAppAccess ? messages.shared.openApp : copy.startCta;
  const nav = session
    ? copy.nav
    : [...copy.nav, { href: "/login", label: copy.signIn }];
  const mobileCtaLabel = hasAppAccess
    ? locale === "ru"
      ? "В приложение"
      : "Open app"
    : copy.startCta;

  return (
    <header className="marketing-enter-header sticky top-0 z-30 border-b border-[hsl(var(--marketing-border)/0.55)] bg-[hsl(var(--marketing-header)/0.8)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
      <div className="container flex min-h-[4.25rem] items-center justify-between gap-2 py-2 sm:min-h-[4.85rem] sm:gap-4 sm:py-3 lg:gap-6">
        <Link
          aria-label="Unitforge"
          className="marketing-focus-ring flex min-w-0 items-center gap-3 rounded-full text-[hsl(var(--marketing-foreground))] transition-[color,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90 motion-reduce:transition-none"
          href="/"
        >
          <UnitforgeLogo
            className="gap-3"
            iconClassName="h-9 w-9 drop-shadow-[0_10px_24px_hsl(var(--marketing-glow)/0.12)]"
            wordmarkClassName="hidden sm:block"
          />
        </Link>

        <SiteHeaderControls
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
          languageLabel={copy.languageLabel}
          locale={locale}
          mobileCtaLabel={mobileCtaLabel}
          mobileMenuLabel={copy.mobileMenu}
          nav={nav}
          showSignOut={Boolean(session)}
          signOutLabel={copy.signOut}
          themeLabel={copy.themeLabel}
        />
      </div>
    </header>
  );
}
