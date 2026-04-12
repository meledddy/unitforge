import type { PriceSheetPublicSettings } from "@unitforge/db";

export function getEmptyPriceSheetPublicSettings(): PriceSheetPublicSettings {
  return {
    contactLabel: null,
    contactEmail: null,
    contactPhone: null,
    primaryCtaLabel: null,
    secondaryCtaLabel: null,
    inquiryText: null,
  };
}

export function normalizePriceSheetPublicSettings(value: unknown): PriceSheetPublicSettings {
  const emptySettings = getEmptyPriceSheetPublicSettings();

  if (!isPlainObject(value)) {
    return emptySettings;
  }

  return {
    contactLabel: normalizeOptionalString(value.contactLabel),
    contactEmail: normalizeOptionalString(value.contactEmail),
    contactPhone: normalizeOptionalString(value.contactPhone),
    primaryCtaLabel: normalizeOptionalString(value.primaryCtaLabel),
    secondaryCtaLabel: normalizeOptionalString(value.secondaryCtaLabel),
    inquiryText: normalizeOptionalString(value.inquiryText),
  };
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
