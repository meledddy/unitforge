import { Badge } from "@unitforge/ui";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

