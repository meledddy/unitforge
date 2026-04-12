"use server";

import {
  getPriceSheetLeadCopy,
  getPriceSheetLeadFieldErrors,
  parsePriceSheetLeadFormData,
  toPriceSheetLeadSubmissionInput,
} from "@/features/price-sheets/lead-form";
import type { PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";

import { createPublishedPriceSheetLead, isPriceSheetLeadServiceError } from "./service";

export interface PriceSheetLeadActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  leadId?: string;
}

export async function submitPriceSheetLeadAction(
  _previousState: PriceSheetLeadActionState,
  formData: FormData,
) {
  const language = normalizeInterfaceLanguage(formData.get("language"));
  const copy = getPriceSheetLeadCopy(language);
  const parsedFormData = parsePriceSheetLeadFormData(formData, language);

  if (!parsedFormData.success) {
    return {
      status: "error",
      message: copy.errorMessage,
      fieldErrors: getPriceSheetLeadFieldErrors(parsedFormData.error),
    } satisfies PriceSheetLeadActionState;
  }

  try {
    const lead = await createPublishedPriceSheetLead(
      parsedFormData.data.priceSheetSlug,
      toPriceSheetLeadSubmissionInput(parsedFormData.data),
    );

    return {
      status: "success",
      message: copy.successDescription,
      leadId: lead.id,
    } satisfies PriceSheetLeadActionState;
  } catch (error) {
    if (isPriceSheetLeadServiceError(error)) {
      return {
        status: "error",
        message:
          error.code === "NOT_PUBLIC" || error.code === "INQUIRY_DISABLED"
            ? copy.unavailableMessage
            : error.message,
      } satisfies PriceSheetLeadActionState;
    }

    return {
      status: "error",
      message: copy.unavailableMessage,
    } satisfies PriceSheetLeadActionState;
  }
}

function normalizeInterfaceLanguage(value: FormDataEntryValue | null): PriceSheetInterfaceLanguage {
  return value === "ru" ? "ru" : "en";
}
