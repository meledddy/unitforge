export const priceSheetContentLocaleValues = ["en-US", "ru-RU"] as const;
export const priceSheetInterfaceLanguageValues = ["en", "ru"] as const;
export const priceSheetThemeValues = ["amber", "slate", "stone"] as const;

export type PriceSheetContentLocale = (typeof priceSheetContentLocaleValues)[number];
export type PriceSheetInterfaceLanguage = (typeof priceSheetInterfaceLanguageValues)[number];
export type PriceSheetTheme = (typeof priceSheetThemeValues)[number];

export interface PriceSheetTranslation {
  title: string;
  description: string | null;
}

export interface PriceSheetItemTranslation {
  name: string;
  description: string | null;
  section: string | null;
}

export type PriceSheetTranslations = Partial<Record<PriceSheetContentLocale, PriceSheetTranslation>>;
export type PriceSheetItemTranslations = Partial<Record<PriceSheetContentLocale, PriceSheetItemTranslation>>;

export function getAlternatePriceSheetContentLocale(locale: PriceSheetContentLocale): PriceSheetContentLocale {
  return locale === "en-US" ? "ru-RU" : "en-US";
}

export function getPriceSheetContentLocaleLabel(locale: PriceSheetContentLocale) {
  return locale === "ru-RU" ? "Russian (ru-RU)" : "English (en-US)";
}

export function mapInterfaceLanguageToPriceSheetContentLocale(language: PriceSheetInterfaceLanguage): PriceSheetContentLocale {
  return language === "ru" ? "ru-RU" : "en-US";
}

export function resolvePriceSheetInterfaceLanguage(
  requestedLanguage: string | undefined,
  defaultContentLocale: PriceSheetContentLocale,
): PriceSheetInterfaceLanguage {
  if (requestedLanguage === "ru" || requestedLanguage === "ru-RU") {
    return "ru";
  }

  if (requestedLanguage === "en" || requestedLanguage === "en-US") {
    return "en";
  }

  return defaultContentLocale === "ru-RU" ? "ru" : "en";
}

export function normalizePriceSheetContentLocale(value: string | null | undefined): PriceSheetContentLocale {
  const normalizedValue = value?.trim().toLowerCase().replace(/_/g, "-");

  if (normalizedValue?.startsWith("ru")) {
    return "ru-RU";
  }

  return "en-US";
}

export function normalizePriceSheetTranslations(value: unknown): PriceSheetTranslations {
  return normalizeLocalizedContentMap(value, isValidPriceSheetTranslation);
}

export function normalizePriceSheetItemTranslations(value: unknown): PriceSheetItemTranslations {
  return normalizeLocalizedContentMap(value, isValidPriceSheetItemTranslation);
}

export function resolvePriceSheetContent(input: {
  defaultContentLocale: PriceSheetContentLocale;
  requestedContentLocale: PriceSheetContentLocale;
  title: string;
  description: string | null;
  translations: PriceSheetTranslations;
}) {
  const translation = input.translations[input.requestedContentLocale];

  if (input.requestedContentLocale !== input.defaultContentLocale && translation?.title) {
    return {
      title: translation.title,
      description: translation.description,
      contentLocale: input.requestedContentLocale,
    };
  }

  return {
    title: input.title,
    description: input.description,
    contentLocale: input.defaultContentLocale,
  };
}

export function resolvePriceSheetItemContent(input: {
  defaultContentLocale: PriceSheetContentLocale;
  requestedContentLocale: PriceSheetContentLocale;
  name: string;
  description: string | null;
  section: string | null;
  translations: PriceSheetItemTranslations;
}) {
  const translation = input.translations[input.requestedContentLocale];

  if (input.requestedContentLocale !== input.defaultContentLocale && translation?.name) {
    return {
      name: translation.name,
      description: translation.description,
      section: translation.section,
      contentLocale: input.requestedContentLocale,
    };
  }

  return {
    name: input.name,
    description: input.description,
    section: input.section,
    contentLocale: input.defaultContentLocale,
  };
}

function normalizeLocalizedContentMap<T>(
  value: unknown,
  isValidTranslation: (translation: unknown) => translation is T,
): Partial<Record<PriceSheetContentLocale, T>> {
  if (!isPlainObject(value)) {
    return {};
  }

  const normalizedContent: Partial<Record<PriceSheetContentLocale, T>> = {};

  for (const locale of priceSheetContentLocaleValues) {
    const translation = value[locale];

    if (isValidTranslation(translation)) {
      normalizedContent[locale] = translation;
    }
  }

  return normalizedContent;
}

function isValidPriceSheetTranslation(value: unknown): value is PriceSheetTranslation {
  if (!isPlainObject(value) || typeof value.title !== "string" || value.title.trim().length === 0) {
    return false;
  }

  return typeof value.description === "string" || value.description === null;
}

function isValidPriceSheetItemTranslation(value: unknown): value is PriceSheetItemTranslation {
  if (!isPlainObject(value) || typeof value.name !== "string" || value.name.trim().length === 0) {
    return false;
  }

  return (
    (typeof value.description === "string" || value.description === null) &&
    (typeof value.section === "string" || value.section === null)
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
