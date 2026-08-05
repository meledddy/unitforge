"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import type { AppTheme } from "@/components/app/app-theme";
import {
  appThemeStorageKey,
  legacyLoginThemeStorageKey,
} from "@/components/app/app-theme";

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

    const legacyLoginTheme = window.localStorage.getItem(
      legacyLoginThemeStorageKey,
    );

    if (legacyLoginTheme === "dark" || legacyLoginTheme === "light") {
      return legacyLoginTheme;
    }
  } catch {
    // Local storage may be unavailable in restricted browser contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.appTheme = resolveAppTheme();
  }, []);

  return children;
}
