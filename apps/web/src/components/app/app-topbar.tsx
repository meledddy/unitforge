"use client";

import { getCurrentAppNavigationItem } from "@unitforge/core";
import { Avatar, Badge, Button, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{session.currentWorkspace.slug}</p>
          <h1 className="text-lg font-semibold tracking-tight">{localizedCurrentItem?.label ?? messages.shared.workspace}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {localizedCurrentItem?.description ?? messages.shared.authenticatedWorkspaceShell}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">{messages.shared.signedIn}</Badge>
          <Badge variant="outline">{session.subscription?.status ?? messages.appShell.topbarSubscriptionFallback}</Badge>
          <InterfaceLanguageSwitcher locale={locale} />
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            {messages.shared.pricing}
          </Link>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/settings">
            {messages.shared.settings}
          </Link>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/">
            {messages.shared.marketingSite}
          </Link>
          <form action={signOutAction}>
            <Button size="sm" type="submit" variant="outline">
              {messages.shared.signOut}
            </Button>
          </form>
          <Avatar name={session.currentUser.name} size="sm" />
        </div>
      </div>
    </header>
  );
}
