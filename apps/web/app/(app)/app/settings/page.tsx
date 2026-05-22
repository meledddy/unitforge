import { Badge, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { AppInfoCard, AppSectionPanel, DetailRow } from "@/components/app/app-info-panels";
import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireCurrentAppShellSession } from "@/server/current-session";

const settingsContent = {
  en: {
    eyebrow: "Workspace settings",
    title: "Settings",
    description: "Review the active workspace, account context, and billing state from one page.",
    pricingCta: "View pricing",
    workspaceTitle: "Workspace profile",
    workspaceDescription: "Name and workspace handle used across the protected app.",
    currentUserTitle: "Current access",
    currentUserDescription: "The signed-in account and role for this workspace.",
    currentUserBody: "Confirm who is working in the workspace before updating live pricing.",
    subscriptionTitle: "Billing status",
    subscriptionDescription: "Current billing and access state for this workspace.",
    unconfigured: "Managed manually",
    plan: "Plan",
    notAssigned: "Not assigned",
    status: "Status",
    billingTitle: "Billing and access",
    billingDescription: "Pilot billing stays simple while self-serve checkout is prepared.",
    setupTitle: "Current setup",
    setupDescription: "Early access workspaces are handled directly so teams can use the live pricing workflow without extra setup.",
    nextStepTitle: "Next step",
    nextStepDescription: "Plan or access changes are coordinated directly during the pilot period.",
    workspaceLabel: "Workspace",
    handleLabel: "Handle",
    roleLabel: "Role",
    accountLabel: "Account",
    emailLabel: "Email",
    billingModeLabel: "Mode",
    directBilling: "Direct pilot billing",
  },
  ru: {
    eyebrow: "Настройки пространства",
    title: "Настройки",
    description: "Проверьте активное пространство, текущий доступ и состояние биллинга на одной странице.",
    pricingCta: "Посмотреть тарифы",
    workspaceTitle: "Профиль пространства",
    workspaceDescription: "Название и адрес пространства, которые используются внутри защищенного приложения.",
    currentUserTitle: "Текущий доступ",
    currentUserDescription: "Аккаунт и роль, с которыми вы сейчас работаете в этом пространстве.",
    currentUserBody: "Проверьте, кто работает в пространстве, перед обновлением публичных цен.",
    subscriptionTitle: "Статус биллинга",
    subscriptionDescription: "Текущее состояние биллинга и доступа для этого пространства.",
    unconfigured: "Настраивается вручную",
    plan: "План",
    notAssigned: "Не назначен",
    status: "Статус",
    billingTitle: "Биллинг и доступ",
    billingDescription: "На пилоте биллинг остается простым, пока готовится самостоятельная оплата.",
    setupTitle: "Текущий формат",
    setupDescription: "Пространства раннего доступа подключаются напрямую, чтобы команда могла работать с публичными ценами без лишней настройки.",
    nextStepTitle: "Следующий шаг",
    nextStepDescription: "Изменения плана или условий доступа согласуются напрямую во время пилотного периода.",
    workspaceLabel: "Пространство",
    handleLabel: "Адрес",
    roleLabel: "Роль",
    accountLabel: "Аккаунт",
    emailLabel: "Почта",
    billingModeLabel: "Формат",
    directBilling: "Прямой пилотный биллинг",
  },
} as const;

export default async function SettingsPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const copy = settingsContent[locale];
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
            href="/pricing"
          >
            {copy.pricingCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <AppInfoCard badge={copy.workspaceLabel} title={copy.workspaceTitle} description={copy.workspaceDescription}>
          <DetailRow label={copy.workspaceLabel} value={session.currentWorkspace.name} />
          <DetailRow label={copy.handleLabel} value={session.currentWorkspace.slug} valueClassName="font-mono text-xs uppercase tracking-[0.16em]" />
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/45 px-3.5 py-2.5 text-sm">
            <span className="text-muted-foreground">{copy.roleLabel}</span>
            <Badge variant="outline" className="bg-background/80">
              {roleLabel}
            </Badge>
          </div>
        </AppInfoCard>

        <AppInfoCard badge={copy.roleLabel} title={copy.currentUserTitle} description={copy.currentUserDescription}>
          <DetailRow label={copy.accountLabel} value={userDisplayName} />
          <DetailRow label={copy.emailLabel} value={session.currentUser.email} valueClassName="break-all" />
          <p className="rounded-2xl border border-border/60 bg-background/70 px-3.5 py-3 text-sm leading-6 text-muted-foreground">
            {copy.currentUserBody}
          </p>
        </AppInfoCard>

        <AppInfoCard badge={copy.status} title={copy.subscriptionTitle} description={copy.subscriptionDescription}>
          <DetailRow label={copy.status} value={subscriptionStatus} />
          <DetailRow label={copy.plan} value={session.subscription?.plan ?? copy.notAssigned} />
          <DetailRow label={copy.billingModeLabel} value={copy.directBilling} />
        </AppInfoCard>
      </div>

      <AppSectionPanel badge={copy.billingModeLabel} title={copy.billingTitle} description={copy.billingDescription}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.35rem] border border-border/70 bg-background/80 p-5">
            <Badge variant="secondary" className="border border-border/60 bg-card/80">
              {subscriptionStatus}
            </Badge>
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{copy.setupTitle}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{copy.setupDescription}</p>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-dashed border-border/75 bg-muted/25 p-5">
            <Badge variant="outline" className="bg-card/80">
              {copy.nextStepTitle}
            </Badge>
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{copy.directBilling}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{copy.nextStepDescription}</p>
            </div>
          </div>
        </div>
      </AppSectionPanel>
    </div>
  );
}
