import "dotenv/config";

import { eq, inArray, or } from "drizzle-orm";

import { hashPassword, verifyPassword } from "../auth";
import { createDb, type Database } from "../client";
import {
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

const minimumPasswordLength = 12;
const tenantCreatedAt = new Date("2026-07-01T08:00:00.000Z");

async function main() {
  const action = parseAction(process.argv.slice(2));

  if (action === "help") {
    printHelp();
    return;
  }

  const summary = validateSalesDemoFixture();

  if (action === "check") {
    printFixtureSummary("Sales demo fixture is valid.", summary);
    console.log("No database connection was opened.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  const password = process.env.SALES_DEMO_PASSWORD;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required to apply the sales demo fixture.",
    );
  }

  if (!password) {
    throw new Error(
      "SALES_DEMO_PASSWORD is required. The demo login password is accepted only through the environment.",
    );
  }

  if (password.length < minimumPasswordLength) {
    throw new Error(
      `SALES_DEMO_PASSWORD must be at least ${minimumPasswordLength} characters long.`,
    );
  }

  const db = createDb(connectionString);
  const existingUser = await assertFixtureOwnership(db);
  const passwordHash =
    existingUser?.passwordHash &&
    verifyPassword(password, existingUser.passwordHash)
      ? existingUser.passwordHash
      : hashPassword(password);

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        id: salesDemoFixture.user.id,
        email: salesDemoFixture.user.email,
        name: salesDemoFixture.user.name,
        passwordHash,
        createdAt: tenantCreatedAt,
        updatedAt: tenantCreatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: salesDemoFixture.user.email,
          name: salesDemoFixture.user.name,
          passwordHash,
          updatedAt: tenantCreatedAt,
        },
      });

    await tx
      .insert(workspaces)
      .values({
        id: salesDemoFixture.workspace.id,
        name: salesDemoFixture.workspace.name,
        slug: salesDemoFixture.workspace.slug,
        ownerId: salesDemoFixture.user.id,
        createdAt: tenantCreatedAt,
        updatedAt: tenantCreatedAt,
      })
      .onConflictDoUpdate({
        target: workspaces.id,
        set: {
          name: salesDemoFixture.workspace.name,
          slug: salesDemoFixture.workspace.slug,
          ownerId: salesDemoFixture.user.id,
          updatedAt: tenantCreatedAt,
        },
      });

    await tx
      .insert(memberships)
      .values({
        workspaceId: salesDemoFixture.workspace.id,
        userId: salesDemoFixture.user.id,
        role: "owner",
        joinedAt: tenantCreatedAt,
      })
      .onConflictDoUpdate({
        target: [memberships.workspaceId, memberships.userId],
        set: {
          role: "owner",
        },
      });

    await tx
      .insert(subscriptions)
      .values({
        id: salesDemoFixture.subscription.id,
        workspaceId: salesDemoFixture.workspace.id,
        provider: salesDemoFixture.subscription.provider,
        status: salesDemoFixture.subscription.status,
        plan: salesDemoFixture.subscription.plan,
        currentPeriodStart: tenantCreatedAt,
        currentPeriodEnd: null,
        createdAt: tenantCreatedAt,
        updatedAt: tenantCreatedAt,
      })
      .onConflictDoUpdate({
        target: subscriptions.workspaceId,
        set: {
          provider: salesDemoFixture.subscription.provider,
          status: salesDemoFixture.subscription.status,
          plan: salesDemoFixture.subscription.plan,
          currentPeriodStart: tenantCreatedAt,
          currentPeriodEnd: null,
          externalCustomerId: null,
          externalSubscriptionId: null,
          updatedAt: tenantCreatedAt,
        },
      });

    for (const priceSheet of salesDemoFixture.priceSheets) {
      await tx
        .insert(priceSheets)
        .values({
          id: priceSheet.id,
          workspaceId: salesDemoFixture.workspace.id,
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
          createdById: salesDemoFixture.user.id,
          createdAt: priceSheet.createdAt,
          updatedAt: priceSheet.updatedAt,
        })
        .onConflictDoUpdate({
          target: priceSheets.id,
          set: {
            workspaceId: salesDemoFixture.workspace.id,
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
            createdById: salesDemoFixture.user.id,
            updatedAt: priceSheet.updatedAt,
          },
        });
    }

    const fixturePriceSheetIds = salesDemoFixture.priceSheets.map(
      (priceSheet) => priceSheet.id,
    );
    await tx
      .delete(priceSheetItems)
      .where(inArray(priceSheetItems.priceSheetId, fixturePriceSheetIds));
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

    const fixtureLeadIds = salesDemoFixture.priceSheets.flatMap((priceSheet) =>
      priceSheet.leads.map((lead) => lead.id),
    );
    await tx
      .delete(priceSheetLeads)
      .where(inArray(priceSheetLeads.id, fixtureLeadIds));
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

  printFixtureSummary("Sales demo workspace is ready.", summary);
  console.log(`Login email: ${salesDemoFixture.user.email}`);
  console.log(
    "The password was read from SALES_DEMO_PASSWORD and was not printed.",
  );
  console.log(
    "Only the fixed tenant and sheets, their catalogs, and seeded inquiry ids were replaced; non-seeded inquiries and unrelated records were preserved.",
  );
}

async function assertFixtureOwnership(db: Database) {
  const matchingUsers = await db.query.users.findMany({
    where: or(
      eq(users.id, salesDemoFixture.user.id),
      eq(users.email, salesDemoFixture.user.email),
    ),
  });

  for (const user of matchingUsers) {
    if (
      user.id === salesDemoFixture.user.id &&
      user.email !== salesDemoFixture.user.email
    ) {
      throw new Error(
        `Fixture user id ${user.id} is already owned by ${user.email}.`,
      );
    }

    if (
      user.email === salesDemoFixture.user.email &&
      user.id !== salesDemoFixture.user.id
    ) {
      throw new Error(
        `Fixture login email is already owned by user ${user.id}.`,
      );
    }
  }

  const matchingWorkspaces = await db.query.workspaces.findMany({
    where: or(
      eq(workspaces.id, salesDemoFixture.workspace.id),
      eq(workspaces.slug, salesDemoFixture.workspace.slug),
    ),
  });

  for (const workspace of matchingWorkspaces) {
    if (
      workspace.id === salesDemoFixture.workspace.id &&
      workspace.slug !== salesDemoFixture.workspace.slug
    ) {
      throw new Error(
        `Fixture workspace id ${workspace.id} is already owned by slug ${workspace.slug}.`,
      );
    }

    if (
      workspace.slug === salesDemoFixture.workspace.slug &&
      workspace.id !== salesDemoFixture.workspace.id
    ) {
      throw new Error(
        `Fixture workspace slug is already owned by workspace ${workspace.id}.`,
      );
    }
  }

  const fixturePriceSheetIds = salesDemoFixture.priceSheets.map(
    (priceSheet) => priceSheet.id,
  );
  const fixturePriceSheetSlugs = salesDemoFixture.priceSheets.map(
    (priceSheet) => priceSheet.slug,
  );
  const matchingPriceSheets = await db.query.priceSheets.findMany({
    where: or(
      inArray(priceSheets.id, fixturePriceSheetIds),
      inArray(priceSheets.slug, fixturePriceSheetSlugs),
    ),
    columns: {
      id: true,
      workspaceId: true,
      slug: true,
    },
  });
  const fixtureSheetById = new Map(
    salesDemoFixture.priceSheets.map((priceSheet) => [
      priceSheet.id,
      priceSheet,
    ]),
  );
  const fixtureSheetBySlug = new Map(
    salesDemoFixture.priceSheets.map((priceSheet) => [
      priceSheet.slug,
      priceSheet,
    ]),
  );

  for (const priceSheet of matchingPriceSheets) {
    const fixtureById = fixtureSheetById.get(priceSheet.id);
    const fixtureBySlug = fixtureSheetBySlug.get(priceSheet.slug);

    if (
      fixtureById &&
      priceSheet.workspaceId !== salesDemoFixture.workspace.id
    ) {
      throw new Error(
        `Fixture Price Sheet id ${priceSheet.id} belongs to workspace ${priceSheet.workspaceId}.`,
      );
    }

    if (fixtureBySlug && fixtureBySlug.id !== priceSheet.id) {
      throw new Error(
        `Fixture Price Sheet slug ${priceSheet.slug} belongs to Price Sheet ${priceSheet.id}.`,
      );
    }
  }

  const fixtureItemIds = salesDemoFixture.priceSheets.flatMap((priceSheet) =>
    priceSheet.items.map((item) => item.id),
  );
  const fixtureItemOwner = new Map(
    salesDemoFixture.priceSheets.flatMap((priceSheet) =>
      priceSheet.items.map((item) => [item.id, priceSheet.id] as const),
    ),
  );
  const matchingItems = await db.query.priceSheetItems.findMany({
    where: inArray(priceSheetItems.id, fixtureItemIds),
    columns: {
      id: true,
      priceSheetId: true,
    },
  });

  for (const item of matchingItems) {
    if (fixtureItemOwner.get(item.id) !== item.priceSheetId) {
      throw new Error(
        `Fixture service id ${item.id} belongs to Price Sheet ${item.priceSheetId}.`,
      );
    }
  }

  const fixtureLeadIds = salesDemoFixture.priceSheets.flatMap((priceSheet) =>
    priceSheet.leads.map((lead) => lead.id),
  );
  const fixtureLeadOwner = new Map(
    salesDemoFixture.priceSheets.flatMap((priceSheet) =>
      priceSheet.leads.map((lead) => [lead.id, priceSheet.id] as const),
    ),
  );
  const matchingLeads = await db.query.priceSheetLeads.findMany({
    where: inArray(priceSheetLeads.id, fixtureLeadIds),
    columns: {
      id: true,
      priceSheetId: true,
    },
  });

  for (const lead of matchingLeads) {
    if (fixtureLeadOwner.get(lead.id) !== lead.priceSheetId) {
      throw new Error(
        `Fixture inquiry id ${lead.id} belongs to Price Sheet ${lead.priceSheetId}.`,
      );
    }
  }

  const matchingSubscriptions = await db.query.subscriptions.findMany({
    where: or(
      eq(subscriptions.id, salesDemoFixture.subscription.id),
      eq(subscriptions.workspaceId, salesDemoFixture.workspace.id),
    ),
    columns: {
      id: true,
      workspaceId: true,
    },
  });

  for (const subscription of matchingSubscriptions) {
    if (
      subscription.id === salesDemoFixture.subscription.id &&
      subscription.workspaceId !== salesDemoFixture.workspace.id
    ) {
      throw new Error(
        `Fixture subscription id ${subscription.id} belongs to workspace ${subscription.workspaceId}.`,
      );
    }
  }

  return (
    matchingUsers.find((user) => user.id === salesDemoFixture.user.id) ?? null
  );
}

function parseAction(argv: string[]) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return "help" as const;
  }

  if (argv.length === 1 && argv[0] === "--check") {
    return "check" as const;
  }

  if (argv.length === 1 && argv[0] === "--apply") {
    return "apply" as const;
  }

  throw new Error("Use exactly one of --check, --apply, or --help.");
}

function printFixtureSummary(
  heading: string,
  summary: ReturnType<typeof validateSalesDemoFixture>,
) {
  console.log(heading);
  console.log(`Workspace: ${summary.workspaceSlug}`);
  console.log(`Published Price Sheets: ${summary.priceSheetCount}`);
  console.log(`Services: ${summary.serviceCount}`);
  console.log(`Seeded inquiries: ${summary.inquiryCount}`);
}

function printHelp() {
  console.log("Unitforge Armenia sales demo seeder");
  console.log("");
  console.log(
    "Static fixture validation (does not open a database connection):",
  );
  console.log("  pnpm db:check:sales-demo");
  console.log("");
  console.log("Apply the fixture:");
  console.log(
    "  Set DATABASE_URL and SALES_DEMO_PASSWORD, then run pnpm db:seed:sales-demo",
  );
  console.log("");
  console.log(
    `SALES_DEMO_PASSWORD must contain at least ${minimumPasswordLength} characters and is never accepted as a CLI argument.`,
  );
  console.log(
    "The apply flow upserts one fixed tenant and three fixed published sheets.",
  );
  console.log(
    "Catalog items inside those three fixture sheets are replaced deterministically.",
  );
  console.log(
    "Seeded inquiry ids are replaced; unrelated inquiries, sheets, workspaces, and users are preserved.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
