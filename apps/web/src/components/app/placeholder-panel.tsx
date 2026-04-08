import { buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";
import type { ReactNode } from "react";

interface PlaceholderPanelProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}

export function PlaceholderPanel({ title, description, actionHref, actionLabel, children }: PlaceholderPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {actionHref && actionLabel ? (
          <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}

