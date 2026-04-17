import { appConfig } from "@unitforge/config";

import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

export async function SiteFooter() {
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{messages.footer.description}</p>
        <p>&copy; {new Date().getFullYear()} {appConfig.name}</p>
      </div>
    </footer>
  );
}
