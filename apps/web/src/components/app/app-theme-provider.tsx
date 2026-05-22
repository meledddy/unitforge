"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import type { AppTheme } from "@/components/app/app-theme";
import { appThemeStorageKey } from "@/components/app/app-theme";

function resolveAppTheme(): AppTheme {
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
    // Local storage may be unavailable in restricted browser contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.appTheme = resolveAppTheme();
  }, []);

  return children;
}
