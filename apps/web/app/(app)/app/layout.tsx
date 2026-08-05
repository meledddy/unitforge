import type { ReactNode } from "react";

import { AppThemeProvider } from "@/components/app/app-theme-provider";
import { AppTopbar } from "@/components/app/app-topbar";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireAuthenticatedAppShellSession } from "@/server/current-session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, locale] = await Promise.all([
    requireAuthenticatedAppShellSession(),
    getCurrentInterfaceLocale(),
  ]);

  return (
    <AppThemeProvider>
      <div
        className="app-shell-canvas bg-background text-foreground relative isolate min-h-screen overflow-x-clip"
        data-app-canvas
        data-app-shell
      >
        <div className="relative z-10 flex min-h-screen flex-col">
          <AppTopbar locale={locale} session={session} />
          <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </AppThemeProvider>
  );
}
