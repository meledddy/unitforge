"use client";

import { appNavigation, isAppNavigationItemActive } from "@unitforge/core";
import { Avatar, Button, cn } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppThemeToggle } from "@/components/app/app-theme-toggle";
import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import { signOutAction } from "@/server/auth/actions";
import type { AppShellSession } from "@/server/current-session";

interface AppTopbarProps {
  session: AppShellSession;
  locale: InterfaceLocale;
}

function getLocalizedNavItem(messages: ReturnType<typeof getMessages>, href: string) {
  if (href === "/app") {
    return messages.appShell.nav.overview;
  }

  if (href === "/app/price-sheets") {
    return messages.appShell.nav.priceSheets;
  }

  return messages.appShell.nav.settings;
}

export function AppTopbar({ session, locale }: AppTopbarProps) {
  const pathname = usePathname();
  const messages = getMessages(locale);
  const userDisplayName = session.currentUser.name || session.currentUser.email;

  return (
    <header className="border-b border-border/55 bg-background/74 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[4.6rem] w-full max-w-[1180px] grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 sm:px-6 lg:min-h-[4.85rem] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          aria-label="Unitforge"
          className="inline-flex min-w-0 items-center justify-self-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href="/"
        >
          <UnitforgeLogo
            className="gap-3 text-foreground"
            iconClassName="h-8 w-8"
            tone="light"
            wordmarkClassName="hidden text-foreground sm:block"
          />
        </Link>

        <nav
          aria-label={messages.appShell.sidebarBadge}
          className="order-last col-span-2 flex min-w-0 justify-center lg:order-none lg:col-span-1"
        >
          <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border/65 bg-card/58 p-1 shadow-[0_16px_40px_hsl(var(--app-shadow)/0.08)]">
            {appNavigation.map((item) => {
              const navCopy = getLocalizedNavItem(messages, item.href);
              const isActive = isAppNavigationItemActive(item.href, pathname);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {navCopy.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-1.5 justify-self-end">
          <AppThemeToggle
            className="h-9 w-[3.95rem] border-border/60 bg-card/58 shadow-none"
            label={messages.appShell.themeToggleLabel}
          />
          <InterfaceLanguageSwitcher
            activeClassName="bg-primary text-primary-foreground shadow-sm"
            className="w-fit border-border/60 bg-card/58 p-1 shadow-none"
            inactiveClassName="text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            locale={locale}
          />
          <div className="flex h-10 min-w-10 items-center justify-center rounded-full border border-border/65 bg-card/62 px-1.5 shadow-sm">
            <Avatar name={userDisplayName} size="sm" />
            <span className="sr-only">{userDisplayName}</span>
          </div>
          <form action={signOutAction}>
            <Button className="rounded-full px-3 sm:px-4" size="sm" type="submit" variant="ghost">
              {messages.shared.signOut}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
