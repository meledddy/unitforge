"use client";

import { appConfig } from "@unitforge/config";
import { cn } from "@unitforge/ui";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import {
  appThemeStorageKey,
  legacyLoginThemeStorageKey,
} from "@/components/app/app-theme";
import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";

import { SignInForm } from "./sign-in-form";

interface LoginShellProps {
  locale: InterfaceLocale;
  next?: string;
}

type LoginTheme = "light" | "dark";

const loginThemeStyles: Record<LoginTheme, CSSProperties> = {
  dark: {
    "--login-bg": "289 25% 7%",
    "--login-bg-soft": "287 22% 9%",
    "--login-surface": "287 19% 10%",
    "--login-surface-muted": "286 16% 13%",
    "--login-surface-elevated": "284 15% 16%",
    "--login-foreground": "39 36% 94%",
    "--login-foreground-soft": "38 15% 78%",
    "--login-foreground-muted": "36 10% 60%",
    "--login-border": "33 17% 22%",
    "--login-border-strong": "34 30% 36%",
    "--login-accent": "38 76% 70%",
    "--login-accent-strong": "36 82% 60%",
    "--login-shadow": "289 28% 4%",
    "--login-mark-cream": "39 86% 86%",
    "--login-mark-bronze": "31 48% 38%",
    "--login-mark-glow-core": "38 84% 68%",
    "--login-mark-glow-soft": "32 72% 48%",
    "--login-button-text": "289 25% 7%",
  } as CSSProperties,
  light: {
    "--login-bg": "40 39% 91%",
    "--login-bg-soft": "40 46% 94%",
    "--login-surface": "40 38% 94%",
    "--login-surface-muted": "38 31% 90%",
    "--login-surface-elevated": "42 44% 97%",
    "--login-foreground": "288 26% 13%",
    "--login-foreground-soft": "286 14% 29%",
    "--login-foreground-muted": "285 10% 39%",
    "--login-border": "34 31% 70%",
    "--login-border-strong": "32 39% 56%",
    "--login-accent": "34 73% 44%",
    "--login-accent-strong": "34 78% 51%",
    "--login-shadow": "286 20% 30%",
    "--login-mark-cream": "40 78% 82%",
    "--login-mark-bronze": "30 49% 39%",
    "--login-mark-glow-core": "37 82% 58%",
    "--login-mark-glow-soft": "34 68% 48%",
    "--login-logo-wordmark": "288 27% 15%",
    "--login-logo-shadow": "34 56% 62%",
    "--login-button-text": "288 25% 12%",
  } as CSSProperties,
};

export function LoginShell({ locale, next }: LoginShellProps) {
  const [loginTheme, setLoginTheme] = useState<LoginTheme>("dark");
  const [isThemeMounted, setIsThemeMounted] = useState(false);
  const messages = getMessages(locale);

  useEffect(() => {
    const attributeTheme = document.documentElement.dataset.appTheme;
    const storedTheme = window.localStorage.getItem(appThemeStorageKey);
    const legacyLoginTheme = window.localStorage.getItem(
      legacyLoginThemeStorageKey,
    );
    const resolvedTheme =
      attributeTheme === "dark" || attributeTheme === "light"
        ? attributeTheme
        : storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : legacyLoginTheme === "dark" || legacyLoginTheme === "light"
            ? legacyLoginTheme
            : window.matchMedia("(prefers-color-scheme: light)").matches
              ? "light"
              : "dark";

    document.documentElement.dataset.appTheme = resolvedTheme;
    setLoginTheme(resolvedTheme);
    setIsThemeMounted(true);
  }, []);

  function toggleLoginTheme() {
    setLoginTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.appTheme = nextTheme;
      window.localStorage.setItem(appThemeStorageKey, nextTheme);
      window.localStorage.removeItem(legacyLoginThemeStorageKey);
      return nextTheme;
    });
  }

  return (
    <section
      className="relative isolate min-h-screen overflow-hidden bg-[hsl(var(--login-bg))] text-[hsl(var(--login-foreground))] transition-colors duration-300"
      data-login-theme={loginTheme}
      style={loginThemeStyles[loginTheme]}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,hsl(var(--login-accent)/0.07),transparent_18rem),radial-gradient(circle_at_50%_86%,hsl(var(--login-accent-strong)/0.045),transparent_28rem),linear-gradient(180deg,hsl(var(--login-bg-soft))_0%,hsl(var(--login-bg))_58%,hsl(var(--login-bg))_100%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(hsl(var(--login-foreground)/0.032)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--login-foreground)/0.024)_1px,transparent_1px)] [background-size:92px_92px]" />
      <FoldLineField />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link className="marketing-focus-ring rounded-full" href="/">
            <UnitforgeLogo
              className={cn(
                "text-[#f7ecdc] [text-shadow:0_1px_16px_rgba(40,21,31,0.42),0_1px_2px_rgba(14,8,12,0.55)]",
                loginTheme === "light" &&
                  "text-[hsl(var(--login-logo-wordmark))] [text-shadow:0_1px_0_hsl(var(--login-surface-elevated)/0.82),0_10px_28px_hsl(var(--login-logo-shadow)/0.26)]",
              )}
              iconClassName="h-7 w-7"
              tone={loginTheme === "light" ? "dark" : "light"}
              wordmarkClassName={cn(
                "hidden text-[1.18rem] tracking-[-0.035em] text-[#f7ecdc] min-[430px]:inline sm:text-[1.28rem]",
                loginTheme === "light" &&
                  "text-[hsl(var(--login-logo-wordmark))]",
              )}
            />
          </Link>
          <div className="flex items-center gap-2">
            <LoginThemeToggle
              label={
                locale === "ru"
                  ? "Переключить тему входа"
                  : "Toggle login theme"
              }
              mounted={isThemeMounted}
              theme={loginTheme}
              onToggle={toggleLoginTheme}
            />
            <InterfaceLanguageSwitcher
              activeClassName="bg-[hsl(var(--login-accent))] text-[hsl(var(--login-bg))] shadow-[0_12px_26px_-18px_hsl(var(--login-accent)/0.82)]"
              className="border-[hsl(var(--login-border)/0.72)] bg-[hsl(var(--login-surface-muted)/0.68)] p-0.5"
              inactiveClassName="text-[hsl(var(--login-foreground-muted))] hover:bg-[hsl(var(--login-surface-elevated)/0.72)] hover:text-[hsl(var(--login-foreground))]"
              locale={locale}
            />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <div className="relative w-full max-w-[430px] text-center">
            <div className="relative mx-auto flex flex-col items-center">
              <FoldedUnitforgeMark theme={loginTheme} />
              <div className="mt-7 space-y-2">
                <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-[hsl(var(--login-foreground))] sm:text-[2.65rem]">
                  {messages.auth.title}
                </h1>
                <p className="text-sm leading-6 text-[hsl(var(--login-foreground-muted))] sm:text-[0.96rem]">
                  {messages.auth.formSubtitle}
                </p>
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-2 mt-7 w-full duration-300 motion-reduce:animate-none">
                <SignInForm
                  locale={locale}
                  next={next}
                  showBackLink={false}
                  showHeader={false}
                />
              </div>
              <Link
                className="marketing-focus-ring mt-6 inline-flex items-center gap-3 rounded-full text-sm text-[hsl(var(--login-foreground-muted))] transition-colors hover:text-[hsl(var(--login-accent))]"
                href="/"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--login-border)/0.72)] bg-[hsl(var(--login-surface-muted)/0.52)] text-sm font-medium text-[hsl(var(--login-foreground-soft))]">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 12H5M11 18L5 12L11 6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <span>{messages.auth.returnToPublicSite}</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-center pb-3 text-xs text-[hsl(var(--login-foreground-muted)/0.78)]">
          <span>© 2026 {appConfig.name}</span>
        </footer>
      </div>
    </section>
  );
}

function FoldedUnitforgeMark({ theme }: { theme: LoginTheme }) {
  return (
    <div className="relative h-36 w-36 sm:h-40 sm:w-40">
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--login-mark-cream)/0.22)_0%,hsl(var(--login-mark-glow-core)/0.28)_24%,hsl(var(--login-mark-glow-soft)/0.14)_46%,transparent_72%)] blur-2xl",
          theme === "light" &&
            "bg-[radial-gradient(circle,hsl(var(--login-mark-cream)/0.2)_0%,hsl(var(--login-mark-glow-core)/0.18)_23%,hsl(var(--login-mark-glow-soft)/0.08)_43%,transparent_70%)]",
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-[54%] h-36 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(var(--login-mark-glow-core)/0.26),transparent_68%)] blur-xl",
          theme === "light" &&
            "bg-[radial-gradient(ellipse,hsl(var(--login-mark-glow-core)/0.16),transparent_68%)]",
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[8.75rem] w-[8.75rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--login-mark-cream)/0.2),transparent_66%)]",
          theme === "light" &&
            "bg-[radial-gradient(circle,hsl(var(--login-mark-cream)/0.14),transparent_66%)]",
        )}
      />
      <svg
        aria-hidden="true"
        className="relative h-full w-full drop-shadow-[0_0_34px_hsl(var(--login-mark-glow-core)/0.58)]"
        fill="none"
        viewBox="0 0 160 160"
      >
        <defs>
          <linearGradient
            id="login-fold-left"
            x1="34"
            x2="83"
            y1="28"
            y2="134"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(var(--login-mark-cream))" />
            <stop offset="0.48" stopColor="hsl(var(--login-accent))" />
            <stop offset="1" stopColor="hsl(var(--login-mark-bronze))" />
          </linearGradient>
          <linearGradient
            id="login-fold-right"
            x1="126"
            x2="78"
            y1="28"
            y2="134"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(var(--login-foreground-soft))" />
            <stop offset="0.2" stopColor="hsl(var(--login-surface-elevated))" />
            <stop offset="0.72" stopColor="hsl(var(--login-bg))" />
            <stop offset="1" stopColor="hsl(var(--login-mark-bronze))" />
          </linearGradient>
          <linearGradient
            id="login-fold-core"
            x1="80"
            x2="80"
            y1="41"
            y2="139"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(var(--login-mark-cream))" stopOpacity="0.9" />
            <stop offset="1" stopColor="hsl(var(--login-accent-strong))" />
          </linearGradient>
        </defs>
        <path
          d="M75 135C55 126 37 109 37 82V34C61 44 77 64 78 93L80 136C78 136 76.5 135.6 75 135Z"
          fill="url(#login-fold-left)"
          stroke="hsl(var(--login-mark-cream) / 0.42)"
          strokeWidth="1"
        />
        <path
          d="M85 135C105 126 123 109 123 82V34C99 44 83 64 82 93L80 136C82 136 83.5 135.6 85 135Z"
          fill="url(#login-fold-right)"
          stroke="hsl(var(--login-mark-cream) / 0.22)"
          strokeWidth="1"
        />
        <path
          d="M80 45V136"
          stroke="url(#login-fold-core)"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M45 68C56 75 66 82 77 91"
          stroke="hsl(var(--login-mark-cream) / 0.36)"
          strokeLinecap="round"
          strokeWidth="1.4"
        />
        <path
          d="M43 84C55 90 67 98 78 108"
          stroke="hsl(var(--login-mark-cream) / 0.3)"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
        <path
          d="M47 101C58 106 69 114 79 124"
          stroke="hsl(var(--login-mark-cream) / 0.24)"
          strokeLinecap="round"
          strokeWidth="1.1"
        />
        <path
          d="M113 68C102 76 92 84 83 94"
          stroke="hsl(var(--login-accent) / 0.16)"
          strokeLinecap="round"
          strokeWidth="1.1"
        />
        <path
          d="M80 137C75 130 69 124 62 119"
          stroke="hsl(var(--login-accent-strong) / 0.82)"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
}

function FoldLineField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[8.9rem] h-[26rem] w-[min(58rem,86vw)] -translate-x-1/2 overflow-visible opacity-55 sm:top-[9.8rem]"
      fill="none"
      viewBox="0 0 928 416"
    >
      <defs>
        <linearGradient
          id="login-fold-line-horizontal"
          x1="116"
          x2="812"
          y1="92"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(var(--login-accent) / 0)" />
          <stop offset="0.38" stopColor="hsl(var(--login-accent) / 0.13)" />
          <stop offset="0.5" stopColor="hsl(var(--login-accent) / 0.18)" />
          <stop offset="0.62" stopColor="hsl(var(--login-accent) / 0.13)" />
          <stop offset="1" stopColor="hsl(var(--login-accent) / 0)" />
        </linearGradient>
        <linearGradient
          id="login-fold-line-vertical"
          x1="464"
          x2="464"
          y1="92"
          y2="364"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(var(--login-accent) / 0.16)" />
          <stop offset="0.48" stopColor="hsl(var(--login-accent) / 0.1)" />
          <stop offset="1" stopColor="hsl(var(--login-accent) / 0)" />
        </linearGradient>
        <linearGradient
          id="login-fold-line-ray"
          x1="464"
          x2="116"
          y1="92"
          y2="306"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(var(--login-accent) / 0.14)" />
          <stop offset="1" stopColor="hsl(var(--login-accent) / 0)" />
        </linearGradient>
      </defs>
      <path
        d="M116 92H812"
        stroke="url(#login-fold-line-horizontal)"
        strokeWidth="1"
      />
      <path
        d="M464 92V364"
        stroke="url(#login-fold-line-vertical)"
        strokeWidth="1"
      />
      <path
        d="M464 92L244 224L116 306"
        stroke="url(#login-fold-line-ray)"
        strokeWidth="1"
      />
      <path
        d="M464 92L684 224L812 306"
        stroke="url(#login-fold-line-ray)"
        strokeWidth="1"
      />
      <path
        d="M464 92L318 178L208 242"
        stroke="hsl(var(--login-foreground) / 0.045)"
        strokeWidth="1"
      />
      <path
        d="M464 92L610 178L720 242"
        stroke="hsl(var(--login-foreground) / 0.045)"
        strokeWidth="1"
      />
      <path
        d="M464 92L358 250L284 360"
        stroke="hsl(var(--login-accent) / 0.07)"
        strokeWidth="1"
      />
      <path
        d="M464 92L570 250L644 360"
        stroke="hsl(var(--login-accent) / 0.07)"
        strokeWidth="1"
      />
    </svg>
  );
}

function LoginThemeToggle({
  label,
  mounted,
  theme,
  onToggle,
}: {
  label: string;
  mounted: boolean;
  theme: LoginTheme;
  onToggle: () => void;
}) {
  const isDark = mounted ? theme === "dark" : true;

  return (
    <button
      aria-label={label}
      aria-pressed={isDark}
      className="marketing-focus-ring group relative inline-flex h-9 w-[4.1rem] shrink-0 items-center rounded-full border border-[hsl(var(--login-border)/0.72)] bg-[hsl(var(--login-surface-muted)/0.72)] p-[3px] text-[hsl(var(--login-foreground-muted))] shadow-[0_18px_42px_-32px_hsl(var(--login-shadow)/0.36)] transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-[1px] hover:border-[hsl(var(--login-border-strong)/0.58)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none"
      type="button"
      onClick={onToggle}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] h-[calc(100%-6px)] w-[1.8rem] rounded-full border border-[hsl(var(--login-border)/0.72)] bg-[hsl(var(--login-surface-elevated))] shadow-[0_12px_28px_-18px_hsl(var(--login-shadow)/0.48)] transition-transform duration-300 motion-reduce:transition-none",
          isDark ? "translate-x-[1.73rem]" : "translate-x-0",
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center transition-opacity",
            isDark ? "opacity-55" : "opacity-100",
          )}
        >
          <svg
            className="h-4 w-4 text-[hsl(var(--login-accent))]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 2.75V5M12 19V21.25M21.25 12H19M5 12H2.75M18.54 5.46L16.95 7.05M7.05 16.95L5.46 18.54M18.54 18.54L16.95 16.95M7.05 7.05L5.46 5.46"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center transition-opacity",
            isDark ? "opacity-100" : "opacity-55",
          )}
        >
          <svg
            className="h-4 w-4 text-[hsl(var(--login-accent))]"
            fill="none"
            viewBox="0 0 24 24"
          >
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
