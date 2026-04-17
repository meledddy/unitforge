"use client";

import { cn } from "@unitforge/ui";
import { useRouter } from "next/navigation";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { interfaceLocaleCookieName, interfaceLocales } from "@/i18n/interface-locale";

interface InterfaceLanguageSwitcherProps {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  label?: string;
  labelClassName?: string;
  locale: InterfaceLocale;
}

export function InterfaceLanguageSwitcher({
  className,
  activeClassName,
  inactiveClassName,
  label,
  labelClassName,
  locale,
}: InterfaceLanguageSwitcherProps) {
  const router = useRouter();

  function setLocale(nextLocale: InterfaceLocale) {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${interfaceLocaleCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 p-1", className)}>
      {label ? <span className={cn("px-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground", labelClassName)}>{label}</span> : null}
      {interfaceLocales.map((item) => {
        const isActive = item === locale;

        return (
          <button
            key={item}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              isActive ? activeClassName : inactiveClassName,
            )}
            type="button"
            onClick={() => setLocale(item)}
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
