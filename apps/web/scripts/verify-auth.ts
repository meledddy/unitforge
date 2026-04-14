import "dotenv/config";

import assert from "node:assert/strict";

import { mockSessionUser, mockSessionWorkspace } from "@unitforge/core";

import { authenticateUserByPassword, getAppShellSessionForSessionToken, invalidateAuthSession } from "../src/server/auth/service";

async function main() {
  const bootstrapPassword = process.env.AUTH_BOOTSTRAP_PASSWORD;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  if (!bootstrapPassword) {
    throw new Error("AUTH_BOOTSTRAP_PASSWORD is required.");
  }

  const authenticatedUser = await authenticateUserByPassword({
    email: mockSessionUser.email,
    password: bootstrapPassword,
  });

  assert(authenticatedUser.sessionToken, "Expected a real session token from sign-in.");

  const appSession = await getAppShellSessionForSessionToken(authenticatedUser.sessionToken);

  assert(appSession, "Expected the signed-in session to resolve.");
  assert.equal(appSession.currentUser.email, mockSessionUser.email);
  assert.equal(appSession.currentWorkspace.slug, mockSessionWorkspace.slug);

  await invalidateAuthSession(authenticatedUser.sessionToken);

  const invalidatedSession = await getAppShellSessionForSessionToken(authenticatedUser.sessionToken);

  assert.equal(invalidatedSession, null);

  console.log("Auth verification passed.");
  console.log(`Verified login user: ${mockSessionUser.email}`);
  console.log(`Verified workspace: ${mockSessionWorkspace.slug}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
