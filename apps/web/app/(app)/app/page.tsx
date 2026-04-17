import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireCurrentAppShellSession } from "@/server/current-session";

const overviewContent = {
  en: {
    eyebrow: "Workspace",
    title: "Overview",
    description: "Keep pricing, access, and incoming work in view from one calm starting point.",
    settingsCta: "Open settings",
    currentUserTitle: "Your access",
    currentUserDescription: "The signed-in operator account that is currently working in this workspace.",
    currentWorkspaceTitle: "Active workspace",
    currentWorkspaceDescription: "This is the workspace currently used for protected actions and shared records.",
    currentWorkspaceBody: "All protected pricing updates, publication changes, and inquiry review stay inside this workspace.",
    billingTitle: "Billing",
    billingDescription: "Current plan and access state for this workspace.",
    unconfigured: "Managed manually",
    plan: "Plan",
    notAssigned: "Not assigned",
    status: "Status",
    billingBody: "Billing for pilot customers is currently handled directly while self-serve checkout is prepared.",
    workflowsTitle: "Available workflows",
    workflowsDescription: "Price Sheets is the live workflow in this workspace today.",
    openPriceSheets: "Open Price Sheets",
    priceSheetsTitle: "Price Sheets",
    priceSheetsDescription: "Publish public pricing pages, keep them current, and review incoming inquiries.",
    moreToolsTitle: "More tools later",
    moreToolsDescription: "New workflows will arrive without changing the current workspace or the live pricing flow.",
  },
  ru: {
    eyebrow: "Рабочее пространство",
    title: "Обзор",
    description: "Держите цены, доступ и входящие задачи под рукой в одной спокойной стартовой точке.",
    settingsCta: "Открыть настройки",
    currentUserTitle: "Ваш доступ",
    currentUserDescription: "Учетная запись оператора, которая сейчас работает в этом рабочем пространстве.",
    currentWorkspaceTitle: "Активное рабочее пространство",
    currentWorkspaceDescription: "Это рабочее пространство используется для защищенных действий и общих данных.",
    currentWorkspaceBody: "Все изменения цен, статуса публикации и просмотр заявок остаются внутри этого рабочего пространства.",
    billingTitle: "Биллинг",
    billingDescription: "Текущий план и состояние доступа для этого рабочего пространства.",
    unconfigured: "Настраивается вручную",
    plan: "План",
    notAssigned: "Не назначен",
    status: "Статус",
    billingBody: "Для пилотных клиентов биллинг пока ведется напрямую, пока готовится самостоятельная оплата.",
    workflowsTitle: "Доступные сценарии",
    workflowsDescription: "Сейчас в этом рабочем пространстве уже доступен сценарий с прайс-листами.",
    openPriceSheets: "Открыть прайс-листы",
    priceSheetsTitle: "Прайс-листы",
    priceSheetsDescription: "Публикуйте публичные ценовые страницы, обновляйте их и просматривайте входящие заявки.",
    moreToolsTitle: "Следующие инструменты позже",
    moreToolsDescription: "Новые сценарии будут добавляться без изменений в текущем рабочем пространстве и живом ценовом процессе.",
  },
} as const;

export default async function DashboardPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const copy = overviewContent[locale];
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const subscriptionStatus = session.subscription ? getSubscriptionStatusLabel(locale, session.subscription.status) : copy.unconfigured;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/app/settings">
            {copy.settingsCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{copy.currentUserTitle}</CardTitle>
            <CardDescription>{copy.currentUserDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{userDisplayName}</p>
            <p>{session.currentUser.email}</p>
            <Badge variant="outline">{getMembershipRoleLabel(locale, session.membership.role)}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.currentWorkspaceTitle}</CardTitle>
            <CardDescription>{copy.currentWorkspaceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <p>{copy.currentWorkspaceBody}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.billingTitle}</CardTitle>
            <CardDescription>{copy.billingDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {copy.status}: {subscriptionStatus}
            </p>
            <p>
              {copy.plan}: {session.subscription?.plan ?? copy.notAssigned}
            </p>
            <p>{copy.billingBody}</p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel
        title={copy.workflowsTitle}
        description={copy.workflowsDescription}
        actionHref="/app/price-sheets"
        actionLabel={copy.openPriceSheets}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/app/price-sheets" className="rounded-3xl border border-border/70 bg-background/70 p-5 transition-colors hover:border-accent">
            <p className="font-medium">{copy.priceSheetsTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.priceSheetsDescription}</p>
          </Link>
          <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
            <p className="font-medium">{copy.moreToolsTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.moreToolsDescription}</p>
          </div>
        </div>
      </PlaceholderPanel>
    </div>
  );
}
