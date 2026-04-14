import "dotenv/config";

import { and, eq, sql } from "drizzle-orm";

import {
  mockSessionMembership,
  mockSessionSubscription,
  mockSessionUser,
  mockSessionWorkspace,
} from "../../../core/src/mock-session";
import { hashPassword } from "../auth";
import { createDb } from "../client";
import { memberships, subscriptions, users, workspaces } from "../schema";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const bootstrapPassword = process.env.AUTH_BOOTSTRAP_PASSWORD;

  if (!bootstrapPassword) {
    throw new Error("AUTH_BOOTSTRAP_PASSWORD is required to seed the bootstrap operator login.");
  }

  const db = createDb(process.env.DATABASE_URL);
  const passwordHash = hashPassword(bootstrapPassword);

  const existingUserByEmail = await db.query.users.findFirst({
    where: eq(users.email, mockSessionUser.email),
  });

  if (existingUserByEmail && existingUserByEmail.id !== mockSessionUser.id) {
    throw new Error(`A user with email ${mockSessionUser.email} already exists with a different id.`);
  }

  const existingWorkspaceBySlug = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, mockSessionWorkspace.slug),
  });

  if (existingWorkspaceBySlug && existingWorkspaceBySlug.id !== mockSessionWorkspace.id) {
    throw new Error(`A workspace with slug ${mockSessionWorkspace.slug} already exists with a different id.`);
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        id: mockSessionUser.id,
        email: mockSessionUser.email,
        name: mockSessionUser.name,
        passwordHash,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: mockSessionUser.email,
          name: mockSessionUser.name,
          passwordHash,
          updatedAt: sql`now()`,
        },
      });

    await tx
      .insert(workspaces)
      .values({
        id: mockSessionWorkspace.id,
        name: mockSessionWorkspace.name,
        slug: mockSessionWorkspace.slug,
        ownerId: mockSessionUser.id,
      })
      .onConflictDoUpdate({
        target: workspaces.id,
        set: {
          name: mockSessionWorkspace.name,
          slug: mockSessionWorkspace.slug,
          ownerId: mockSessionUser.id,
          updatedAt: sql`now()`,
        },
      });

    await tx
      .insert(memberships)
      .values({
        workspaceId: mockSessionWorkspace.id,
        userId: mockSessionUser.id,
        role: mockSessionMembership.role,
      })
      .onConflictDoUpdate({
        target: [memberships.workspaceId, memberships.userId],
        set: {
          role: mockSessionMembership.role,
        },
      });

    await tx
      .insert(subscriptions)
      .values({
        workspaceId: mockSessionWorkspace.id,
        provider: mockSessionSubscription.provider,
        status: mockSessionSubscription.status,
        plan: mockSessionSubscription.plan,
        currentPeriodEnd: mockSessionSubscription.currentPeriodEnd ? new Date(mockSessionSubscription.currentPeriodEnd) : null,
      })
      .onConflictDoUpdate({
        target: subscriptions.workspaceId,
        set: {
          provider: mockSessionSubscription.provider,
          status: mockSessionSubscription.status,
          plan: mockSessionSubscription.plan,
          currentPeriodEnd: mockSessionSubscription.currentPeriodEnd ? new Date(mockSessionSubscription.currentPeriodEnd) : null,
          updatedAt: sql`now()`,
        },
      });
  });

  const seededMembership = await db.query.memberships.findFirst({
    where: and(eq(memberships.workspaceId, mockSessionWorkspace.id), eq(memberships.userId, mockSessionUser.id)),
  });

  if (!seededMembership) {
    throw new Error("Bootstrap membership could not be verified.");
  }

  console.log("Bootstrap operator database rows are ready.");
  console.log(`User: ${mockSessionUser.email} (${mockSessionUser.id})`);
  console.log(`Workspace: ${mockSessionWorkspace.slug} (${mockSessionWorkspace.id})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
