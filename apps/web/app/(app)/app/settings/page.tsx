import { Badge, buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@unitforge/ui";
import Link from "next/link";

import { getMembershipRoleLabel, getSubscriptionStatusLabel } from "@/components/app/app-shell-labels";
import { PageHeader } from "@/components/app/page-header";
import { PlaceholderPanel } from "@/components/app/placeholder-panel";
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
    currentUserBody: "Use this view to confirm who is currently working in the workspace before updating live pricing.",
    subscriptionTitle: "Billing status",
    subscriptionDescription: "Current billing and access state for this workspace.",
    unconfigured: "Managed manually",
    plan: "Plan",
    notAssigned: "Not assigned",
    status: "Status",
    billingTitle: "Billing and access",
    billingDescription: "Pilot billing is intentionally simple while self-serve checkout is prepared.",
    setupTitle: "Current setup",
    setupDescription: "Early access workspaces are handled directly so teams can start using the live pricing workflow without extra setup friction.",
    nextStepTitle: "Next step",
    nextStepDescription: "If you need to change plan or access terms, coordinate it directly during the pilot period.",
  },
  ru: {
    eyebrow: "Настройки рабочего пространства",
    title: "Настройки",
    description: "Проверьте активное рабочее пространство, текущий доступ и состояние биллинга на одной странице.",
    pricingCta: "Посмотреть тарифы",
    workspaceTitle: "Профиль рабочего пространства",
    workspaceDescription: "Название и адрес рабочего пространства, которые используются во всем защищенном приложении.",
    currentUserTitle: "Текущий доступ",
    currentUserDescription: "Учетная запись и роль, с которыми вы сейчас работаете в этом рабочем пространстве.",
    currentUserBody: "Эта страница помогает быстро проверить, кто работает в пространстве, перед обновлением публичных цен.",
    subscriptionTitle: "Статус биллинга",
    subscriptionDescription: "Текущее состояние биллинга и доступа для этого рабочего пространства.",
    unconfigured: "Настраивается вручную",
    plan: "План",
    notAssigned: "Не назначен",
    status: "Статус",
    billingTitle: "Биллинг и доступ",
    billingDescription: "На пилотном этапе биллинг остается простым, пока готовится самостоятельная оплата.",
    setupTitle: "Текущий формат",
    setupDescription: "Рабочие пространства раннего доступа подключаются напрямую, чтобы команды могли начать пользоваться живым ценовым сценарием без лишних шагов.",
    nextStepTitle: "Следующий шаг",
    nextStepDescription: "Если нужно изменить план или условия доступа, это согласуется напрямую в рамках пилотного периода.",
  },
} as const;

export default async function SettingsPage() {
  const [session, locale] = await Promise.all([requireCurrentAppShellSession(), getCurrentInterfaceLocale()]);
  const copy = settingsContent[locale];
  const userDisplayName = session.currentUser.name || session.currentUser.email;
  const subscriptionStatus = session.subscription ? getSubscriptionStatusLabel(locale, session.subscription.status) : copy.unconfigured;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }))} href="/pricing">
            {copy.pricingCta}
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{copy.workspaceTitle}</CardTitle>
            <CardDescription>{copy.workspaceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{session.currentWorkspace.name}</p>
            <p>{session.currentWorkspace.slug}</p>
            <Badge variant="outline">{getMembershipRoleLabel(locale, session.membership.role)}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.currentUserTitle}</CardTitle>
            <CardDescription>{copy.currentUserDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{userDisplayName}</p>
            <p>{session.currentUser.email}</p>
            <p>{copy.currentUserBody}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.subscriptionTitle}</CardTitle>
            <CardDescription>{copy.subscriptionDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {copy.status}: {subscriptionStatus}
            </p>
            <p>
              {copy.plan}: {session.subscription?.plan ?? copy.notAssigned}
            </p>
          </CardContent>
        </Card>
      </div>

      <PlaceholderPanel title={copy.billingTitle} description={copy.billingDescription}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">{copy.setupTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.setupDescription}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <p className="font-medium">{copy.nextStepTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{copy.nextStepDescription}</p>
          </div>
        </div>
      </PlaceholderPanel>
    </div>
  );
}
