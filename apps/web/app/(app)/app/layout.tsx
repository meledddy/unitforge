import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireCurrentAppShellSession();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
        <AppSidebar session={session} />
        <div className="flex flex-1 flex-col">
          <AppTopbar session={session} />
          <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
