import { appConfig } from "@unitforge/config";
import Link from "next/link";

import { UnitforgeLogo } from "@/components/marketing/brand-mark";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const footerContent = {
  en: {
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  ru: {
    links: [
      { href: "/contact", label: "Контакты" },
      { href: "/privacy", label: "Конфиденциальность" },
      { href: "/terms", label: "Условия" },
    ],
  },
} as const;

export async function SiteFooter() {
  const locale = await getCurrentInterfaceLocale();
  const copy = footerContent[locale];

  return (
    <footer className="border-t border-[hsl(var(--marketing-border)/0.5)] bg-[hsl(var(--marketing-header)/0.68)] backdrop-blur">
      <div className="container flex flex-col gap-5 py-7 text-sm text-[hsl(var(--marketing-foreground-soft))] sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="marketing-focus-ring w-fit rounded-full transition-[color,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:opacity-90 motion-reduce:transition-none"
          href="/"
        >
          <UnitforgeLogo
            iconClassName="h-8 w-8"
            wordmarkClassName="text-[1.28rem] sm:text-[1.32rem]"
          />
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
            data-public-sheet-footer-secondary
          >
            {copy.links.map((item) => (
              <Link
                key={item.href}
                className="marketing-focus-ring rounded-full py-1.5 transition-colors duration-200 hover:text-[hsl(var(--marketing-foreground))]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-[hsl(var(--marketing-foreground-muted))]">
            &copy; {new Date().getFullYear()} {appConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
