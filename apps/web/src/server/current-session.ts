import "server-only";

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
    id: "0e53fe17-7af9-4c45-83df-a1a6d7231bf5",
    email: "operator@unitforge.dev",
    name: "Unitforge Operator",
  },
  currentWorkspace: {
    id: "f5ec1830-7b93-48cf-b157-fbafca907157",
    name: "Unitforge Studio",
    slug: "unitforge-studio",
  },
  membership: {
    role: "owner",
  },
  subscription: {
    plan: "studio",
    provider: "stripe",
    status: "trialing",
    currentPeriodEnd: "2026-05-08T00:00:00.000Z",
  },
};

export async function getCurrentAppShellSession() {
  return mockSession;
}
