import "dotenv/config";

import {
  mockSessionMembership,
  mockSessionSubscription,
  mockSessionUser,
  mockSessionWorkspace,
} from "../../../core/src/mock-session";
import { hashPassword } from "../auth";
import { createDb } from "../client";
import {
  accessRequests,
  authSessions,
  memberships,
  priceSheetItems,
  priceSheetLeads,
  priceSheets,
  subscriptions,
  users,
  workspaces,
} from "../schema";
import {
  salesDemoFixture,
  validateSalesDemoFixture,
} from "./sales-demo-fixture";

const confirmationFlag = "--confirm-reset";
const localAppHosts = new Set(["localhost", "127.0.0.1", "::1"]);

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const bootstrapPassword = process.env.AUTH_BOOTSTRAP_PASSWORD;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  if (!bootstrapPassword) {
    throw new Error("AUTH_BOOTSTRAP_PASSWORD is required.");
  }

  if (!process.argv.includes(confirmationFlag)) {
    throw new Error(
      `Refusing to reset the database without ${confirmationFlag}.`,
    );
  }

  assertLocalAppConfiguration();
  const fixtureSummary = validateSalesDemoFixture();
  const db = createDb(connectionString);
  const passwordHash = hashPassword(bootstrapPassword);
  const databaseUrl = new URL(connectionString);

  console.log(
    `Resetting ${databaseUrl.hostname}/${databaseUrl.pathname.replace(/^\//, "")} for the local Unitforge app.`,
  );

  await db.transaction(async (tx) => {
    await tx.delete(accessRequests);
    await tx.delete(authSessions);
    await tx.delete(priceSheetLeads);
    await tx.delete(priceSheetItems);
    await tx.delete(priceSheets);
    await tx.delete(subscriptions);
    await tx.delete(memberships);
    await tx.delete(workspaces);
    await tx.delete(users);

    await tx.insert(users).values({
      id: mockSessionUser.id,
      email: mockSessionUser.email,
      name: mockSessionUser.name,
      passwordHash,
    });

    await tx.insert(workspaces).values({
      id: mockSessionWorkspace.id,
      name: mockSessionWorkspace.name,
      slug: mockSessionWorkspace.slug,
      ownerId: mockSessionUser.id,
    });

    await tx.insert(memberships).values({
      workspaceId: mockSessionWorkspace.id,
      userId: mockSessionUser.id,
      role: mockSessionMembership.role,
    });

    await tx.insert(subscriptions).values({
      workspaceId: mockSessionWorkspace.id,
      provider: mockSessionSubscription.provider,
      status: mockSessionSubscription.status,
      plan: mockSessionSubscription.plan,
      currentPeriodStart: new Date(),
      currentPeriodEnd: mockSessionSubscription.currentPeriodEnd
        ? new Date(mockSessionSubscription.currentPeriodEnd)
        : null,
    });

    await tx.insert(priceSheets).values(
      salesDemoFixture.priceSheets.map((priceSheet) => ({
        id: priceSheet.id,
        workspaceId: mockSessionWorkspace.id,
        title: priceSheet.title,
        description: priceSheet.description,
        slug: priceSheet.slug,
        currency: priceSheet.currency,
        locale: priceSheet.locale,
        translations: priceSheet.translations,
        publicSettings: priceSheet.publicSettings,
        theme: priceSheet.theme,
        status: priceSheet.status,
        publishedAt: priceSheet.publishedAt,
        createdById: mockSessionUser.id,
        createdAt: priceSheet.createdAt,
        updatedAt: priceSheet.updatedAt,
      })),
    );

    await tx.insert(priceSheetItems).values(
      salesDemoFixture.priceSheets.flatMap((priceSheet) =>
        priceSheet.items.map((item) => ({
          id: item.id,
          priceSheetId: priceSheet.id,
          name: item.name,
          description: item.description,
          section: item.section,
          translations: item.translations,
          priceCents: item.priceCents,
          position: item.position,
          createdAt: priceSheet.createdAt,
          updatedAt: priceSheet.updatedAt,
        })),
      ),
    );

    await tx.insert(priceSheetLeads).values(
      salesDemoFixture.priceSheets.flatMap((priceSheet) =>
        priceSheet.leads.map((lead) => ({
          id: lead.id,
          priceSheetId: priceSheet.id,
          sheetSlugSnapshot: priceSheet.slug,
          contactName: lead.contactName,
          companyOrBusinessName: lead.companyOrBusinessName,
          email: lead.email,
          phoneOrHandle: lead.phoneOrHandle,
          message: lead.message,
          locale: lead.locale,
          createdAt: lead.createdAt,
        })),
      ),
    );
  });

  const [
    remainingUsers,
    remainingWorkspaces,
    seededSheets,
    seededItems,
    seededLeads,
    remainingAccessRequests,
  ] = await Promise.all([
    db.query.users.findMany(),
    db.query.workspaces.findMany(),
    db.query.priceSheets.findMany(),
    db.query.priceSheetItems.findMany(),
    db.query.priceSheetLeads.findMany(),
    db.query.accessRequests.findMany(),
  ]);

  if (
    remainingUsers.length !== 1 ||
    remainingUsers[0]?.email !== mockSessionUser.email ||
    remainingWorkspaces.length !== 1 ||
    remainingWorkspaces[0]?.id !== mockSessionWorkspace.id ||
    seededSheets.length !== fixtureSummary.priceSheetCount ||
    seededItems.length !== fixtureSummary.serviceCount ||
    seededLeads.length !== fixtureSummary.inquiryCount ||
    remainingAccessRequests.length !== 0
  ) {
    throw new Error(
      "The reset completed, but the resulting demo state failed verification.",
    );
  }

  console.log("Unitforge demo database reset completed.");
  console.log(`Login: ${mockSessionUser.email}`);
  console.log(`Workspace: ${mockSessionWorkspace.slug}`);
  console.log(`Published Price Sheets: ${seededSheets.length}`);
  console.log(`Services: ${seededItems.length}`);
  console.log(`Seeded inquiries: ${seededLeads.length}`);
  console.log(
    "All previous sessions were removed. Sign in again with AUTH_BOOTSTRAP_PASSWORD.",
  );
}

function assertLocalAppConfiguration() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is required for the reset safety check.",
    );
  }

  const appHostname = new URL(appUrl).hostname;

  if (!localAppHosts.has(appHostname)) {
    throw new Error(
      `Refusing to reset while NEXT_PUBLIC_APP_URL points to ${appHostname}.`,
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
