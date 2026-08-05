"use server";

import {
  getPriceSheetLeadCopy,
  getPriceSheetLeadFieldErrors,
  parsePriceSheetLeadFormData,
  toPriceSheetLeadSubmissionInput,
} from "@/features/price-sheets/lead-form";
import type { PriceSheetInterfaceLanguage } from "@/features/price-sheets/localization";
import {
  consumeRateLimit,
  getRateLimitClientIp,
  type RateLimitResult,
} from "@/server/rate-limit";

import {
  createPublishedPriceSheetLead,
  isPriceSheetLeadServiceError,
} from "./service";

export interface PriceSheetLeadActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  leadId?: string;
}

const LEAD_IP_RATE_LIMIT = {
  limit: 20,
  windowMs: 10 * 60 * 1000,
};
const LEAD_SHEET_IP_RATE_LIMIT = {
  limit: 8,
  windowMs: 10 * 60 * 1000,
};
const LEAD_SHEET_EMAIL_RATE_LIMIT = {
  limit: 3,
  windowMs: 30 * 60 * 1000,
};

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

  const clientIp = await getRateLimitClientIp();
  const globalIpLimit = clientIp
    ? consumeRateLimit({
        namespace: "price-sheet-lead:ip",
        identityParts: [clientIp],
        ...LEAD_IP_RATE_LIMIT,
      })
    : null;

  if (globalIpLimit && !globalIpLimit.allowed) {
    return getRateLimitedLeadState(globalIpLimit, language);
  }

  const sheetIpLimit = clientIp
    ? consumeRateLimit({
        namespace: "price-sheet-lead:sheet-ip",
        identityParts: [parsedFormData.data.priceSheetSlug, clientIp],
        ...LEAD_SHEET_IP_RATE_LIMIT,
      })
    : null;

  if (sheetIpLimit && !sheetIpLimit.allowed) {
    return getRateLimitedLeadState(sheetIpLimit, language);
  }

  const sheetEmailLimit = consumeRateLimit({
    namespace: "price-sheet-lead:sheet-email",
    identityParts: [
      parsedFormData.data.priceSheetSlug,
      parsedFormData.data.email,
    ],
    ...LEAD_SHEET_EMAIL_RATE_LIMIT,
  });

  if (!sheetEmailLimit.allowed) {
    return getRateLimitedLeadState(sheetEmailLimit, language);
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
      console.error("[price-sheet-leads] Lead submission failed.", {
        code: error.code,
      });

      return {
        status: "error",
        message:
          error.code === "NOT_PUBLIC" || error.code === "INQUIRY_DISABLED"
            ? copy.unavailableMessage
            : copy.unavailableMessage,
      } satisfies PriceSheetLeadActionState;
    }

    return {
      status: "error",
      message: copy.unavailableMessage,
    } satisfies PriceSheetLeadActionState;
  }
}

function normalizeInterfaceLanguage(
  value: FormDataEntryValue | null,
): PriceSheetInterfaceLanguage {
  return value === "ru" ? "ru" : "en";
}

function getRateLimitedLeadState(
  rateLimit: RateLimitResult,
  language: PriceSheetInterfaceLanguage,
): PriceSheetLeadActionState {
  const retryMinutes = formatRetryMinutes(
    rateLimit.retryAfterSeconds,
    language,
  );

  return {
    status: "error",
    message:
      language === "ru"
        ? `Слишком много запросов. Подождите около ${retryMinutes} и попробуйте снова.`
        : `Too many requests. Wait about ${retryMinutes} and try again.`,
  };
}

function formatRetryMinutes(
  retryAfterSeconds: number,
  language: PriceSheetInterfaceLanguage,
) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));

  if (language === "ru") {
    const lastTwoDigits = minutes % 100;
    const lastDigit = minutes % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${minutes} минут`;
    }

    if (lastDigit === 1) {
      return `${minutes} минуту`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${minutes} минуты`;
    }

    return `${minutes} минут`;
  }

  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}
