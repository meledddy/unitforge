import { Badge, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { AppInfoCard, AppSectionPanel, DetailRow } from "@/components/app/app-info-panels";
import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireCurrentAppShellSession } from "@/server/current-session";

const overviewContent = {
  en: {
    eyebrow: "Workspace",
    title: "Overview",
    description: "Keep pricing, access, and incoming work in view from one calm starting point.",
    settingsCta: "Open settings",
    currentUserTitle: "Your access",
    currentUserDescription: "The operator account currently working in this workspace.",
    currentWorkspaceTitle: "Active workspace",
    currentWorkspaceDescription: "The workspace used for protected updates, publishing, and inquiry review.",
    currentWorkspaceBody: "Pricing updates, publication changes, and customer inquiries stay inside this workspace.",
    billingTitle: "Billing",
    billingDescription: "Current plan and access state for this workspace.",
    unconfigured: "Managed manually",
    plan: "Plan",
    notAssigned: "Not assigned",
    status: "Status",
    billingBody: "Pilot billing is handled directly while self-serve checkout is prepared.",
    workflowsTitle: "Available workflows",
    workflowsDescription: "Price Sheets is the live workflow in this workspace today.",
    openPriceSheets: "Open Price Sheets",
    priceSheetsTitle: "Price Sheets",
    priceSheetsDescription: "Publish public pricing pages, keep them current, and review incoming inquiries.",
    moreToolsTitle: "More tools later",
    moreToolsDescription: "New workflows will arrive without changing the current workspace or live pricing flow.",
    accountLabel: "Account",
    emailLabel: "Email",
    roleLabel: "Role",
    workspaceLabel: "Workspace",
    handleLabel: "Handle",
    scopeLabel: "Scope",
    workflowBadge: "Live workflow",
    laterBadge: "Planned",
  },
  ru: {
    eyebrow: "Рабочее пространство",
    title: "Обзор",
    description: "Цены, доступ и входящие заявки собраны в одной спокойной стартовой точке.",
    settingsCta: "Открыть настройки",
    currentUserTitle: "Ваш доступ",
    currentUserDescription: "Аккаунт оператора, который сейчас работает в этом пространстве.",
    currentWorkspaceTitle: "Активное пространство",
    currentWorkspaceDescription: "Пространство для защищенных обновлений, публикации и просмотра заявок.",
    currentWorkspaceBody: "Изменения цен, публикации и заявки клиентов остаются внутри этого пространства.",
    billingTitle: "Биллинг",
    billingDescription: "Текущий план и состояние доступа для этого пространства.",
    unconfigured: "Настраивается вручную",
    plan: "План",
    notAssigned: "Не назначен",
    status: "Статус",
    billingBody: "На пилотном этапе биллинг ведется напрямую, пока готовится самостоятельная оплата.",
    workflowsTitle: "Доступные сценарии",
    workflowsDescription: "Прайс-листы сейчас являются основным рабочим сценарием в этом пространстве.",
    openPriceSheets: "Открыть прайс-листы",
    priceSheetsTitle: "Прайс-листы",
    priceSheetsDescription: "Публикуйте публичные страницы с ценами, обновляйте их и просматривайте входящие заявки.",
    moreToolsTitle: "Больше инструментов позже",
    moreToolsDescription: "Новые сценарии появятся без изменения текущего пространства и процесса цен.",
    accountLabel: "Аккаунт",
    emailLabel: "Почта",
    roleLabel: "Роль",
    workspaceLabel: "Пространство",
    handleLabel: "Адрес",
    scopeLabel: "Зона работы",
    workflowBadge: "Активный сценарий",
    laterBadge: "Позже",
  },
} as const;

export default async function DashboardPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const copy = overviewContent[locale];
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const roleLabel = getMembershipRoleLabel(locale, session.membership.role);
  const subscriptionStatus = session.subscription ? getSubscriptionStatusLabel(locale, session.subscription.status) : copy.unconfigured;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "bg-card/80 px-4 shadow-sm hover:border-primary/25")}
            href="/app/settings"
          >
            {copy.settingsCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <AppInfoCard badge={copy.roleLabel} title={copy.currentUserTitle} description={copy.currentUserDescription}>
          <DetailRow label={copy.accountLabel} value={userDisplayName} />
          <DetailRow label={copy.emailLabel} value={session.currentUser.email} valueClassName="break-all" />
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/45 px-3.5 py-2.5 text-sm">
            <span className="text-muted-foreground">{copy.roleLabel}</span>
            <Badge variant="outline" className="bg-background/80">
              {roleLabel}
            </Badge>
          </div>
        </AppInfoCard>

        <AppInfoCard badge={copy.workspaceLabel} title={copy.currentWorkspaceTitle} description={copy.currentWorkspaceDescription}>
          <DetailRow label={copy.workspaceLabel} value={session.currentWorkspace.name} />
          <DetailRow label={copy.handleLabel} value={session.currentWorkspace.slug} valueClassName="font-mono text-xs uppercase tracking-[0.16em]" />
          <p className="rounded-2xl border border-border/60 bg-background/70 px-3.5 py-3 text-sm leading-6 text-muted-foreground">
            {copy.currentWorkspaceBody}
          </p>
        </AppInfoCard>

        <AppInfoCard badge={copy.status} title={copy.billingTitle} description={copy.billingDescription}>
          <DetailRow label={copy.status} value={subscriptionStatus} />
          <DetailRow label={copy.plan} value={session.subscription?.plan ?? copy.notAssigned} />
          <p className="rounded-2xl border border-border/60 bg-secondary/40 px-3.5 py-3 text-sm leading-6 text-muted-foreground">
            {copy.billingBody}
          </p>
        </AppInfoCard>
      </div>

      <AppSectionPanel
        badge={copy.workflowBadge}
        title={copy.workflowsTitle}
        description={copy.workflowsDescription}
        actions={
          <Link className={cn(buttonVariants({ size: "sm" }), "px-4 shadow-sm")} href="/app/price-sheets">
            {copy.openPriceSheets}
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <Link
            href="/app/price-sheets"
            className="group rounded-[1.35rem] border border-border/70 bg-background/80 p-5 transition-colors hover:border-primary/25 hover:bg-background"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-card/80">
                {copy.workflowBadge}
              </Badge>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.openPriceSheets}</span>
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">{copy.priceSheetsTitle}</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{copy.priceSheetsDescription}</p>
            </div>
          </Link>

          <div className="rounded-[1.35rem] border border-dashed border-border/75 bg-muted/25 p-5">
            <Badge variant="secondary" className="border border-border/60 bg-background/80">
              {copy.laterBadge}
            </Badge>
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{copy.moreToolsTitle}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{copy.moreToolsDescription}</p>
            </div>
          </div>
        </div>
      </AppSectionPanel>
    </div>
  );
}
