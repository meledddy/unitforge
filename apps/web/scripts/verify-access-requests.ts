import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getAccessRequestFieldErrors,
  isAccessRequestHoneypotFilled,
  parseAccessRequestFormData,
  toAccessRequestSubmissionInput,
} from "../src/features/access-requests/access-request-form";
import { parseUnitforgeAdminEmails } from "../src/server/access-requests/admin";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

async function main() {
  const validFormData = new FormData();
  validFormData.set("locale", "en");
  validFormData.set("businessName", "  Ararat Studio  ");
  validFormData.set("contactName", "  Ani Martirosyan  ");
  validFormData.set("email", "  ANI@EXAMPLE.COM  ");
  validFormData.set("phone", "");
  validFormData.set("note", "  Current prices are in a spreadsheet.  ");

  const validResult = parseAccessRequestFormData(validFormData, "en");
  assert(validResult.success, "Expected a valid access request to parse.");

  const normalized = toAccessRequestSubmissionInput(validResult.data);
  assert.equal(normalized.businessName, "Ararat Studio");
  assert.equal(normalized.contactName, "Ani Martirosyan");
  assert.equal(normalized.email, "ani@example.com");
  assert.equal(normalized.phone, null);
  assert.equal(normalized.locale, "en");

  const invalidFormData = new FormData();
  invalidFormData.set("locale", "ru");
  invalidFormData.set("businessName", "");
  invalidFormData.set("contactName", "");
  invalidFormData.set("email", "not-an-email");
  invalidFormData.set("phone", "");
  invalidFormData.set("note", "");

  const invalidResult = parseAccessRequestFormData(invalidFormData, "ru");
  assert(!invalidResult.success, "Expected an incomplete request to fail.");

  const fieldErrors = getAccessRequestFieldErrors(invalidResult.error);
  assert(fieldErrors.businessName);
  assert(fieldErrors.contactName);
  assert(fieldErrors.email);

  validFormData.set("website", "https://spam.invalid");
  assert.equal(isAccessRequestHoneypotFilled(validFormData), true);

  const adminEmails = parseUnitforgeAdminEmails(
    " Admin@Example.com,operator@example.com, admin@example.com ",
  );
  assert.equal(adminEmails.size, 2);
  assert(adminEmails.has("admin@example.com"));
  assert(adminEmails.has("operator@example.com"));

  const migration = await readFile(
    path.join(repoRoot, "packages/db/drizzle/0007_rare_reavers.sql"),
    "utf8",
  );
  assert.match(migration, /CREATE TABLE "access_requests"/);
  assert.match(migration, /"status" "access_request_status"/);
  assert.match(migration, /"source" varchar\(64\)/);
  assert.match(migration, /access_requests_locale_check/);

  const actionSource = await readFile(
    path.join(repoRoot, "apps/web/src/server/access-requests/actions.ts"),
    "utf8",
  );
  assert.match(actionSource, /access-request:ip/);
  assert.match(actionSource, /access-request:email/);
  assert.match(actionSource, /requireAuthenticatedAppShellSession/);
  assert.match(actionSource, /normalizeSource/);
  assert.match(actionSource, /isUnitforgeAdminEmail/);
  assert.doesNotMatch(actionSource, /console\./);

  const inboxPageSource = await readFile(
    path.join(repoRoot, "apps/web/app/(app)/app/access-requests/page.tsx"),
    "utf8",
  );
  assert.match(inboxPageSource, /isUnitforgeAdminEmail/);
  assert.match(inboxPageSource, /notFound\(\)/);
  assert.match(inboxPageSource, /updateAccessRequestStatusAction/);

  const dashboardPageSource = await readFile(
    path.join(repoRoot, "apps/web/app/(app)/app/page.tsx"),
    "utf8",
  );
  assert.match(dashboardPageSource, /isUnitforgeAdminEmail/);
  assert.match(dashboardPageSource, /accessRequestsHref/);

  const pageSource = await readFile(
    path.join(repoRoot, "apps/web/app/(marketing)/request-access/page.tsx"),
    "utf8",
  );
  assert.match(pageSource, /AccessRequestFormCard/);
  assert.doesNotMatch(pageSource, /appConfig\.supportEmail/);

  const contactPageSource = await readFile(
    path.join(repoRoot, "apps/web/app/(marketing)/contact/page.tsx"),
    "utf8",
  );
  assert.match(contactPageSource, /source="contact"/);
  assert.match(contactPageSource, /AccessRequestFormCard/);

  console.log("Access request verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
