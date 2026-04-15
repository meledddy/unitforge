import "dotenv/config";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { createDb, memberships, priceSheetItems, priceSheets, users, workspaces } from "@unitforge/db";
import { eq } from "drizzle-orm";

import {
  resolvePriceSheetContent,
  resolvePriceSheetItemContent,
} from "../src/features/price-sheets/localization";
import { type PriceSheetFormValues, toPriceSheetMutationInput } from "../src/features/price-sheets/validation";
import { type PriceSheetLeadActionState, submitPriceSheetLeadAction } from "../src/server/price-sheet-leads/actions";
import { listWorkspacePriceSheetLeads } from "../src/server/price-sheet-leads/service";
import {
  createWorkspacePriceSheet,
  deleteWorkspacePriceSheet,
  duplicateWorkspacePriceSheet,
  getPublishedPriceSheetBySlug,
  getWorkspacePriceSheetForEdit,
  listWorkspacePriceSheets,
  setWorkspacePriceSheetStatus,
  updateWorkspacePriceSheet,
} from "../src/server/price-sheets/service";
import { getSeededAppShellSession } from "./bootstrap-session";

const initialLeadActionState: PriceSheetLeadActionState = {
  status: "idle",
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const session = await getSeededAppShellSession();
  const timestamp = Date.now().toString();
  const slug = `verification-sheet-${timestamp}`;
  const title = `Verification Sheet ${timestamp}`;
  let createdPriceSheetId: string | null = null;
  let duplicatedPriceSheetId: string | null = null;
  let foreignFixture: Awaited<ReturnType<typeof createForeignWorkspaceFixture>> | null = null;
  const payload: PriceSheetFormValues = {
    title,
    description: "Public-facing verification sheet description",
    secondaryTitle: `RU ${title}`,
    secondaryDescription: "Russian verification text",
    contactLabel: "Verification Studio",
    contactEmail: "hello@example.com",
    contactPhone: "@verificationstudio",
    primaryCtaLabel: "Email us",
    secondaryCtaLabel: "Message us",
    inquiryText: "Reach out for scope confirmation and booking.",
    publicInquiryState: "enabled",
    slug,
    status: "published",
    currency: "USD",
    defaultContentLocale: "en-US",
    theme: "slate",
    items: [
      {
        name: "Verification Item",
        description: "Created through createPriceSheetAction",
        section: "Verification",
        secondaryName: "Verification Item RU",
        secondaryDescription: "Created through createPriceSheetAction RU",
        secondarySection: "Verification RU",
        price: "125.00",
      },
    ],
  };
  await cleanupVerificationArtifacts(session);

  try {
    await createWorkspacePriceSheet(session, toPriceSheetMutationInput(payload));

    const listedAfterCreate = await listWorkspacePriceSheets(session);
    const created = listedAfterCreate.find((priceSheet) => priceSheet.slug === slug);

    assert(created, `Created Price Sheet with slug ${slug} was not found in the workspace list.`);
    createdPriceSheetId = created.id;
    assert.equal(created.status, "published");
    assert.equal(created.itemCount, 1);
    assert.equal(created.theme, "slate");
    assert.equal(created.defaultContentLocale, "en-US");

    const editable = await getWorkspacePriceSheetForEdit(session, created.id);
    assert.equal(editable.title, title);
    assert.equal(editable.description, payload.description);
    assert.equal(editable.slug, slug);
    assert.equal(editable.theme, "slate");
    assert.equal(editable.defaultContentLocale, "en-US");
    assert.equal(editable.formValues.secondaryTitle, payload.secondaryTitle);
    assert.equal(editable.formValues.contactLabel, payload.contactLabel);
    assert.equal(editable.formValues.contactEmail, payload.contactEmail);
    assert.equal(editable.formValues.contactPhone, payload.contactPhone);
    assert.equal(editable.formValues.primaryCtaLabel, payload.primaryCtaLabel);
    assert.equal(editable.formValues.secondaryCtaLabel, payload.secondaryCtaLabel);
    assert.equal(editable.formValues.inquiryText, payload.inquiryText);
    assert.equal(editable.formValues.publicInquiryState, payload.publicInquiryState);
    assert.equal(editable.items.length, 1);
    assert.equal(editable.formValues.items[0]?.secondaryName, payload.items[0]?.secondaryName);

    const publicSheet = await getPublishedPriceSheetBySlug(slug);
    assert(publicSheet);
    assert.equal(publicSheet.description, payload.description);
    assert.equal(publicSheet.slug, slug);
    assert.equal(publicSheet.theme, "slate");
    assert.equal(publicSheet.defaultContentLocale, "en-US");
    assert.equal(publicSheet.items.length, 1);
    assert.equal(publicSheet.translations["ru-RU"]?.title, payload.secondaryTitle);
    assert.equal(publicSheet.publicSettings.contactLabel, payload.contactLabel);
    assert.equal(publicSheet.publicSettings.contactEmail, payload.contactEmail);
    assert.equal(publicSheet.publicSettings.contactPhone, payload.contactPhone);
    assert.equal(publicSheet.publicSettings.primaryCtaLabel, payload.primaryCtaLabel);
    assert.equal(publicSheet.publicSettings.secondaryCtaLabel, payload.secondaryCtaLabel);
    assert.equal(publicSheet.publicSettings.inquiryText, payload.inquiryText);
    assert.equal(publicSheet.publicSettings.inquiryEnabled, true);
    assert.equal(publicSheet.items[0]?.translations["ru-RU"]?.name, payload.items[0]?.secondaryName);

    const englishContent = resolvePriceSheetContent({
      defaultContentLocale: publicSheet.defaultContentLocale,
      requestedContentLocale: "en-US",
      title: publicSheet.title,
      description: publicSheet.description,
      translations: publicSheet.translations,
    });
    const russianContent = resolvePriceSheetContent({
      defaultContentLocale: publicSheet.defaultContentLocale,
      requestedContentLocale: "ru-RU",
      title: publicSheet.title,
      description: publicSheet.description,
      translations: publicSheet.translations,
    });
    const russianItem = resolvePriceSheetItemContent({
      defaultContentLocale: publicSheet.defaultContentLocale,
      requestedContentLocale: "ru-RU",
      name: publicSheet.items[0]!.name,
      description: publicSheet.items[0]!.description,
      section: publicSheet.items[0]!.section,
      translations: publicSheet.items[0]!.translations,
    });

    assert.equal(englishContent.title, title);
    assert.equal(russianContent.title, payload.secondaryTitle);
    assert.equal(russianItem.name, payload.items[0]?.secondaryName);

    const leadFormData = new FormData();
    leadFormData.set("priceSheetSlug", slug);
    leadFormData.set("locale", "ru-RU");
    leadFormData.set("language", "ru");
    leadFormData.set("contactName", "Verification Contact");
    leadFormData.set("companyOrBusinessName", "Verification Company");
    leadFormData.set("email", "lead@example.com");
    leadFormData.set("phoneOrHandle", "@leadcontact");
    leadFormData.set("message", "Need a tailored package for this sheet.");

    const leadResult = await submitPriceSheetLeadAction(initialLeadActionState, leadFormData);
    assert.equal(leadResult.status, "success");

    const storedLeads = await listWorkspacePriceSheetLeads(session, created.id);
    assert.equal(storedLeads.length, 1);
    assert.equal(storedLeads[0]?.contactName, "Verification Contact");
    assert.equal(storedLeads[0]?.companyOrBusinessName, "Verification Company");
    assert.equal(storedLeads[0]?.email, "lead@example.com");
    assert.equal(storedLeads[0]?.phoneOrHandle, "@leadcontact");
    assert.equal(storedLeads[0]?.message, "Need a tailored package for this sheet.");
    assert.equal(storedLeads[0]?.locale, "ru-RU");
    assert.equal(storedLeads[0]?.sheetSlugSnapshot, slug);

    const duplicated = await duplicateWorkspacePriceSheet(session, created.id);
    duplicatedPriceSheetId = duplicated.id;

    assert.notEqual(duplicated.id, created.id);
    assert.equal(duplicated.status, "draft");
    assert.equal(duplicated.title, `${title} Copy`);
    assert.equal(duplicated.description, payload.description);
    assert.notEqual(duplicated.slug, slug);
    assert.equal(duplicated.slug, `${slug}-copy`);
    assert.equal(duplicated.theme, "slate");
    assert.equal(duplicated.defaultContentLocale, "en-US");
    assert.equal(duplicated.publicSettings.contactLabel, payload.contactLabel);
    assert.equal(duplicated.publicSettings.contactEmail, payload.contactEmail);
    assert.equal(duplicated.publicSettings.contactPhone, payload.contactPhone);
    assert.equal(duplicated.publicSettings.primaryCtaLabel, payload.primaryCtaLabel);
    assert.equal(duplicated.publicSettings.secondaryCtaLabel, payload.secondaryCtaLabel);
    assert.equal(duplicated.publicSettings.inquiryText, payload.inquiryText);
    assert.equal(duplicated.publicSettings.inquiryEnabled, true);
    assert.equal(duplicated.items.length, 1);
    assert.equal(duplicated.formValues.secondaryTitle, payload.secondaryTitle);
    assert.equal(duplicated.formValues.items[0]?.secondaryName, payload.items[0]?.secondaryName);
    assert.equal(duplicated.formValues.items[0]?.secondaryDescription, payload.items[0]?.secondaryDescription);
    assert.equal(duplicated.formValues.items[0]?.secondarySection, payload.items[0]?.secondarySection);
    assert.equal(duplicated.formValues.status, "draft");

    const listedAfterDuplicate = await listWorkspacePriceSheets(session);
    const duplicatedListItem = listedAfterDuplicate.find((priceSheet) => priceSheet.id === duplicated.id);
    assert(duplicatedListItem, "Duplicated Price Sheet was not found in the workspace list.");
    assert.equal(duplicatedListItem.status, "draft");
    assert.equal(duplicatedListItem.slug, `${slug}-copy`);

    const duplicatedEditable = await getWorkspacePriceSheetForEdit(session, duplicated.id);
    assert.equal(duplicatedEditable.title, `${title} Copy`);
    assert.equal(duplicatedEditable.slug, `${slug}-copy`);
    assert.equal(duplicatedEditable.status, "draft");
    assert.equal(duplicatedEditable.formValues.secondaryTitle, payload.secondaryTitle);
    assert.equal(duplicatedEditable.formValues.items[0]?.secondaryName, payload.items[0]?.secondaryName);

    const duplicatedLeads = await listWorkspacePriceSheetLeads(session, duplicated.id);
    assert.equal(duplicatedLeads.length, 0);

    const duplicatedPublicSheet = await getPublishedPriceSheetBySlug(duplicated.slug);
    assert.equal(duplicatedPublicSheet, null);

    foreignFixture = await createForeignWorkspaceFixture();
    const foreignSheet = foreignFixture;

    const listedDuringForeignFixture = await listWorkspacePriceSheets(session);
    assert(!listedDuringForeignFixture.some((priceSheet) => priceSheet.id === foreignSheet.priceSheetId));

    await assertRejectsCrossWorkspaceAccess(async () => {
      await getWorkspacePriceSheetForEdit(session, foreignSheet.priceSheetId);
    });

    await assertRejectsCrossWorkspaceAccess(async () => {
      await updateWorkspacePriceSheet(
        session,
        foreignSheet.priceSheetId,
        toPriceSheetMutationInput({
          ...payload,
          slug: foreignSheet.slug,
        }),
      );
    });

    await assertRejectsCrossWorkspaceAccess(async () => {
      await setWorkspacePriceSheetStatus(session, foreignSheet.priceSheetId, "draft");
    });

    await assertRejectsCrossWorkspaceAccess(async () => {
      await duplicateWorkspacePriceSheet(session, foreignSheet.priceSheetId);
    });

    await assertRejectsCrossWorkspaceAccess(async () => {
      await listWorkspacePriceSheetLeads(session, foreignSheet.priceSheetId);
    });

    await setWorkspacePriceSheetStatus(session, created.id, "draft");

    const unpublishedLeadResult = await submitPriceSheetLeadAction(initialLeadActionState, leadFormData);
    assert.equal(unpublishedLeadResult.status, "error");

    await deleteWorkspacePriceSheet(session, created.id);
    createdPriceSheetId = null;

    const listedAfterDelete = await listWorkspacePriceSheets(session);
    assert(!listedAfterDelete.some((priceSheet) => priceSheet.id === created.id));

    console.log("Price Sheets verification passed.");
    console.log(`Verified workspace: ${session.currentWorkspace.slug}`);
    console.log(`Verified create flow slug: ${slug}`);
  } finally {
    if (duplicatedPriceSheetId) {
      await deleteWorkspacePriceSheet(session, duplicatedPriceSheetId);
    }

    if (createdPriceSheetId) {
      await deleteWorkspacePriceSheet(session, createdPriceSheetId);
    }

    if (foreignFixture) {
      await cleanupForeignWorkspaceFixture(foreignFixture);
    }
  }
}

async function cleanupVerificationArtifacts(session: Awaited<ReturnType<typeof getSeededAppShellSession>>) {
  const listedPriceSheets = await listWorkspacePriceSheets(session);

  for (const priceSheet of listedPriceSheets) {
    if (priceSheet.slug.startsWith("verification-sheet-") || priceSheet.slug.startsWith("e2e-")) {
      await deleteWorkspacePriceSheet(session, priceSheet.id);
    }
  }
}

async function assertRejectsCrossWorkspaceAccess(run: () => Promise<unknown>) {
  await assert.rejects(run, (error: unknown) => {
    if (typeof error === "object" && error !== null && "code" in error) {
      assert.equal((error as { code?: string }).code, "NOT_FOUND");
      return true;
    }

    return false;
  });
}

async function createForeignWorkspaceFixture() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const db = createDb(process.env.DATABASE_URL);
  const userId = randomUUID();
  const workspaceId = randomUUID();
  const priceSheetId = randomUUID();
  const timestamp = Date.now().toString();
  const slug = `ownership-foreign-${timestamp}`;

  await db.transaction(async (tx) => {
    await tx.insert(users).values({
      id: userId,
      email: `ownership-${timestamp}@unitforge.dev`,
      name: "Ownership Verification User",
    });

    await tx.insert(workspaces).values({
      id: workspaceId,
      name: "Ownership Verification Workspace",
      slug,
      ownerId: userId,
    });

    await tx.insert(memberships).values({
      workspaceId,
      userId,
      role: "owner",
    });

    await tx.insert(priceSheets).values({
      id: priceSheetId,
      workspaceId,
      title: "Foreign Ownership Sheet",
      slug: `${slug}-sheet`,
      status: "draft",
      currency: "USD",
      locale: "en-US",
      createdById: userId,
    });

    await tx.insert(priceSheetItems).values({
      priceSheetId,
      name: "Foreign Item",
      priceCents: 1000,
      position: 0,
    });
  });

  return {
    userId,
    workspaceId,
    priceSheetId,
    slug: `${slug}-sheet`,
  };
}

async function cleanupForeignWorkspaceFixture(input: Awaited<ReturnType<typeof createForeignWorkspaceFixture>>) {
  if (!process.env.DATABASE_URL) {
    return;
  }

  const db = createDb(process.env.DATABASE_URL);

  await db.delete(workspaces).where(eq(workspaces.id, input.workspaceId));
  await db.delete(users).where(eq(users.id, input.userId));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
