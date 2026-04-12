import { priceSheetLeads, priceSheets } from "@unitforge/db";
import { and, desc, eq } from "drizzle-orm";

import type { PriceSheetLeadSubmissionInput } from "@/features/price-sheets/lead-form";
import { normalizePriceSheetContentLocale, type PriceSheetContentLocale } from "@/features/price-sheets/localization";
import { getServerDb } from "@/server/db";

import { PriceSheetLeadServiceError } from "./errors";

export interface PriceSheetLeadRecord {
  id: string;
  priceSheetId: string;
  sheetSlugSnapshot: string;
  contactName: string;
  companyOrBusinessName: string | null;
  email: string;
  phoneOrHandle: string | null;
  message: string;
  locale: PriceSheetContentLocale;
  createdAt: Date;
}

function getDbOrThrow() {
  const db = getServerDb();

  if (!db) {
    throw new PriceSheetLeadServiceError("DATABASE_NOT_CONFIGURED", "Lead capture requires DATABASE_URL and a migrated PostgreSQL schema.");
  }

  return db;
}

export async function createPriceSheetLeadRecord(input: {
  priceSheetId: string;
  sheetSlugSnapshot: string;
  submission: PriceSheetLeadSubmissionInput;
}) {
  const db = getDbOrThrow();
  const [createdLead] = await db
    .insert(priceSheetLeads)
    .values({
      priceSheetId: input.priceSheetId,
      sheetSlugSnapshot: input.sheetSlugSnapshot,
      contactName: input.submission.contactName,
      companyOrBusinessName: input.submission.companyOrBusinessName,
      email: input.submission.email,
      phoneOrHandle: input.submission.phoneOrHandle,
      message: input.submission.message,
      locale: input.submission.locale,
    })
    .returning();

  if (!createdLead) {
    throw new PriceSheetLeadServiceError("UNAVAILABLE", "Lead could not be stored.");
  }

  return mapPriceSheetLeadRecord(createdLead);
}

export async function listPriceSheetLeadRecordsByPriceSheetId(priceSheetId: string) {
  const db = getDbOrThrow();
  const records = await db.query.priceSheetLeads.findMany({
    where: eq(priceSheetLeads.priceSheetId, priceSheetId),
    orderBy: [desc(priceSheetLeads.createdAt)],
  });

  return records.map(mapPriceSheetLeadRecord);
}

export async function listPriceSheetLeadRecordsByWorkspaceAndPriceSheetId(workspaceId: string, priceSheetId: string) {
  const db = getDbOrThrow();
  const priceSheet = await db.query.priceSheets.findFirst({
    where: and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)),
    columns: {
      id: true,
    },
  });

  if (!priceSheet) {
    throw new PriceSheetLeadServiceError("NOT_FOUND", "Price Sheet not found.");
  }

  return listPriceSheetLeadRecordsByPriceSheetId(priceSheet.id);
}

function mapPriceSheetLeadRecord(record: typeof priceSheetLeads.$inferSelect): PriceSheetLeadRecord {
  return {
    id: record.id,
    priceSheetId: record.priceSheetId,
    sheetSlugSnapshot: record.sheetSlugSnapshot,
    contactName: record.contactName,
    companyOrBusinessName: record.companyOrBusinessName,
    email: record.email,
    phoneOrHandle: record.phoneOrHandle,
    message: record.message,
    locale: normalizePriceSheetContentLocale(record.locale),
    createdAt: record.createdAt,
  };
}
