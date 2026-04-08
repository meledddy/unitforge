import Link from "next/link";

import { Badge, buttonVariants, cn } from "@unitforge/ui";

export function AppTopbar() {
  return (
    <header className="border-b border-border/70 bg-background/85 px-6 py-4 backdrop-blur lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
          <h1 className="text-lg font-semibold tracking-tight">Studio Operations</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">Initial shell</Badge>
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/">
            Marketing Site
          </Link>
        </div>
      </div>
    </header>
  );
}

