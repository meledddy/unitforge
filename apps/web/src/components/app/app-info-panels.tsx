import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import type { ReactNode } from "react";

interface AppInfoCardProps {
  badge?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

interface AppSectionPanelProps {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
}

export function AppInfoCard({ badge, title, description, children, className }: AppInfoCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/75 bg-card/95 shadow-[0_18px_55px_rgba(15,23,42,0.05)] dark:bg-card/90 dark:shadow-none",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/35 before:to-transparent",
        className,
      )}
    >
      <CardHeader className="space-y-3 pb-4">
        {badge ? (
          <Badge variant="secondary" className="w-fit border border-border/60 bg-secondary/75 text-[11px] font-medium">
            {badge}
          </Badge>
        ) : null}
        <div className="space-y-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description ? <CardDescription className="leading-6">{description}</CardDescription> : null}
        </div>
      </CardHeader>
      {children ? <CardContent className="space-y-3">{children}</CardContent> : null}
    </Card>
  );
}

export function AppSectionPanel({ badge, title, description, actions, children, className }: AppSectionPanelProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/75 bg-card/95 shadow-[0_20px_65px_rgba(15,23,42,0.055)] dark:bg-card/90 dark:shadow-none",
        className,
      )}
    >
      <CardHeader className="border-b border-border/60 bg-muted/25 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            {badge ? (
              <Badge variant="secondary" className="w-fit border border-border/60 bg-background/80 text-[11px] font-medium">
                {badge}
              </Badge>
            ) : null}
            <div className="space-y-2">
              <CardTitle>{title}</CardTitle>
              {description ? <CardDescription className="leading-6">{description}</CardDescription> : null}
            </div>
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">{children}</CardContent>
    </Card>
  );
}

export function DetailRow({ label, value, className, valueClassName }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm",
        className,
      )}
    >
      <span className="min-w-0 text-muted-foreground">{label}</span>
      <span className={cn("min-w-0 break-words text-right font-medium text-foreground", valueClassName)}>{value}</span>
    </div>
  );
}

