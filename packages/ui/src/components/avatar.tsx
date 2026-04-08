import * as React from "react";

import { cn } from "../lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials?: string;
  name?: string | null;
  size?: "sm" | "md";
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
};

export function Avatar({ className, initials, name, size = "md", ...props }: AvatarProps) {
  const derivedInitials =
    initials ??
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") ??
    "UF";

  return (
    <div
      aria-label={name ?? "Avatar"}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground shadow-sm",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {derivedInitials}
    </div>
  );
}
