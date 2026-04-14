import { verifyPassword } from "@unitforge/db";

import type { AppShellSession } from "@/server/current-session";

import { AuthServiceError } from "./errors";
import {
  createAuthSessionRecord,
  deleteAuthSessionRecordByTokenHash,
  findAuthSessionRecordByTokenHash,
  findPrimaryWorkspaceMembershipForUser,
  findSubscriptionByWorkspaceId,
  findUserByEmail,
  findWorkspaceMembership,
} from "./repository";
import { createAuthSessionToken, getAuthSessionExpiryDate, hashAuthSessionToken } from "./session";

export async function authenticateUserByPassword(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);

  if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
    throw new AuthServiceError("INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  const sessionToken = createAuthSessionToken();
  const tokenHash = hashAuthSessionToken(sessionToken);

  await createAuthSessionRecord({
    userId: user.id,
    tokenHash,
    expiresAt: getAuthSessionExpiryDate(),
  });

  return {
    sessionToken,
    user,
  };
}

export async function invalidateAuthSession(sessionToken: string) {
  return deleteAuthSessionRecordByTokenHash(hashAuthSessionToken(sessionToken));
}

export async function getAppShellSessionForSessionToken(sessionToken: string): Promise<AppShellSession | null> {
  const authSession = await findAuthSessionRecordByTokenHash(hashAuthSessionToken(sessionToken));

  if (!authSession?.user) {
    return null;
  }

  return buildAppShellSession(authSession.user.id);
}

export async function getBootstrapAppShellSession(input: { userId: string; workspaceId: string }) {
  const membership = await findWorkspaceMembership(input.userId, input.workspaceId);

  if (!membership?.user || !membership.workspace) {
    throw new AuthServiceError("WORKSPACE_NOT_FOUND", "Bootstrap workspace context could not be loaded.");
  }

  const subscription = await findSubscriptionByWorkspaceId(membership.workspace.id);

  return mapAppShellSession({
    membership,
    subscription,
  });
}

async function buildAppShellSession(userId: string): Promise<AppShellSession | null> {
  const membership = await findPrimaryWorkspaceMembershipForUser(userId);

  if (!membership?.user || !membership.workspace) {
    return null;
  }

  const subscription = await findSubscriptionByWorkspaceId(membership.workspace.id);

  return mapAppShellSession({
    membership,
    subscription,
  });
}

function mapAppShellSession(input: {
  membership: NonNullable<Awaited<ReturnType<typeof findPrimaryWorkspaceMembershipForUser>>>;
  subscription: Awaited<ReturnType<typeof findSubscriptionByWorkspaceId>>;
}): AppShellSession {
  return {
    currentUser: {
      id: input.membership.user.id,
      email: input.membership.user.email,
      name: input.membership.user.name,
    },
    currentWorkspace: {
      id: input.membership.workspace.id,
      name: input.membership.workspace.name,
      slug: input.membership.workspace.slug,
    },
    membership: {
      role: input.membership.role,
    },
    subscription: input.subscription
      ? {
          plan: input.subscription.plan,
          provider: input.subscription.provider,
          status: input.subscription.status,
          currentPeriodEnd: input.subscription.currentPeriodEnd ? input.subscription.currentPeriodEnd.toISOString() : null,
        }
      : null,
  };
}
