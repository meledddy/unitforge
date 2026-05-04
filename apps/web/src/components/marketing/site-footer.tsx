import { appConfig } from "@unitforge/config";
import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const footerContent = {
  en: {
    description: "One clean public page for services, prices, and new requests.",
    links: [
      { href: "/#showcase", label: "Example" },
      { href: "/#offer", label: "Pricing" },
      { href: "/login", label: "Sign in" },
    ],
  },
  ru: {
    description: "Одна аккуратная страница для услуг, цен и заявок.",
    links: [
      { href: "/#showcase", label: "Пример" },
      { href: "/#offer", label: "Цена" },
      { href: "/login", label: "Войти" },
    ],
  },
} as const;

export async function SiteFooter() {
  const locale = await getCurrentInterfaceLocale();
  const copy = footerContent[locale];

  return (
    <footer className="border-t border-[hsl(var(--marketing-border)/0.5)] bg-[hsl(var(--marketing-header)/0.68)] backdrop-blur">
      <div className="container flex flex-col gap-6 py-8 text-sm text-[hsl(var(--marketing-foreground-soft))] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <UnitforgeLogo
            className="mt-0.5"
            iconClassName="h-8 w-8"
            variant="icon"
          />
          <div className="space-y-1">
            <p className="text-base font-semibold tracking-[-0.04em] text-[hsl(var(--marketing-foreground))]">{appConfig.name}</p>
            <p className="max-w-xl" data-public-sheet-footer-secondary>
              {copy.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <nav className="flex flex-wrap items-center gap-3" data-public-sheet-footer-secondary>
            {copy.links.map((item) => (
              <Link
                key={item.href}
                className="marketing-focus-ring rounded-full px-3 py-1.5 transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-[hsl(var(--marketing-surface-muted))] hover:text-[hsl(var(--marketing-foreground))] motion-reduce:transition-none"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-[hsl(var(--marketing-foreground-muted))]">&copy; {new Date().getFullYear()} {appConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
