"use client";

import { cn } from "@unitforge/ui";
import { useEffect, useState } from "react";

import type { AppTheme } from "@/components/app/app-theme";
import {
  appThemeStorageKey,
  legacyLoginThemeStorageKey,
} from "@/components/app/app-theme";

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

    const legacyLoginTheme = window.localStorage.getItem(
      legacyLoginThemeStorageKey,
    );

    if (legacyLoginTheme === "dark" || legacyLoginTheme === "light") {
      return legacyLoginTheme;
    }
  } catch {
    // Ignore unavailable local storage and use the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppThemeToggle({ className, label }: AppThemeToggleProps) {
  const [theme, setTheme] = useState<AppTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme();
    document.documentElement.dataset.appTheme = resolvedTheme;
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const currentTheme = mounted ? theme : getResolvedTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.dataset.appTheme = nextTheme;

    try {
      window.localStorage.setItem(appThemeStorageKey, nextTheme);
      window.localStorage.removeItem(legacyLoginThemeStorageKey);
    } catch {
      // Theme still applies for the current page if storage is unavailable.
    }

    setTheme(nextTheme);
    setMounted(true);
  }

  return (
    <button
      aria-label={label}
      aria-pressed={mounted ? theme === "dark" : false}
      className={cn(
        "border-border/65 bg-card/68 text-muted-foreground hover:border-primary/30 hover:bg-card hover:text-primary focus-visible:ring-ring focus-visible:ring-offset-background relative inline-grid h-9 w-9 shrink-0 place-items-center rounded-full border shadow-none transition-[border-color,background-color,color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.96] motion-reduce:transition-none",
        className,
      )}
      type="button"
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute flex h-4 w-4 items-center justify-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mounted && theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-45 scale-75 opacity-0",
        )}
      >
        <SunIcon />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute flex h-4 w-4 items-center justify-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mounted && theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-45 scale-75 opacity-0",
        )}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75V5M12 19v2.25M21.25 12H19M5 12H2.75M18.54 5.46l-1.59 1.59M7.05 16.95l-1.59 1.59M18.54 18.54l-1.59-1.59M7.05 7.05 5.46 5.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M19.25 14.25a7.5 7.5 0 0 1-10.25-10A8.75 8.75 0 1 0 20 15c-.24-.23-.49-.48-.75-.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
