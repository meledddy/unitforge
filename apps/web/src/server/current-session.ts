import {
  mockSessionMembership,
  mockSessionSubscription,
  mockSessionUser,
  mockSessionWorkspace,
} from "@unitforge/core";

type MembershipRole = "owner" | "admin" | "member";
type SubscriptionProvider = "stripe" | "manual";
type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface AppShellSession {
  currentUser: {
    id: string;
    email: string;
    name: string | null;
  };
  currentWorkspace: {
    id: string;
    name: string;
    slug: string;
  };
  membership: {
    role: MembershipRole;
  };
  subscription: {
    plan: string;
    provider: SubscriptionProvider;
    status: SubscriptionStatus;
    currentPeriodEnd: string | null;
  } | null;
}

const mockSession: AppShellSession = {
  currentUser: {
    ...mockSessionUser,
  },
  currentWorkspace: {
    ...mockSessionWorkspace,
  },
  membership: {
    ...mockSessionMembership,
  },
  subscription: {
    ...mockSessionSubscription,
  },
};

export async function getCurrentAppShellSession() {
  return mockSession;
}
