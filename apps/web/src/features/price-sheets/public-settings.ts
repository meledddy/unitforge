import type { PriceSheetPresentationAppearance, PriceSheetPublicSettings } from "@unitforge/db";

export const defaultPriceSheetPresentationAppearance = "dark" satisfies PriceSheetPresentationAppearance;

export function getEmptyPriceSheetPublicSettings(): PriceSheetPublicSettings {
  return {
    presentationAppearance: defaultPriceSheetPresentationAppearance,
    contactLabel: null,
    contactEmail: null,
    contactPhone: null,
    primaryCtaLabel: null,
    secondaryCtaLabel: null,
    inquiryText: null,
    businessLocation: null,
    businessHours: null,
    businessResponseTime: null,
    businessNote: null,
    inquiryEnabled: true,
  };
}

export function normalizePriceSheetPublicSettings(value: unknown): PriceSheetPublicSettings {
  const emptySettings = getEmptyPriceSheetPublicSettings();

  if (!isPlainObject(value)) {
    return emptySettings;
  }

  return {
    presentationAppearance: normalizePriceSheetPresentationAppearance(value.presentationAppearance),
    contactLabel: normalizeOptionalString(value.contactLabel),
    contactEmail: normalizeOptionalString(value.contactEmail),
    contactPhone: normalizeOptionalString(value.contactPhone),
    primaryCtaLabel: normalizeOptionalString(value.primaryCtaLabel),
    secondaryCtaLabel: normalizeOptionalString(value.secondaryCtaLabel),
    inquiryText: normalizeOptionalString(value.inquiryText),
    businessLocation: normalizeOptionalString(value.businessLocation),
    businessHours: normalizeOptionalString(value.businessHours),
    businessResponseTime: normalizeOptionalString(value.businessResponseTime),
    businessNote: normalizeOptionalString(value.businessNote),
    inquiryEnabled: normalizeBoolean(value.inquiryEnabled, emptySettings.inquiryEnabled),
  };
}

export function normalizePriceSheetPresentationAppearance(value: unknown): PriceSheetPresentationAppearance {
  return value === "light" ? "light" : defaultPriceSheetPresentationAppearance;
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function normalizeBoolean(value: unknown, fallbackValue: boolean) {
  return typeof value === "boolean" ? value : fallbackValue;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
