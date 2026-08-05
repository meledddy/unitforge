import { Badge, buttonVariants, cn } from "@unitforge/ui";
import Link from "next/link";

import { AppInfoCard, DetailRow } from "@/components/app/app-info-panels";
import {
  getMembershipRoleLabel,
  getSubscriptionStatusLabel,
} from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { requireCurrentAppShellSession } from "@/server/current-session";

const settingsContent = {
  en: {
    eyebrow: "Settings",
    title: "Account and workspace",
    description: "Workspace identity, access, and plan.",
    dashboardCta: "Back to dashboard",
    profileTitle: "Workspace and access",
    billingTitle: "Plan and billing",
    workspaceLabel: "Workspace",
    handleLabel: "Handle",
    accountLabel: "Account",
    emailLabel: "Email",
    roleLabel: "Role",
    planLabel: "Plan",
    statusLabel: "Status",
    billingLabel: "Billing",
    noPlan: "No active plan",
    managedBilling: "Invoice",
    stripeBilling: "Card billing",
    viewPlans: "View plans",
  },
  ru: {
    eyebrow: "Настройки",
    title: "Аккаунт и пространство",
    description: "Данные пространства, доступ и тариф.",
    dashboardCta: "Вернуться в панель",
    profileTitle: "Пространство и доступ",
    billingTitle: "Тариф и оплата",
    workspaceLabel: "Пространство",
    handleLabel: "Адрес",
    accountLabel: "Аккаунт",
    emailLabel: "Почта",
    roleLabel: "Роль",
    planLabel: "Тариф",
    statusLabel: "Статус",
    billingLabel: "Оплата",
    noPlan: "Нет активного тарифа",
    managedBilling: "По счёту",
    stripeBilling: "Оплата картой",
    viewPlans: "Посмотреть тарифы",
  },
} as const;

export default async function SettingsPage() {
  const [session, locale] = await Promise.all([
    requireCurrentAppShellSession(),
    getCurrentInterfaceLocale(),
  ]);
  const copy = settingsContent[locale];
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const roleLabel = getMembershipRoleLabel(locale, session.membership.role);
  const subscriptionStatus = session.subscription
    ? getSubscriptionStatusLabel(locale, session.subscription.status)
    : copy.noPlan;
  const billingMode =
    session.subscription?.provider === "stripe"
      ? copy.stripeBilling
      : copy.managedBilling;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "bg-card/80 w-full px-4 shadow-sm sm:w-auto",
            )}
            href="/app"
          >
            {copy.dashboardCta}
          </Link>
        }
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <AppInfoCard badge={copy.workspaceLabel} title={copy.profileTitle}>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow
              label={copy.workspaceLabel}
              value={session.currentWorkspace.name}
            />
            <DetailRow
              label={copy.handleLabel}
              value={session.currentWorkspace.slug}
              valueClassName="font-mono text-xs uppercase tracking-[0.12em]"
            />
            <DetailRow label={copy.accountLabel} value={userDisplayName} />
            <DetailRow
              label={copy.emailLabel}
              value={session.currentUser.email}
              valueClassName="break-all"
            />
          </div>
          <DetailRow
            label={copy.roleLabel}
            value={
              <Badge className="bg-background/80" variant="outline">
                {roleLabel}
              </Badge>
            }
          />
        </AppInfoCard>

        <AppInfoCard badge={copy.billingLabel} title={copy.billingTitle}>
          <DetailRow
            label={copy.planLabel}
            value={session.subscription?.plan ?? copy.noPlan}
            valueClassName="capitalize"
          />
          <DetailRow label={copy.statusLabel} value={subscriptionStatus} />
          <DetailRow label={copy.billingLabel} value={billingMode} />
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "bg-background/75 mt-1 w-full",
            )}
            href="/#pricing"
          >
            {copy.viewPlans}
          </Link>
        </AppInfoCard>
      </div>
    </div>
  );
}
