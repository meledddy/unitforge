import "dotenv/config";

import assert from "node:assert/strict";

import {
  resolvePriceSheetContent,
  resolvePriceSheetItemContent,
} from "../src/features/price-sheets/localization";
import { getCurrentAppShellSession } from "../src/server/current-session";
import { type PriceSheetLeadActionState,submitPriceSheetLeadAction } from "../src/server/price-sheet-leads/actions";
import { listWorkspacePriceSheetLeads } from "../src/server/price-sheet-leads/service";
import { createPriceSheetAction, type PriceSheetFormActionState } from "../src/server/price-sheets/actions";
import {
  deleteWorkspacePriceSheet,
  getPublishedPriceSheetBySlug,
  getWorkspacePriceSheetForEdit,
  listWorkspacePriceSheets,
  setWorkspacePriceSheetStatus,
} from "../src/server/price-sheets/service";

const initialPriceSheetActionState: PriceSheetFormActionState = {
  status: "idle",
};

const initialLeadActionState: PriceSheetLeadActionState = {
  status: "idle",
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const session = await getCurrentAppShellSession();
  const timestamp = Date.now().toString();
  const slug = `verification-sheet-${timestamp}`;
  const title = `Verification Sheet ${timestamp}`;
  let createdPriceSheetId: string | null = null;
  const payload = {
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
  const formData = new FormData();

  await cleanupVerificationArtifacts(session);
  formData.set("payload", JSON.stringify(payload));

  try {
    try {
      const result = await createPriceSheetAction(initialPriceSheetActionState, formData);
      assert.fail(`Expected redirect from createPriceSheetAction, received ${JSON.stringify(result)}.`);
    } catch (error) {
      assert(isExpectedActionCompletion(error), `Expected redirect or revalidation completion signal, received ${String(error)}.`);
    }

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

    await setWorkspacePriceSheetStatus(session, created.id, "draft");

    const unpublishedLeadResult = await submitPriceSheetLeadAction(initialLeadActionState, leadFormData);
    assert.equal(unpublishedLeadResult.status, "error");

    await deleteWorkspacePriceSheet(session, created.id);
    createdPriceSheetId = null;

    const listedAfterDelete = await listWorkspacePriceSheets(session);
    assert(!listedAfterDelete.some((priceSheet) => priceSheet.id === created.id));

    console.log("Price Sheets verification passed.");
    console.log(`Verified workspace: ${session.currentWorkspace.slug}`);
    console.log(`Verified create action slug: ${slug}`);
  } finally {
    if (createdPriceSheetId) {
      await deleteWorkspacePriceSheet(session, createdPriceSheetId);
    }
  }
}

async function cleanupVerificationArtifacts(session: Awaited<ReturnType<typeof getCurrentAppShellSession>>) {
  const listedPriceSheets = await listWorkspacePriceSheets(session);

  for (const priceSheet of listedPriceSheets) {
    if (priceSheet.slug.startsWith("verification-sheet-") || priceSheet.slug.startsWith("e2e-")) {
      await deleteWorkspacePriceSheet(session, priceSheet.id);
    }
  }
}

function isExpectedActionCompletion(error: unknown) {
  return isRedirectError(error) || isRevalidateInvariant(error);
}

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT;")
  );
}

function isRevalidateInvariant(error: unknown) {
  return error instanceof Error && error.message.includes("static generation store missing in revalidatePath");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
