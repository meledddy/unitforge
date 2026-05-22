import type { ReactNode } from "react";

import { AppThemeProvider } from "@/components/app/app-theme-provider";
import { AppTopbar } from "@/components/app/app-topbar";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);

  return (
    <AppThemeProvider>
      <div className="relative isolate min-h-screen overflow-hidden bg-background text-foreground" data-app-shell>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_50%_0%,hsl(var(--app-accent-soft)/0.34),transparent_62%)]" />
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
