import "server-only";

import type { PriceSheetFormValues, PriceSheetMutationInput, PriceSheetStatus } from "@/features/price-sheets/validation";
import { formatPriceSheetAmount, toPriceSheetFormValues } from "@/features/price-sheets/validation";
import type { AppShellSession } from "@/server/current-session";

import { isPriceSheetServiceError,PriceSheetServiceError } from "./errors";
import {
  createPriceSheetRecord,
  deletePriceSheetRecord,
  findPriceSheetRecordById,
  findPriceSheetRecordBySlug,
  findPublishedPriceSheetRecordBySlug,
  listPriceSheetRecordsByWorkspace,
  type PriceSheetRecord,
  setPriceSheetRecordStatus,
  updatePriceSheetRecord,
} from "./repository";

export interface PriceSheetListItem {
  id: string;
  title: string;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  locale: string;
  itemCount: number;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface PriceSheetItemView {
  id: string;
  name: string;
  description: string | null;
  section: string | null;
  priceCents: number;
  formattedPrice: string;
}

export interface PriceSheetDetail extends PriceSheetListItem {
  items: PriceSheetItemView[];
  createdAt: Date;
  publicUrl: string;
  formValues: PriceSheetFormValues;
}

export interface PublishedPriceSheet {
  id: string;
  title: string;
  slug: string;
  currency: string;
  locale: string;
  updatedAt: Date;
  items: PriceSheetItemView[];
}

export async function listWorkspacePriceSheets(session: AppShellSession) {
  const records = await listPriceSheetRecordsByWorkspace(session.currentWorkspace.id);

  return records.map((record) => ({
    id: record.id,
    title: record.title,
    slug: record.slug,
    status: record.status,
    currency: record.currency,
    locale: record.locale,
    itemCount: record.items.length,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
  })) satisfies PriceSheetListItem[];
}

export async function getWorkspacePriceSheetForEdit(session: AppShellSession, priceSheetId: string) {
  const record = await findPriceSheetRecordById(session.currentWorkspace.id, priceSheetId);

  if (!record) {
    throw new PriceSheetServiceError("NOT_FOUND", "Price Sheet not found.");
  }

  return mapPriceSheetDetail(record);
}

export async function createWorkspacePriceSheet(session: AppShellSession, input: PriceSheetMutationInput) {
  await assertSlugAvailable(input.slug);

  const record = await createPriceSheetRecord(session.currentWorkspace.id, session.currentUser.id, input);

  return mapPriceSheetDetail(record);
}

export async function updateWorkspacePriceSheet(
  session: AppShellSession,
  priceSheetId: string,
  input: PriceSheetMutationInput,
) {
  await assertSlugAvailable(input.slug, priceSheetId);

  const record = await updatePriceSheetRecord(session.currentWorkspace.id, priceSheetId, input);

  return mapPriceSheetDetail(record);
}

export async function setWorkspacePriceSheetStatus(
  session: AppShellSession,
  priceSheetId: string,
  status: PriceSheetStatus,
) {
  const record = await setPriceSheetRecordStatus(session.currentWorkspace.id, priceSheetId, status);

  return mapPriceSheetDetail(record);
}

export async function deleteWorkspacePriceSheet(session: AppShellSession, priceSheetId: string) {
  return deletePriceSheetRecord(session.currentWorkspace.id, priceSheetId);
}

export async function getPublishedPriceSheetBySlug(slug: string) {
  const record = await findPublishedPriceSheetRecordBySlug(slug);

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    currency: record.currency,
    locale: record.locale,
    updatedAt: record.updatedAt,
    items: mapPriceSheetItems(record),
  } satisfies PublishedPriceSheet;
}

export function getPriceSheetErrorMessage(error: unknown) {
  if (isPriceSheetServiceError(error)) {
    return error.message;
  }

  return "Price Sheets are unavailable until the database schema is applied.";
}

export function isKnownPriceSheetError(error: unknown): error is PriceSheetServiceError {
  return isPriceSheetServiceError(error);
}

async function assertSlugAvailable(slug: string, currentPriceSheetId?: string) {
  const existingRecord = await findPriceSheetRecordBySlug(slug);

  if (existingRecord && existingRecord.id !== currentPriceSheetId) {
    throw new PriceSheetServiceError("SLUG_CONFLICT", "Slug is already in use.");
  }
}

function mapPriceSheetDetail(record: PriceSheetRecord) {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    status: record.status,
    currency: record.currency,
    locale: record.locale,
    itemCount: record.items.length,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    createdAt: record.createdAt,
    publicUrl: `/price-sheets/${record.slug}`,
    items: mapPriceSheetItems(record),
    formValues: toPriceSheetFormValues({
      title: record.title,
      slug: record.slug,
      status: record.status,
      currency: record.currency,
      locale: record.locale,
      items: record.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        section: item.section,
        priceCents: item.priceCents,
      })),
    }),
  } satisfies PriceSheetDetail;
}

function mapPriceSheetItems(record: Pick<PriceSheetRecord, "currency" | "locale" | "items">) {
  return record.items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    section: item.section,
    priceCents: item.priceCents,
    formattedPrice: formatPriceSheetAmount(item.priceCents, record.currency, record.locale),
  })) satisfies PriceSheetItemView[];
}
