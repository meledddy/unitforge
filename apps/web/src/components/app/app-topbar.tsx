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

function getLocalizedNavItem(
  messages: ReturnType<typeof getMessages>,
  href: string,
) {
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
    <header className="border-border/55 bg-background/82 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto grid min-h-[4.6rem] w-full max-w-[1180px] grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-3 px-3 py-3 min-[360px]:px-4 sm:px-6 lg:min-h-[4.85rem] lg:grid-cols-[1fr_auto_1fr] lg:gap-x-3 lg:px-8">
        <Link
          aria-label="Unitforge"
          className="focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-w-0 items-center justify-self-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          href="/app"
        >
          <UnitforgeLogo
            className="app-shell-logo text-foreground gap-3"
            iconClassName="h-8 w-8"
            tone="auto"
            wordmarkClassName="hidden text-foreground sm:block"
          />
        </Link>

        <nav
          aria-label={messages.appShell.sidebarBadge}
          className="order-last col-span-2 flex min-w-0 justify-center lg:order-none lg:col-span-1"
        >
          <div className="border-border/65 bg-card/58 flex w-full max-w-full items-center gap-0.5 rounded-full border p-1 shadow-[0_16px_40px_hsl(var(--app-shadow)/0.08)] sm:w-auto sm:gap-1">
            {appNavigation.map((item) => {
              const navCopy = getLocalizedNavItem(messages, item.href);
              const isActive = isAppNavigationItemActive(item.href, pathname);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-ring focus-visible:ring-offset-background min-w-0 flex-1 whitespace-nowrap rounded-full px-2 py-2 text-center text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-none sm:px-3.5 sm:text-sm",
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

        <div className="flex min-w-0 items-center justify-end gap-1 justify-self-end sm:gap-1.5">
          <AppThemeToggle
            className="border-border/60 bg-card/58 h-9 w-9 shadow-none"
            label={messages.appShell.themeToggleLabel}
          />
          <InterfaceLanguageSwitcher
            activeClassName="bg-primary text-primary-foreground shadow-sm"
            className="border-border/60 bg-card/58 w-fit gap-0 p-1 shadow-none [&_button]:px-1.5 min-[360px]:[&_button]:px-2"
            inactiveClassName="text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            locale={locale}
          />
          <div className="border-border/65 bg-card/62 hidden h-10 min-w-10 items-center justify-center rounded-full border px-1.5 shadow-sm sm:flex">
            <Avatar name={userDisplayName} size="sm" />
            <span className="sr-only">{userDisplayName}</span>
          </div>
          <form action={signOutAction}>
            <Button
              className="rounded-full px-2.5 sm:px-4"
              size="sm"
              type="submit"
              variant="ghost"
            >
              {messages.shared.signOut}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
