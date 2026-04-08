"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appConfig } from "@unitforge/config";
import { appNavigation } from "@unitforge/core";
import { Badge, cn } from "@unitforge/ui";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border/70 bg-card/80 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 p-6">
        <div className="space-y-2">
          <Badge variant="secondary">Studio Shell</Badge>
          <div>
            <p className="text-lg font-semibold">{appConfig.name}</p>
            <p className="text-sm text-muted-foreground">Shared baseline for future vertical SaaS products.</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {appNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary/15 bg-primary text-primary-foreground"
                    : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

