import { appConfig } from "@unitforge/config";
import { marketingLinks } from "@unitforge/core";
import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex min-h-16 flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link className="text-base font-semibold tracking-tight" href="/">
            {appConfig.name}
          </Link>
          <p className="hidden text-sm text-muted-foreground md:block">Vertical SaaS studio baseline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {marketingLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-full px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className={cn(buttonVariants({ size: "sm" }))} href="/app">
            Open App
          </Link>
        </div>
      </div>
    </header>
  );
}

