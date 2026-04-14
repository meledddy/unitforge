import { authSessions, memberships, subscriptions, users } from "@unitforge/db";
import { and, eq, gt, lt } from "drizzle-orm";

import { getServerDb } from "@/server/db";

import { AuthServiceError } from "./errors";

function getRequiredDb() {
  const db = getServerDb();

  if (!db) {
    throw new AuthServiceError("CONFIGURATION", "Database access is required for authentication.");
  }

  return db;
}

export async function findUserByEmail(email: string) {
  return getRequiredDb().query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function createAuthSessionRecord(input: { userId: string; tokenHash: string; expiresAt: Date }) {
  const db = getRequiredDb();

  await db.delete(authSessions).where(and(eq(authSessions.userId, input.userId), lt(authSessions.expiresAt, new Date())));

  const [createdSession] = await db
    .insert(authSessions)
    .values({
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    })
    .returning();

  return createdSession ?? null;
}

export async function findAuthSessionRecordByTokenHash(tokenHash: string) {
  return getRequiredDb().query.authSessions.findFirst({
    where: and(eq(authSessions.tokenHash, tokenHash), gt(authSessions.expiresAt, new Date())),
    with: {
      user: true,
    },
  });
}

export async function deleteAuthSessionRecordByTokenHash(tokenHash: string) {
  return getRequiredDb().delete(authSessions).where(eq(authSessions.tokenHash, tokenHash));
}

export async function findPrimaryWorkspaceMembershipForUser(userId: string) {
  return getRequiredDb().query.memberships.findFirst({
    where: eq(memberships.userId, userId),
    orderBy: (membership, { asc }) => [asc(membership.joinedAt)],
    with: {
      user: true,
      workspace: true,
    },
  });
}

export async function findSubscriptionByWorkspaceId(workspaceId: string) {
  return getRequiredDb().query.subscriptions.findFirst({
    where: eq(subscriptions.workspaceId, workspaceId),
  });
}

export async function findWorkspaceMembership(userId: string, workspaceId: string) {
  return getRequiredDb().query.memberships.findFirst({
    where: and(eq(memberships.userId, userId), eq(memberships.workspaceId, workspaceId)),
    with: {
      user: true,
      workspace: true,
    },
  });
}
