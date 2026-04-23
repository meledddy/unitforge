"use client";

import { cn } from "@unitforge/ui";
import { startTransition, useEffect, useState } from "react";

import type { MarketingTheme } from "@/components/marketing/marketing-theme";
import { marketingThemeStorageKey } from "@/components/marketing/marketing-theme";

interface MarketingThemeToggleProps {
  className?: string;
  label: string;
}

function getResolvedTheme(): MarketingTheme {
  const attributeTheme = document.documentElement.dataset.marketingTheme;

  if (attributeTheme === "dark" || attributeTheme === "light") {
    return attributeTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function MarketingThemeToggle({ className, label }: MarketingThemeToggleProps) {
  const [theme, setTheme] = useState<MarketingTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme();
    document.documentElement.dataset.marketingTheme = resolvedTheme;
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.marketingTheme = nextTheme;
    window.localStorage.setItem(marketingThemeStorageKey, nextTheme);

    startTransition(() => {
      setTheme(nextTheme);
    });
  }

  return (
    <button
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : false}
      className={cn(
        "group relative inline-flex h-11 w-[4.65rem] shrink-0 items-center rounded-full border border-[hsl(var(--marketing-border)/0.72)] bg-[hsl(var(--marketing-surface)/0.78)] p-[3px] text-[hsl(var(--marketing-foreground-soft))] shadow-[0_20px_46px_-34px_hsl(var(--marketing-shadow)/0.28)] transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-[hsl(var(--marketing-border-strong)/0.56)] hover:shadow-[0_24px_52px_-34px_hsl(var(--marketing-shadow)/0.36)] motion-reduce:transition-none",
        className,
      )}
      type="button"
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,hsl(var(--marketing-glow)/0.16),transparent_60%)] opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] z-0 h-[calc(100%-6px)] w-[2rem] rounded-full border border-[hsl(var(--marketing-border)/0.72)] bg-[linear-gradient(180deg,hsl(var(--marketing-surface-elevated)),hsl(var(--marketing-surface)))] shadow-[0_12px_28px_-18px_hsl(var(--marketing-shadow)/0.42)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mounted && theme === "dark" ? "translate-x-[2.05rem]" : "translate-x-0",
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && theme === "dark" ? "text-[hsl(var(--marketing-foreground-muted))]" : "text-[hsl(var(--marketing-accent))]",
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 2.75V5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M12 19V21.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M21.25 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M5 12H2.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M18.54 5.46L16.95 7.05" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M7.05 16.95L5.46 18.54" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M18.54 18.54L16.95 16.95" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            <path d="M7.05 7.05L5.46 5.46" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          </svg>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && theme === "dark" ? "text-[hsl(var(--marketing-accent))]" : "text-[hsl(var(--marketing-foreground-muted))]",
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.25 14.25C18.15 14.9 16.87 15.25 15.5 15.25C11.36 15.25 8 11.89 8 7.75C8 6.39 8.35 5.1 9 4C5.54 5.18 3 8.46 3 12.25C3 17.02 6.98 21 11.75 21C15.54 21 18.82 18.46 20 15C19.76 14.77 19.51 14.52 19.25 14.25Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
