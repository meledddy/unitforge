import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";
import type { AppShellSession } from "@/server/current-session";

type MembershipRole = AppShellSession["membership"]["role"];
type Subscription = AppShellSession["subscription"];
type SubscriptionStatus = NonNullable<Subscription>["status"];

export function getMembershipRoleLabel(locale: InterfaceLocale, role: MembershipRole) {
  return getMessages(locale).shared.membershipRoles[role];
}

export function getSubscriptionStatusLabel(locale: InterfaceLocale, status: SubscriptionStatus) {
  return getMessages(locale).shared.subscriptionStatuses[status];
}

export function getSubscriptionSummaryLabel(locale: InterfaceLocale, subscription: Subscription) {
  const messages = getMessages(locale);

  if (!subscription) {
    return messages.appShell.billingNotConfigured;
  }

  const planLabel = formatPlanLabel(locale, subscription.plan);

  return `${planLabel} / ${getSubscriptionStatusLabel(locale, subscription.status)}`;
}

function formatPlanLabel(locale: InterfaceLocale, plan: string) {
  if (plan.length === 0) {
    return locale === "ru" ? "Тариф" : "Plan";
  }

  return `${plan.slice(0, 1).toUpperCase()}${plan.slice(1)}`;
}
