"use client";

import { getCurrentAppNavigationItem } from "@unitforge/core";
import { Avatar, Button } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import { signOutAction } from "@/server/auth/actions";
import type { AppShellSession } from "@/server/current-session";

interface AppTopbarProps {
  session: AppShellSession;
  locale: InterfaceLocale;
}

export function AppTopbar({ session, locale }: AppTopbarProps) {
  const pathname = usePathname();
  const currentItem = getCurrentAppNavigationItem(pathname);
  const messages = getMessages(locale);
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const roleLabel = getMembershipRoleLabel(locale, session.membership.role);
  const accountMeta = session.subscription ? `${roleLabel} / ${getSubscriptionStatusLabel(locale, session.subscription.status)}` : roleLabel;
  const localizedCurrentItem =
    currentItem?.href === "/app"
      ? messages.appShell.nav.overview
      : currentItem?.href === "/app/price-sheets"
        ? messages.appShell.nav.priceSheets
        : currentItem?.href === "/app/settings"
          ? messages.appShell.nav.settings
          : null;

  return (
    <header className="border-b border-border/70 bg-background/85 px-6 py-4 backdrop-blur lg:px-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{session.currentWorkspace.slug}</p>
          <h1 className="text-lg font-semibold tracking-tight">{localizedCurrentItem?.label ?? messages.shared.workspace}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {localizedCurrentItem?.description ?? messages.shared.authenticatedWorkspaceShell}
          </p>
        </div>
        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/pricing">
                {messages.shared.pricing}
              </Link>
              <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/">
                {messages.shared.publicSite}
              </Link>
            </nav>
            <InterfaceLanguageSwitcher className="w-fit" locale={locale} />
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 sm:flex-nowrap sm:px-4">
            <Avatar name={userDisplayName} size="sm" />
            <div className="min-w-0 sm:min-w-[13rem]">
              <p className="truncate text-sm font-medium">{userDisplayName}</p>
              <p className="truncate text-xs text-muted-foreground">{accountMeta}</p>
            </div>
            <form action={signOutAction}>
              <Button size="sm" type="submit" variant="ghost">
                {messages.shared.signOut}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
