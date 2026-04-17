"use client";

import { appConfig } from "@unitforge/config";
import { appNavigation, isAppNavigationItemActive } from "@unitforge/core";
import { Avatar, Badge, cn } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMembershipRoleLabel, getSubscriptionSummaryLabel } from "@/components/app/app-shell-labels";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { AppShellSession } from "@/server/current-session";

interface AppSidebarProps {
  session: AppShellSession;
  locale: InterfaceLocale;
}

export function AppSidebar({ session, locale }: AppSidebarProps) {
  const pathname = usePathname();
  const messages = getMessages(locale);
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const subscriptionLabel = getSubscriptionSummaryLabel(locale, session.subscription);
  const roleLabel = getMembershipRoleLabel(locale, session.membership.role);

  return (
    <aside className="border-b border-border/70 bg-card/80 lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-8 p-6">
        <div className="space-y-3">
          <Badge variant="secondary">{messages.appShell.sidebarBadge}</Badge>
          <div>
            <p className="text-lg font-semibold">{session.currentWorkspace.name}</p>
            <p className="text-sm text-muted-foreground">{session.currentWorkspace.slug}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
            <p className="font-medium">{appConfig.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{messages.appShell.sidebarDescription}</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {appNavigation.map((item) => {
            const isActive = isAppNavigationItemActive(item.href, pathname);
            const localizedItem =
              item.href === "/app"
                ? messages.appShell.nav.overview
                : item.href === "/app/price-sheets"
                  ? messages.appShell.nav.priceSheets
                  : messages.appShell.nav.settings;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-3xl border px-4 py-4 transition-colors",
                  isActive
                    ? "border-primary/15 bg-primary text-primary-foreground"
                    : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                <p className="text-sm font-medium">{localizedItem.label}</p>
                <p className={cn("mt-1 text-xs", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {localizedItem.description}
                </p>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-border/70 bg-background/80 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={userDisplayName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userDisplayName}</p>
              <p className="truncate text-xs text-muted-foreground">{session.currentUser.email}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">{roleLabel}</Badge>
            <Badge variant="outline">{subscriptionLabel}</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
}
