import { mockSessionUser, mockSessionWorkspace } from "@unitforge/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { AUTH_SESSION_COOKIE_NAME } from "@/server/auth/constants";
import { getAppShellSessionForSessionToken, getBootstrapAppShellSession } from "@/server/auth/service";
import { getAuthSessionTokenFromCookie } from "@/server/auth/session";

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

const getCachedCurrentAppShellSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = getAuthSessionTokenFromCookie(cookieStore.get(AUTH_SESSION_COOKIE_NAME));

  if (!sessionToken) {
    return null;
  }

  return getAppShellSessionForSessionToken(sessionToken);
});

export async function getCurrentAppShellSession() {
  return getCachedCurrentAppShellSession();
}

export async function requireCurrentAppShellSession() {
  const session = await getCurrentAppShellSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function getSeededAppShellSession() {
  return getBootstrapAppShellSession({
    userId: mockSessionUser.id,
    workspaceId: mockSessionWorkspace.id,
  });
}
