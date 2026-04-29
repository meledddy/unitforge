import { appConfig } from "@unitforge/config";
import { cn } from "@unitforge/ui";
import type { CSSProperties } from "react";
import { useId } from "react";

type UnitforgeLogoVariant = "icon" | "wordmark";
type UnitforgeLogoTone = "auto" | "light" | "dark" | "mono";

interface UnitforgeLogoProps {
  className?: string;
  iconClassName?: string;
  markClassName?: string;
  tone?: UnitforgeLogoTone;
  variant?: UnitforgeLogoVariant;
  wordmarkClassName?: string;
}

interface UnitforgeLogoMarkProps {
  className?: string;
  tone?: UnitforgeLogoTone;
}

const toneStyles: Record<Exclude<UnitforgeLogoTone, "auto">, CSSProperties> = {
  dark: {
    "--unitforge-logo-copper": "hsl(28 56% 48%)",
    "--unitforge-logo-edge": "hsl(33 48% 72%)",
    "--unitforge-logo-ink": "hsl(289 25% 12%)",
    "--unitforge-logo-plane-light": "hsl(39 54% 88%)",
    "--unitforge-logo-plane-shadow": "hsl(30 18% 30%)",
  } as CSSProperties,
  light: {
    "--unitforge-logo-copper": "hsl(27 54% 50%)",
    "--unitforge-logo-edge": "hsl(34 46% 78%)",
    "--unitforge-logo-ink": "hsl(292 23% 14%)",
    "--unitforge-logo-plane-light": "hsl(39 48% 91%)",
    "--unitforge-logo-plane-shadow": "hsl(31 23% 64%)",
  } as CSSProperties,
  mono: {
    "--unitforge-logo-copper": "currentColor",
    "--unitforge-logo-edge": "currentColor",
    "--unitforge-logo-ink": "currentColor",
    "--unitforge-logo-plane-light": "currentColor",
    "--unitforge-logo-plane-shadow": "currentColor",
  } as CSSProperties,
};

export function UnitforgeLogo({
  className,
  iconClassName,
  markClassName,
  tone = "auto",
  variant = "wordmark",
  wordmarkClassName,
}: UnitforgeLogoProps) {
  if (variant === "icon") {
    return (
      <UnitforgeLogoMark
        className={cn("h-8 w-8", iconClassName, markClassName, className)}
        tone={tone}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-3 text-[hsl(var(--marketing-foreground))]",
        className,
      )}
    >
      <UnitforgeLogoMark
        className={cn("h-9 w-9 shrink-0", iconClassName ?? markClassName)}
        tone={tone}
      />
      <span
        className={cn(
          "truncate font-serif text-[1.52rem] font-medium leading-none tracking-[-0.04em] sm:text-[1.62rem]",
          wordmarkClassName,
        )}
      >
        {appConfig.name}
      </span>
    </span>
  );
}

export function UnitforgeLogoMark({ className, tone = "auto" }: UnitforgeLogoMarkProps) {
  const gradientId = useId().replaceAll(":", "");
  const style = tone === "auto" ? undefined : toneStyles[tone];

  return (
    <svg
      aria-hidden="true"
      className={cn("h-8 w-8 overflow-visible", className)}
      fill="none"
      style={style}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${gradientId}-left`} x1="13" x2="34" y1="8" y2="54">
          <stop stopColor="var(--unitforge-logo-plane-light, hsl(var(--marketing-logo-plane-light)))" />
          <stop offset="0.58" stopColor="var(--unitforge-logo-plane-light, hsl(var(--marketing-logo-plane-light)))" />
          <stop offset="1" stopColor="var(--unitforge-logo-plane-shadow, hsl(var(--marketing-logo-plane-shadow)))" />
        </linearGradient>
        <linearGradient id={`${gradientId}-right`} x1="48" x2="31" y1="9" y2="55">
          <stop stopColor="var(--unitforge-logo-ink, hsl(var(--marketing-logo-ink)))" />
          <stop offset="0.68" stopColor="var(--unitforge-logo-ink, hsl(var(--marketing-logo-ink)))" />
          <stop offset="1" stopColor="var(--unitforge-logo-plane-shadow, hsl(var(--marketing-logo-plane-shadow)))" />
        </linearGradient>
        <linearGradient id={`${gradientId}-fold`} x1="26" x2="38" y1="22" y2="55">
          <stop stopColor="var(--unitforge-logo-edge, hsl(var(--marketing-logo-edge)))" />
          <stop offset="1" stopColor="var(--unitforge-logo-copper, hsl(var(--marketing-logo-copper)))" />
        </linearGradient>
      </defs>
      <path
        d="M14.6 11.3C21.8 13.4 27 19.9 27 27.5V51.4C19.2 48.2 13.2 40.6 13.2 31.6V14.7C13.2 12.8 13.7 11.7 14.6 11.3Z"
        fill={`url(#${gradientId}-left)`}
      />
      <path
        d="M49.4 11.3C42.2 13.4 37 19.9 37 27.5V51.4C44.8 48.2 50.8 40.6 50.8 31.6V14.7C50.8 12.8 50.3 11.7 49.4 11.3Z"
        fill={`url(#${gradientId}-right)`}
      />
      <path
        d="M27 27.5C27 37.1 28.7 45.6 32 55.1C35.3 45.6 37 37.1 37 27.5V51.4C35.4 53 33.7 54.2 32 55.1C30.3 54.2 28.6 53 27 51.4V27.5Z"
        fill={`url(#${gradientId}-fold)`}
      />
      <path
        d="M14.6 11.3C21.8 13.4 27 19.9 27 27.5V51.4M49.4 11.3C42.2 13.4 37 19.9 37 27.5V51.4"
        stroke="var(--unitforge-logo-edge, hsl(var(--marketing-logo-edge)))"
        strokeLinecap="round"
        strokeWidth="1.18"
        opacity="0.68"
      />
      <path
        d="M27.6 51.7C29.1 53.2 30.6 54.3 32 55.1C33.4 54.3 34.9 53.2 36.4 51.7"
        stroke="var(--unitforge-logo-copper, hsl(var(--marketing-logo-copper)))"
        strokeLinecap="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

export function BrandMark({ className }: UnitforgeLogoMarkProps) {
  return <UnitforgeLogoMark className={className} />;
}

export function UnitforgePremiumMark({ className }: UnitforgeLogoMarkProps) {
  return <UnitforgeLogoMark className={className} />;
}
