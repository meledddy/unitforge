import { appConfig } from "@unitforge/config";
import { marketingLinks } from "@unitforge/core";
import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { getCurrentAppShellSession } from "@/server/current-session";

const siteHeaderContent = {
  en: {
    tagline: "Public price sheets and inquiries for service businesses",
    nav: {
      platform: "Product",
      pricing: "Pricing",
      dashboard: "App",
    },
  },
  ru: {
    tagline: "Публичные прайс-листы и заявки для сервисного бизнеса",
    nav: {
      platform: "Продукт",
      pricing: "Тарифы",
      dashboard: "Приложение",
    },
  },
} as const;

export async function SiteHeader() {
  const [session, locale] = await Promise.all([getCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const messages = getMessages(locale);
  const copy = siteHeaderContent[locale];
  const localizedNavItems = marketingLinks.map((item) => {
    if (item.href === "/#platform") {
      return { ...item, label: copy.nav.platform };
    }

    if (item.href === "/pricing") {
      return { ...item, label: copy.nav.pricing };
    }

    return { ...item, label: copy.nav.dashboard };
  });

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex min-h-16 flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link className="text-base font-semibold tracking-tight" href="/">
            {appConfig.name}
          </Link>
          <p className="hidden text-sm text-muted-foreground md:block">{copy.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {localizedNavItems.map((item) => (
              <Link
                key={item.href}
                className="rounded-full px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <InterfaceLanguageSwitcher locale={locale} />
          <Link className={cn(buttonVariants({ size: "sm" }))} href={session ? "/app" : "/login"}>
            {session ? messages.shared.openApp : messages.shared.signIn}
          </Link>
        </div>
      </div>
    </header>
  );
}
