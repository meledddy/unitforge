import type { PriceSheetContentLocale } from "@/features/price-sheets/localization";
import type { AppShellSession } from "@/server/current-session";
import { findPublishedPriceSheetRecordBySlug } from "@/server/price-sheets/repository";

import { PriceSheetLeadServiceError } from "./errors";
import {
  createPriceSheetLeadRecord,
  listPriceSheetLeadRecordsByWorkspaceAndPriceSheetId,
} from "./repository";

export { isPriceSheetLeadServiceError, PriceSheetLeadServiceError } from "./errors";

export interface PriceSheetLeadView {
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

export async function createPublishedPriceSheetLead(
  slug: string,
  input: {
    contactName: string;
    companyOrBusinessName: string | null;
    email: string;
    phoneOrHandle: string | null;
    message: string;
    locale: PriceSheetContentLocale;
  },
) {
  const priceSheet = await findPublishedPriceSheetRecordBySlug(slug);

  if (!priceSheet) {
    throw new PriceSheetLeadServiceError("NOT_PUBLIC", "This inquiry page is unavailable.");
  }

  if (!priceSheet.publicSettings.inquiryEnabled) {
    throw new PriceSheetLeadServiceError("INQUIRY_DISABLED", "This price sheet is not accepting inquiries.");
  }

  return createPriceSheetLeadRecord({
    priceSheetId: priceSheet.id,
    sheetSlugSnapshot: priceSheet.slug,
    submission: {
      priceSheetSlug: slug,
      locale: input.locale,
      contactName: input.contactName,
      companyOrBusinessName: input.companyOrBusinessName,
      email: input.email,
      phoneOrHandle: input.phoneOrHandle,
      message: input.message,
    },
  });
}

export async function listWorkspacePriceSheetLeads(session: AppShellSession, priceSheetId: string) {
  const records = await listPriceSheetLeadRecordsByWorkspaceAndPriceSheetId(session.currentWorkspace.id, priceSheetId);

  return records satisfies PriceSheetLeadView[];
}
