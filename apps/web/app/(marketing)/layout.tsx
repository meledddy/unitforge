import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[hsl(var(--marketing-bg))] text-[hsl(var(--marketing-foreground))] transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      data-marketing-shell
    >
      <SiteHeader />
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
