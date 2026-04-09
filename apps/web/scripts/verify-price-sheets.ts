import "dotenv/config";

import assert from "node:assert/strict";

import { getCurrentAppShellSession } from "../src/server/current-session";
import { createPriceSheetAction, type PriceSheetFormActionState } from "../src/server/price-sheets/actions";
import {
  deleteWorkspacePriceSheet,
  getPublishedPriceSheetBySlug,
  getWorkspacePriceSheetForEdit,
  listWorkspacePriceSheets,
} from "../src/server/price-sheets/service";

const initialActionState: PriceSheetFormActionState = {
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
    slug,
    status: "published",
    currency: "USD",
    locale: "en-US",
    theme: "slate",
    items: [
      {
        name: "Verification Item",
        description: "Created through createPriceSheetAction",
        section: "Verification",
        price: "125.00",
      },
    ],
  };
  const formData = new FormData();

  await cleanupVerificationArtifacts(session);
  formData.set("payload", JSON.stringify(payload));

  try {
    try {
      const result = await createPriceSheetAction(initialActionState, formData);
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

    const editable = await getWorkspacePriceSheetForEdit(session, created.id);
    assert.equal(editable.title, title);
    assert.equal(editable.description, payload.description);
    assert.equal(editable.slug, slug);
    assert.equal(editable.theme, "slate");
    assert.equal(editable.items.length, 1);

    const publicSheet = await getPublishedPriceSheetBySlug(slug);
    assert(publicSheet);
    assert.equal(publicSheet.description, payload.description);
    assert.equal(publicSheet.slug, slug);
    assert.equal(publicSheet.theme, "slate");
    assert.equal(publicSheet.items.length, 1);

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
