import { appConfig } from "@unitforge/config";

import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";

const footerContent = {
  en: {
    description: "Client-facing pricing and inquiry handling in one calm workspace.",
  },
  ru: {
    description: "Публичные цены и обработка заявок в одном спокойном рабочем пространстве.",
  },
} as const;

export async function SiteFooter() {
  const locale = await getCurrentInterfaceLocale();
  const copy = footerContent[locale];

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.description}</p>
        <p>&copy; {new Date().getFullYear()} {appConfig.name}</p>
      </div>
    </footer>
  );
}
