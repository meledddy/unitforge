"use client";

import { getCurrentAppNavigationItem } from "@unitforge/core";
import { Avatar, Badge, Button, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/server/auth/actions";
import type { AppShellSession } from "@/server/current-session";

interface AppTopbarProps {
  session: AppShellSession;
}

export function AppTopbar({ session }: AppTopbarProps) {
  const pathname = usePathname();
  const currentItem = getCurrentAppNavigationItem(pathname);

  return (
    <header className="border-b border-border/70 bg-background/85 px-6 py-4 backdrop-blur lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{session.currentWorkspace.slug}</p>
          <h1 className="text-lg font-semibold tracking-tight">{currentItem?.label ?? "Workspace"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{currentItem?.description ?? "Authenticated workspace shell."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Signed in</Badge>
          <Badge variant="outline">{session.subscription?.status ?? "setup"}</Badge>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            Pricing
          </Link>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/settings">
            Settings
          </Link>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/">
            Marketing Site
          </Link>
          <form action={signOutAction}>
            <Button size="sm" type="submit" variant="outline">
              Sign out
            </Button>
          </form>
          <Avatar name={session.currentUser.name} size="sm" />
        </div>
      </div>
    </header>
  );
}
