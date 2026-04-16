import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { createDb, onboardPilotWorkspaceUser, users, workspaces } from "@unitforge/db";
import { eq } from "drizzle-orm";

import { authenticateUserByPassword, getAppShellSessionForSessionToken, invalidateAuthSession } from "../src/server/auth/service";
import { listWorkspacePriceSheets } from "../src/server/price-sheets/service";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const db = createDb(process.env.DATABASE_URL);
  const timestamp = Date.now().toString();
  const password = `PilotPass-${randomUUID()}`;
  const email = `pilot-${timestamp}@unitforge.dev`;
  const workspaceName = `Pilot Workspace ${timestamp}`;
  let sessionToken: string | null = null;
  let onboardingResult: Awaited<ReturnType<typeof onboardPilotWorkspaceUser>> | null = null;

  try {
    onboardingResult = await onboardPilotWorkspaceUser(
      {
        workspaceName,
        email,
        password,
        name: "Pilot User",
      },
      db,
    );

    assert.equal(onboardingResult.membership.role, "owner");

    const authenticatedUser = await authenticateUserByPassword({
      email,
      password,
    });

    sessionToken = authenticatedUser.sessionToken;

    const appSession = await getAppShellSessionForSessionToken(sessionToken);

    assert(appSession, "Expected the onboarded login session to resolve.");
    assert.equal(appSession.currentUser.email, email);
    assert.equal(appSession.currentWorkspace.id, onboardingResult.workspace.id);
    assert.equal(appSession.currentWorkspace.slug, onboardingResult.workspace.slug);
    assert.equal(appSession.membership.role, "owner");

    const listedPriceSheets = await listWorkspacePriceSheets(appSession);
    assert.deepEqual(listedPriceSheets, []);

    await invalidateAuthSession(sessionToken);
    sessionToken = null;

    console.log("Pilot onboarding verification passed.");
    console.log(`Verified login user: ${email}`);
    console.log(`Verified workspace: ${onboardingResult.workspace.slug}`);
  } finally {
    if (sessionToken) {
      await invalidateAuthSession(sessionToken);
    }

    if (onboardingResult) {
      await db.delete(workspaces).where(eq(workspaces.id, onboardingResult.workspace.id));
      await db.delete(users).where(eq(users.id, onboardingResult.user.id));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
