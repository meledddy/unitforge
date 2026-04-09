import { priceSheetItems, priceSheets } from "@unitforge/db";
import { and, asc, desc, eq } from "drizzle-orm";

import type { PriceSheetMutationInput, PriceSheetStatus, PriceSheetTheme } from "@/features/price-sheets/validation";
import { getServerDb } from "@/server/db";

import { PriceSheetServiceError } from "./errors";

export interface PriceSheetRecord {
  id: string;
  workspaceId: string;
  title: string;
  description: string | null;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  locale: string;
  theme: PriceSheetTheme;
  publishedAt: Date | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    priceSheetId: string;
    name: string;
    description: string | null;
    section: string | null;
    priceCents: number;
    position: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

function getDbOrThrow() {
  const db = getServerDb();

  if (!db) {
    throw new PriceSheetServiceError(
      "DATABASE_NOT_CONFIGURED",
      "Price Sheets require DATABASE_URL and a migrated PostgreSQL schema.",
    );
  }

  return db;
}

export async function listPriceSheetRecordsByWorkspace(workspaceId: string) {
  const db = getDbOrThrow();
  const records = await db.query.priceSheets.findMany({
    where: eq(priceSheets.workspaceId, workspaceId),
    with: {
      items: {
        orderBy: [asc(priceSheetItems.position)],
      },
    },
    orderBy: [desc(priceSheets.updatedAt)],
  });

  return records as PriceSheetRecord[];
}

export async function findPriceSheetRecordById(workspaceId: string, priceSheetId: string) {
  const db = getDbOrThrow();
  const record = await db.query.priceSheets.findFirst({
    where: and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)),
    with: {
      items: {
        orderBy: [asc(priceSheetItems.position)],
      },
    },
  });

  return (record as PriceSheetRecord | undefined) ?? null;
}

export async function findPriceSheetRecordBySlug(slug: string) {
  const db = getDbOrThrow();
  const record = await db.query.priceSheets.findFirst({
    where: eq(priceSheets.slug, slug),
    with: {
      items: {
        orderBy: [asc(priceSheetItems.position)],
      },
    },
  });

  return (record as PriceSheetRecord | undefined) ?? null;
}

export async function findPublishedPriceSheetRecordBySlug(slug: string) {
  const db = getDbOrThrow();
  const record = await db.query.priceSheets.findFirst({
    where: and(eq(priceSheets.slug, slug), eq(priceSheets.status, "published")),
    with: {
      items: {
        orderBy: [asc(priceSheetItems.position)],
      },
    },
  });

  return (record as PriceSheetRecord | undefined) ?? null;
}

export async function createPriceSheetRecord(workspaceId: string, createdById: string, input: PriceSheetMutationInput) {
  const db = getDbOrThrow();

  return db.transaction(async (tx) => {
    const [createdRecord] = await tx
      .insert(priceSheets)
      .values({
        workspaceId,
        title: input.title,
        description: input.description,
        slug: input.slug,
        status: input.status,
        currency: input.currency,
        locale: input.locale,
        theme: input.theme,
        publishedAt: input.status === "published" ? new Date() : null,
        createdById,
      })
      .returning({ id: priceSheets.id });

    if (!createdRecord) {
      throw new PriceSheetServiceError("UNAVAILABLE", "Price Sheet could not be created.");
    }

    await tx.insert(priceSheetItems).values(
      input.items.map((item, index) => ({
        priceSheetId: createdRecord.id,
        name: item.name,
        description: item.description,
        section: item.section,
        priceCents: item.priceCents,
        position: index,
      })),
    );

    const createdSheet = await tx.query.priceSheets.findFirst({
      where: eq(priceSheets.id, createdRecord.id),
      with: {
        items: {
          orderBy: [asc(priceSheetItems.position)],
        },
      },
    });

    if (!createdSheet) {
      throw new PriceSheetServiceError("UNAVAILABLE", "Created Price Sheet could not be loaded.");
    }

    return createdSheet as PriceSheetRecord;
  });
}

export async function updatePriceSheetRecord(workspaceId: string, priceSheetId: string, input: PriceSheetMutationInput) {
  const db = getDbOrThrow();

  return db.transaction(async (tx) => {
    const existingRecord = await tx.query.priceSheets.findFirst({
      where: and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)),
    });

    if (!existingRecord) {
      throw new PriceSheetServiceError("NOT_FOUND", "Price Sheet not found.");
    }

    await tx
      .update(priceSheets)
      .set({
        title: input.title,
        description: input.description,
        slug: input.slug,
        status: input.status,
        currency: input.currency,
        locale: input.locale,
        theme: input.theme,
        publishedAt: input.status === "published" ? existingRecord.publishedAt ?? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)));

    await tx.delete(priceSheetItems).where(eq(priceSheetItems.priceSheetId, priceSheetId));

    await tx.insert(priceSheetItems).values(
      input.items.map((item, index) => ({
        priceSheetId,
        name: item.name,
        description: item.description,
        section: item.section,
        priceCents: item.priceCents,
        position: index,
      })),
    );

    const updatedRecord = await tx.query.priceSheets.findFirst({
      where: eq(priceSheets.id, priceSheetId),
      with: {
        items: {
          orderBy: [asc(priceSheetItems.position)],
        },
      },
    });

    if (!updatedRecord) {
      throw new PriceSheetServiceError("UNAVAILABLE", "Updated Price Sheet could not be loaded.");
    }

    return updatedRecord as PriceSheetRecord;
  });
}

export async function setPriceSheetRecordStatus(workspaceId: string, priceSheetId: string, status: PriceSheetStatus) {
  const db = getDbOrThrow();

  return db.transaction(async (tx) => {
    const existingRecord = await tx.query.priceSheets.findFirst({
      where: and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)),
      with: {
        items: {
          orderBy: [asc(priceSheetItems.position)],
        },
      },
    });

    if (!existingRecord) {
      throw new PriceSheetServiceError("NOT_FOUND", "Price Sheet not found.");
    }

    await tx
      .update(priceSheets)
      .set({
        status,
        publishedAt: status === "published" ? existingRecord.publishedAt ?? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)));

    const updatedRecord = await tx.query.priceSheets.findFirst({
      where: eq(priceSheets.id, priceSheetId),
      with: {
        items: {
          orderBy: [asc(priceSheetItems.position)],
        },
      },
    });

    if (!updatedRecord) {
      throw new PriceSheetServiceError("UNAVAILABLE", "Updated Price Sheet could not be loaded.");
    }

    return updatedRecord as PriceSheetRecord;
  });
}

export async function deletePriceSheetRecord(workspaceId: string, priceSheetId: string) {
  const db = getDbOrThrow();
  const [deletedRecord] = await db
    .delete(priceSheets)
    .where(and(eq(priceSheets.workspaceId, workspaceId), eq(priceSheets.id, priceSheetId)))
    .returning({
      id: priceSheets.id,
      slug: priceSheets.slug,
    });

  if (!deletedRecord) {
    throw new PriceSheetServiceError("NOT_FOUND", "Price Sheet not found.");
  }

  return deletedRecord;
}
