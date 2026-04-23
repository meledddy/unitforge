import { appConfig } from "@unitforge/config";
import Link from "next/link";

import { BrandMark } from "@/components/marketing/brand-mark";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const footerContent = {
  en: {
    description: "One clean public page for services, prices, and new requests.",
    links: [
      { href: "/#showcase", label: "How it works" },
      { href: "/#offer", label: "Price" },
      { href: "/login", label: "Sign in" },
    ],
  },
  ru: {
    description: "Одна аккуратная публичная страница для услуг, цен и новых заявок.",
    links: [
      { href: "/#showcase", label: "Как это работает" },
      { href: "/#offer", label: "Цена" },
      { href: "/login", label: "Войти" },
    ],
  },
} as const;

export async function SiteFooter() {
  const locale = await getCurrentInterfaceLocale();
  const copy = footerContent[locale];

  return (
    <footer className="border-t border-[hsl(var(--marketing-border)/0.55)] bg-[hsl(var(--marketing-header)/0.74)] backdrop-blur">
      <div className="container flex flex-col gap-6 py-8 text-sm text-[hsl(var(--marketing-foreground-soft))] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <BrandMark className="mt-0.5 h-8 w-8 text-[hsl(var(--marketing-accent))]" />
          <div className="space-y-1">
            <p className="text-base font-semibold tracking-[-0.04em] text-[hsl(var(--marketing-foreground))]">{appConfig.name}</p>
            <p className="max-w-xl">{copy.description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <nav className="flex flex-wrap items-center gap-3">
            {copy.links.map((item) => (
              <Link
                key={item.href}
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-[hsl(var(--marketing-surface-muted))] hover:text-[hsl(var(--marketing-foreground))]"
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
