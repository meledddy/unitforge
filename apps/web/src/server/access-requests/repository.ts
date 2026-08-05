import { type AccessRequestLocale, accessRequests } from "@unitforge/db";
import { desc, eq } from "drizzle-orm";

import type { AccessRequestSource } from "@/features/access-requests/access-request-form";
import { getServerDb } from "@/server/db";

import type { AccessRequestStatus } from "./admin";
import { AccessRequestServiceError } from "./errors";

export interface CreateAccessRequestRecordInput {
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  note: string | null;
  locale: AccessRequestLocale;
  source: AccessRequestSource;
}

function getDbOrThrow() {
  const db = getServerDb();

  if (!db) {
    throw new AccessRequestServiceError(
      "DATABASE_NOT_CONFIGURED",
      "Access request storage is unavailable.",
    );
  }

  return db;
}

export async function createAccessRequestRecord(
  input: CreateAccessRequestRecordInput,
) {
  const db = getDbOrThrow();
  const [createdRequest] = await db
    .insert(accessRequests)
    .values({
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      note: input.note,
      locale: input.locale,
      source: input.source,
    })
    .returning({
      id: accessRequests.id,
      createdAt: accessRequests.createdAt,
    });

  if (!createdRequest) {
    throw new AccessRequestServiceError(
      "UNAVAILABLE",
      "Access request could not be stored.",
    );
  }

  return createdRequest;
}

export async function listAccessRequestRecords(limit = 100) {
  const db = getDbOrThrow();
  const safeLimit = Math.max(1, Math.min(limit, 100));

  return db.query.accessRequests.findMany({
    orderBy: [desc(accessRequests.createdAt)],
    limit: safeLimit,
  });
}

export async function updateAccessRequestStatusRecord(
  accessRequestId: string,
  status: AccessRequestStatus,
) {
  const db = getDbOrThrow();
  const changedAt = new Date();
  const [updatedRequest] = await db
    .update(accessRequests)
    .set({
      status,
      statusUpdatedAt: changedAt,
      updatedAt: changedAt,
    })
    .where(eq(accessRequests.id, accessRequestId))
    .returning({ id: accessRequests.id });

  if (!updatedRequest) {
    throw new AccessRequestServiceError(
      "NOT_FOUND",
      "Access request was not found.",
    );
  }

  return updatedRequest;
}
