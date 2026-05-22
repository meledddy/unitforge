"use client";

import { cn } from "@unitforge/ui";
import { startTransition, useEffect, useRef, useState } from "react";

import type { AppTheme } from "@/components/app/app-theme";
import { appThemeStorageKey } from "@/components/app/app-theme";

interface AppThemeToggleProps {
  className?: string;
  label: string;
}

function getResolvedTheme(): AppTheme {
  const attributeTheme = document.documentElement.dataset.appTheme;

  if (attributeTheme === "dark" || attributeTheme === "light") {
    return attributeTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(appThemeStorageKey);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    // Ignore unavailable local storage and use the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppThemeToggle({ className, label }: AppThemeToggleProps) {
  const [theme, setTheme] = useState<AppTheme>("light");
  const [mounted, setMounted] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme();
    document.documentElement.dataset.appTheme = resolvedTheme;
    setTheme(resolvedTheme);
    setMounted(true);

    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.dataset.appTheme = nextTheme;
    root.dataset.appThemeTransitioning = "true";

    try {
      window.localStorage.setItem(appThemeStorageKey, nextTheme);
    } catch {
      // Theme still applies for the current page if storage is unavailable.
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      delete root.dataset.appThemeTransitioning;
    }, 320);

    startTransition(() => {
      setTheme(nextTheme);
    });
  }

  return (
    <button
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : false}
      className={cn(
        "group relative inline-flex h-10 w-[4.35rem] shrink-0 items-center rounded-full border border-border/70 bg-card/80 p-[3px] text-muted-foreground shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none",
        className,
      )}
      type="button"
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] z-0 h-[calc(100%-6px)] w-[1.85rem] rounded-full border border-border/60 bg-background shadow-[0_12px_24px_-18px_hsl(var(--foreground)/0.42)] transition-[transform,background-color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[0.96] motion-reduce:transition-none",
          mounted && theme === "dark" ? "translate-x-[1.9rem]" : "translate-x-0",
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center transition-[color,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && theme === "dark" ? "scale-[0.9] text-muted-foreground opacity-60" : "scale-100 text-primary opacity-100",
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            "flex h-7 w-7 items-center justify-center transition-[color,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && theme === "dark" ? "scale-100 text-primary opacity-100" : "scale-[0.9] text-muted-foreground opacity-60",
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
