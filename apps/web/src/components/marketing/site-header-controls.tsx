"use client";

import { buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { InterfaceLanguageSwitcher } from "@/components/interface-language-switcher";
import { MarketingThemeToggle } from "@/components/marketing/marketing-theme-toggle";
import type { InterfaceLocale } from "@/i18n/interface-locale";
import { signOutAction } from "@/server/auth/actions";

interface SiteHeaderNavItem {
  href: string;
  label: string;
}

interface SiteHeaderControlsProps {
  ctaHref: string;
  ctaLabel: string;
  languageLabel: string;
  locale: InterfaceLocale;
  mobileCtaLabel: string;
  mobileMenuLabel: string;
  nav: readonly SiteHeaderNavItem[];
  showSignOut: boolean;
  signOutLabel: string;
  themeLabel: string;
}

export function SiteHeaderControls({
  ctaHref,
  ctaLabel,
  languageLabel,
  locale,
  mobileCtaLabel,
  mobileMenuLabel,
  nav,
  showSignOut,
  signOutLabel,
  themeLabel,
}: SiteHeaderControlsProps) {
  const pathname = usePathname();
  const isPublicPriceSheetPage = pathname?.startsWith("/price-sheets/");

  if (isPublicPriceSheetPage) {
    return null;
  }

  return (
    <div className="public-sheet-marketing-controls contents">
      <nav className="hidden items-center gap-1 rounded-full border border-[hsl(var(--marketing-border)/0.56)] bg-[hsl(var(--marketing-surface)/0.68)] px-2 py-1.5 shadow-[0_24px_60px_-44px_hsl(var(--marketing-shadow)/0.2)] transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:flex">
        {nav.map((item) => (
          <Link
            key={item.href}
            className="marketing-focus-ring rounded-full px-4 py-2 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))] transition-[background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-[hsl(var(--marketing-surface-elevated))] hover:text-[hsl(var(--marketing-foreground))] hover:shadow-[0_16px_28px_-24px_hsl(var(--marketing-shadow)/0.45)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        <MarketingThemeToggle
          className="inline-flex"
          label={themeLabel}
        />
        <InterfaceLanguageSwitcher
          activeClassName="bg-[hsl(var(--marketing-surface-elevated))] text-[hsl(var(--marketing-foreground))] shadow-[0_12px_24px_-18px_hsl(var(--marketing-shadow)/0.35)]"
          className="border-[hsl(var(--marketing-border)/0.6)] bg-[hsl(var(--marketing-surface)/0.55)] p-1.5 text-[hsl(var(--marketing-foreground-soft))] shadow-[0_18px_40px_-30px_hsl(var(--marketing-shadow)/0.18)] transition-[background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          inactiveClassName="text-[hsl(var(--marketing-foreground-muted))] hover:bg-[hsl(var(--marketing-surface-elevated))] hover:text-[hsl(var(--marketing-foreground))]"
          locale={locale}
        />
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "marketing-focus-ring h-12 rounded-full border border-[hsl(var(--marketing-border-strong)/0.34)] bg-[hsl(var(--marketing-primary))] px-6 text-sm font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_24px_54px_-28px_hsl(var(--marketing-shadow)/0.48)] transition-[transform,background-color,border-color,box-shadow,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_28px_62px_-26px_hsl(var(--marketing-shadow)/0.56)] hover:brightness-[1.02] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none",
          )}
          href={ctaHref}
          prefetch={false}
        >
          {ctaLabel}
        </Link>
        {showSignOut ? (
          <form action={signOutAction}>
            <button
              className="marketing-focus-ring rounded-full px-2 py-2 text-sm font-medium text-[hsl(var(--marketing-foreground-muted))] transition-colors duration-200 hover:text-[hsl(var(--marketing-foreground))]"
              type="submit"
            >
              {signOutLabel}
            </button>
          </form>
        ) : null}
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <MarketingThemeToggle
          className="hidden w-[4.25rem] min-[390px]:inline-flex"
          label={themeLabel}
        />
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "marketing-focus-ring h-11 rounded-full bg-[hsl(var(--marketing-primary))] px-3 text-sm font-semibold text-[hsl(var(--marketing-primary-foreground))] shadow-[0_20px_44px_-30px_hsl(var(--marketing-shadow)/0.4)] transition-[transform,background-color,box-shadow,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:brightness-[1.02] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none min-[390px]:px-3.5",
          )}
          href={ctaHref}
          prefetch={false}
        >
          {mobileCtaLabel}
        </Link>
        <details className="group relative">
          <summary className="marketing-focus-ring flex h-11 w-11 list-none items-center justify-center rounded-full border border-[hsl(var(--marketing-border)/0.6)] bg-[hsl(var(--marketing-surface)/0.75)] text-[hsl(var(--marketing-foreground))] shadow-[0_18px_40px_-28px_hsl(var(--marketing-shadow)/0.18)] transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] group-open:bg-[hsl(var(--marketing-surface-elevated))] group-open:shadow-[0_22px_46px_-28px_hsl(var(--marketing-shadow)/0.28)] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">{mobileMenuLabel}</span>
            <span className="flex flex-col gap-[4px]">
              <span className="block h-[1.5px] w-4 origin-center rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:translate-y-[5px] group-open:rotate-45" />
              <span className="block h-[1.5px] w-4 rounded-full bg-current transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:opacity-0" />
              <span className="block h-[1.5px] w-4 origin-center rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:-translate-y-[5px] group-open:-rotate-45" />
            </span>
          </summary>
          <div className="pointer-events-none absolute right-0 top-[calc(100%+0.75rem)] w-[min(21rem,calc(100vw-1.5rem))] origin-top-right scale-[0.97] rounded-[1.9rem] border border-[hsl(var(--marketing-border)/0.68)] bg-[hsl(var(--marketing-surface))] p-3 opacity-0 shadow-[0_30px_70px_-36px_hsl(var(--marketing-shadow)/0.42)] transition-[opacity,transform,background-color,border-color,box-shadow,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:pointer-events-auto group-open:scale-100 group-open:opacity-100">
            <div className="mb-3 flex items-center justify-between gap-4 rounded-[1.4rem] border border-[hsl(var(--marketing-border)/0.55)] bg-[hsl(var(--marketing-surface-muted)/0.68)] p-3 min-[390px]:hidden">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[hsl(var(--marketing-foreground-muted))]">
                {locale === "ru" ? "Тема" : "Theme"}
              </p>
              <MarketingThemeToggle
                className="w-[4.25rem]"
                label={themeLabel}
              />
            </div>
            <div className="rounded-[1.4rem] border border-[hsl(var(--marketing-border)/0.55)] bg-[hsl(var(--marketing-surface-muted)/0.68)] p-3">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[hsl(var(--marketing-foreground-muted))]">
                {languageLabel}
              </p>
              <InterfaceLanguageSwitcher
                activeClassName="bg-[hsl(var(--marketing-surface-elevated))] text-[hsl(var(--marketing-foreground))]"
                className="w-full justify-center border-[hsl(var(--marketing-border)/0.6)] bg-[hsl(var(--marketing-surface)/0.82)] p-1"
                inactiveClassName="text-[hsl(var(--marketing-foreground-muted))] hover:bg-[hsl(var(--marketing-surface-elevated))] hover:text-[hsl(var(--marketing-foreground))]"
                locale={locale}
              />
            </div>
            <div className="mt-3 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  className="marketing-focus-ring block rounded-2xl px-4 py-3 text-sm font-medium text-[hsl(var(--marketing-foreground-soft))] transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-[2px] hover:bg-[hsl(var(--marketing-surface-elevated))] hover:text-[hsl(var(--marketing-foreground))]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {showSignOut ? (
              <div className="mt-3 border-t border-[hsl(var(--marketing-border)/0.55)] pt-3">
                <form action={signOutAction} className="mt-2">
                  <button
                    className="marketing-focus-ring h-11 w-full rounded-full text-sm font-medium text-[hsl(var(--marketing-foreground-muted))] transition-colors duration-200 hover:bg-[hsl(var(--marketing-surface-elevated))] hover:text-[hsl(var(--marketing-foreground))]"
                    type="submit"
                  >
                    {signOutLabel}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </details>
      </div>
    </div>
  );
}
