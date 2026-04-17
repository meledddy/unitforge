import { productSurfaces } from "@unitforge/core";
import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";
import { requireCurrentAppShellSession } from "@/server/current-session";

export default async function DashboardPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const messages = getMessages(locale);
  const localizedProductSurfaces = productSurfaces.map((surface) => {
    if (surface.href === "/app/price-sheets") {
      return locale === "ru"
        ? { ...surface, title: "Прайс-листы", description: "Данные ценообразования в рамках workspace со схемой, готовой для Drizzle-запросов." }
        : surface;
    }

    return locale === "ru"
      ? { ...surface, title: "Import Margin", description: "Маршрут-заполнитель, зарезервированный для будущего import margin workflow." }
      : surface;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={messages.dashboard.eyebrow}
        title={messages.dashboard.title}
        description={messages.dashboard.description}
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/settings">
            {messages.dashboard.settingsCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.currentUserTitle}</CardTitle>
            <CardDescription>{messages.dashboard.currentUserDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentUser.name}</p>
            <p>{session.currentUser.email}</p>
            <Badge variant="outline">{session.membership.role}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.currentWorkspaceTitle}</CardTitle>
            <CardDescription>{messages.dashboard.currentWorkspaceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <p>{messages.dashboard.currentWorkspaceBody}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.billingTitle}</CardTitle>
            <CardDescription>{messages.dashboard.billingDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium capitalize text-foreground">{session.subscription?.status ?? messages.dashboard.unconfigured}</p>
            <p>{messages.dashboard.plan}: {session.subscription?.plan ?? messages.dashboard.notAssigned}</p>
            <p>{messages.dashboard.provider}: {session.subscription?.provider ?? messages.dashboard.notConfigured}</p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel
        title={messages.dashboard.reservedTitle}
        description={messages.dashboard.reservedDescription}
        actionHref="/app/price-sheets"
        actionLabel={messages.dashboard.openPriceSheets}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {localizedProductSurfaces.map((surface) => (
            <div key={surface.href} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="font-medium">{surface.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{surface.description}</p>
            </div>
          ))}
        </div>
      </PlaceholderPanel>
    </div>
  );
}
