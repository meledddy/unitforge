export type SubscriptionAccessStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface SubscriptionAccessState {
  status: SubscriptionAccessStatus;
  currentPeriodEnd: Date | string | null;
}

export function hasSubscriptionAccess(
  subscription: SubscriptionAccessState | null | undefined,
  now = new Date(),
) {
  if (!subscription) {
    return false;
  }

  if (subscription.status === "active") {
    if (!subscription.currentPeriodEnd) {
      return true;
    }

    return isFuturePeriodEnd(subscription.currentPeriodEnd, now);
  }

  if (subscription.status !== "trialing" || !subscription.currentPeriodEnd) {
    return false;
  }

  return isFuturePeriodEnd(subscription.currentPeriodEnd, now);
}

function isFuturePeriodEnd(periodEnd: Date | string, now: Date) {
  const periodEndTimestamp =
    periodEnd instanceof Date ? periodEnd.getTime() : Date.parse(periodEnd);

  return (
    Number.isFinite(periodEndTimestamp) && periodEndTimestamp > now.getTime()
  );
}
