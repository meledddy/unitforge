import { eq } from "drizzle-orm";

import { hashPassword } from "./auth";
import { createDb, type Database } from "./client";
import { memberships, subscriptions, users, workspaces } from "./schema";

const MINIMUM_ONBOARDING_PASSWORD_LENGTH = 12;
const MAXIMUM_WORKSPACE_SLUG_LENGTH = 64;
const PILOT_TRIAL_DAYS = 14;

export interface PilotOnboardingInput {
  workspaceName: string;
  email: string;
  password: string;
  name?: string | null;
}

export interface PilotOnboardingResult {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  membership: {
    role: "owner";
  };
  subscription: {
    plan: "studio";
    provider: "manual";
    status: "trialing";
    currentPeriodEnd: Date;
  };
}

export async function onboardPilotWorkspaceUser(
  input: PilotOnboardingInput,
  db = createDb(),
): Promise<PilotOnboardingResult> {
  const workspaceName = normalizeRequiredValue(
    input.workspaceName,
    "workspaceName",
  );
  const email = normalizeEmail(input.email);
  const password = normalizeRequiredValue(input.password, "password");
  const name = normalizeOptionalValue(input.name);

  if (password.length < MINIMUM_ONBOARDING_PASSWORD_LENGTH) {
    throw new Error(
      `Password must be at least ${MINIMUM_ONBOARDING_PASSWORD_LENGTH} characters long.`,
    );
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error(
      `A user with email ${email} already exists. Manual pilot onboarding only creates new users.`,
    );
  }

  const workspaceSlug = await getUniqueWorkspaceSlug(db, workspaceName);
  const passwordHash = hashPassword(password);

  return db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    if (!createdUser) {
      throw new Error("User could not be created.");
    }

    const [createdWorkspace] = await tx
      .insert(workspaces)
      .values({
        name: workspaceName,
        slug: workspaceSlug,
        ownerId: createdUser.id,
      })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
      });

    if (!createdWorkspace) {
      throw new Error("Workspace could not be created.");
    }

    await tx.insert(memberships).values({
      workspaceId: createdWorkspace.id,
      userId: createdUser.id,
      role: "owner",
    });

    const trialStartedAt = new Date();
    const trialEndsAt = new Date(
      trialStartedAt.getTime() + PILOT_TRIAL_DAYS * 24 * 60 * 60 * 1000,
    );
    const [createdSubscription] = await tx
      .insert(subscriptions)
      .values({
        workspaceId: createdWorkspace.id,
        provider: "manual",
        status: "trialing",
        plan: "studio",
        currentPeriodStart: trialStartedAt,
        currentPeriodEnd: trialEndsAt,
      })
      .returning({
        plan: subscriptions.plan,
        provider: subscriptions.provider,
        status: subscriptions.status,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
      });

    if (!createdSubscription?.currentPeriodEnd) {
      throw new Error("Pilot subscription could not be created.");
    }

    return {
      user: createdUser,
      workspace: createdWorkspace,
      membership: {
        role: "owner",
      },
      subscription: {
        plan: "studio",
        provider: "manual",
        status: "trialing",
        currentPeriodEnd: createdSubscription.currentPeriodEnd,
      },
    } satisfies PilotOnboardingResult;
  });
}

async function getUniqueWorkspaceSlug(db: Database, workspaceName: string) {
  const baseSlug = slugifyWorkspaceName(workspaceName);

  for (let attempt = 0; attempt < 10_000; attempt += 1) {
    const candidateSlug =
      attempt === 0
        ? baseSlug
        : truncateWorkspaceSlug(`${baseSlug}-${attempt + 1}`);

    const existingWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, candidateSlug),
    });

    if (!existingWorkspace) {
      return candidateSlug;
    }
  }

  throw new Error("A unique workspace slug could not be generated.");
}

function normalizeEmail(value: string) {
  return normalizeRequiredValue(value, "email").toLowerCase();
}

function normalizeRequiredValue(
  value: string | null | undefined,
  fieldName: string,
) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValue;
}

function normalizeOptionalValue(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : null;
}

function slugifyWorkspaceName(value: string) {
  const normalizedValue = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return truncateWorkspaceSlug(normalizedValue || "workspace");
}

function truncateWorkspaceSlug(value: string) {
  return (
    value.slice(0, MAXIMUM_WORKSPACE_SLUG_LENGTH).replace(/-+$/g, "") ||
    "workspace"
  );
}
