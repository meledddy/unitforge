import type { PriceSheetPublicSettings } from "@unitforge/db";
import { z } from "zod";

import type { InterfaceLocale } from "@/i18n/interface-locale";
import { getMessages } from "@/i18n/messages";

import type { PriceSheetContentLocale, PriceSheetItemTranslations, PriceSheetTheme, PriceSheetTranslations } from "./localization";
import {
  getAlternatePriceSheetContentLocale,
  priceSheetContentLocaleValues,
  priceSheetThemeValues,
} from "./localization";
import { getEmptyPriceSheetPublicSettings } from "./public-settings";

export const priceSheetStatusValues = ["draft", "published"] as const;

export const priceSheetStatusSchema = z.enum(priceSheetStatusValues);
export const priceSheetThemeSchema = z.enum(priceSheetThemeValues);
export const priceSheetContentLocaleSchema = z.enum(priceSheetContentLocaleValues);
export const priceSheetPublicInquiryStateSchema = z.enum(["enabled", "hidden"]);

const pricePattern = /^\d+(?:\.\d{1,2})?$/;

export function getPriceSheetItemFormSchema(locale: InterfaceLocale) {
  const copy = getMessages(locale).priceSheetValidation;

  return z
    .object({
      id: z.string().uuid().optional(),
      name: z.string().trim().min(1, copy.itemNameRequired).max(160, copy.itemNameLong),
      description: z.string().trim().max(600, copy.descriptionLong),
      section: z.string().trim().max(120, copy.sectionLong),
      secondaryName: z.string().trim().max(160, copy.translatedItemNameLong),
      secondaryDescription: z.string().trim().max(600, copy.translatedDescriptionLong),
      secondarySection: z.string().trim().max(120, copy.translatedSectionLong),
      price: z.string().trim().min(1, copy.priceRequired).refine((value) => pricePattern.test(value), copy.priceInvalid),
    })
    .superRefine((value, ctx) => {
      if ((value.secondaryDescription.length > 0 || value.secondarySection.length > 0) && value.secondaryName.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: copy.translatedItemNameRequired,
          path: ["secondaryName"],
        });
      }
    });
}

export function getPriceSheetFormSchema(locale: InterfaceLocale) {
  const copy = getMessages(locale).priceSheetValidation;

  return z
    .object({
      title: z.string().trim().min(1, copy.titleRequired).max(120, copy.titleLong),
      description: z.string().trim().max(600, copy.descriptionLong),
      secondaryTitle: z.string().trim().max(120, copy.translatedTitleLong),
      secondaryDescription: z.string().trim().max(600, copy.translatedDescriptionLong),
      contactLabel: z.string().trim().max(120, copy.contactLabelLong),
      contactEmail: z
        .string()
        .trim()
        .max(160, copy.contactEmailLong)
        .refine((value) => value.length === 0 || z.string().email().safeParse(value).success, copy.contactEmailInvalid),
      contactPhone: z.string().trim().max(120, copy.contactPhoneLong),
      primaryCtaLabel: z.string().trim().max(48, copy.primaryCtaLong),
      secondaryCtaLabel: z.string().trim().max(48, copy.secondaryCtaLong),
      inquiryText: z.string().trim().max(320, copy.inquiryTextLong),
      publicInquiryState: priceSheetPublicInquiryStateSchema,
      slug: z.string().trim().min(1, copy.slugRequired).max(160, copy.slugLong).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, copy.slugFormat),
      status: priceSheetStatusSchema,
      currency: z.string().trim().length(3, copy.currencyCode).transform((value) => value.toUpperCase()),
      defaultContentLocale: priceSheetContentLocaleSchema,
      theme: priceSheetThemeSchema,
      items: z.array(getPriceSheetItemFormSchema(locale)).min(1, copy.addOneItem),
    })
    .superRefine((value, ctx) => {
      if (value.secondaryDescription.length > 0 && value.secondaryTitle.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: copy.translatedTitleRequired,
          path: ["secondaryTitle"],
        });
      }
    });
}

export type PriceSheetStatus = z.infer<typeof priceSheetStatusSchema>;
export type PriceSheetFormValues = z.input<ReturnType<typeof getPriceSheetFormSchema>>;

export interface PriceSheetMutationInput {
  title: string;
  description: string | null;
  translations: PriceSheetTranslations;
  publicSettings: PriceSheetPublicSettings;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  defaultContentLocale: PriceSheetContentLocale;
  theme: PriceSheetTheme;
  items: Array<{
    id?: string;
    name: string;
    description: string | null;
    section: string | null;
    translations: PriceSheetItemTranslations;
    priceCents: number;
  }>;
}

export function slugifyPriceSheetValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getEmptyPriceSheetItemValues(): PriceSheetFormValues["items"][number] {
  return {
    name: "",
    description: "",
    section: "",
    secondaryName: "",
    secondaryDescription: "",
    secondarySection: "",
    price: "",
  };
}

export function getEmptyPriceSheetFormValues(): PriceSheetFormValues {
  return {
    title: "",
    description: "",
    secondaryTitle: "",
    secondaryDescription: "",
    contactLabel: "",
    contactEmail: "",
    contactPhone: "",
    primaryCtaLabel: "",
    secondaryCtaLabel: "",
    inquiryText: "",
    publicInquiryState: "enabled",
    slug: "",
    status: "draft",
    currency: "USD",
    defaultContentLocale: "en-US",
    theme: "amber",
    items: [getEmptyPriceSheetItemValues()],
  };
}

export function parsePriceSheetFormPayload(payload: string, locale: InterfaceLocale = "en") {
  try {
    return getPriceSheetFormSchema(locale).safeParse(JSON.parse(payload));
  } catch {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          message: getMessages(locale).priceSheetValidation.payloadUnreadable,
          path: [],
        },
      ]),
    };
  }
}

export function toPriceSheetMutationInput(values: PriceSheetFormValues): PriceSheetMutationInput {
  const parsed = getPriceSheetFormSchema("en").parse(values);
  const secondaryLocale = getAlternatePriceSheetContentLocale(parsed.defaultContentLocale);

  return {
    title: parsed.title,
    description: parsed.description || null,
    translations: getSheetTranslations(parsed, secondaryLocale),
    publicSettings: getPublicSettings(parsed),
    slug: parsed.slug,
    status: parsed.status,
    currency: parsed.currency,
    defaultContentLocale: parsed.defaultContentLocale,
    theme: parsed.theme,
    items: parsed.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || null,
      section: item.section || null,
      translations: getItemTranslations(item, secondaryLocale),
      priceCents: decimalToCents(item.price),
    })),
  };
}

export function toPriceSheetFormValues(input: {
  title: string;
  description: string | null;
  translations: PriceSheetTranslations;
  publicSettings: PriceSheetPublicSettings;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  defaultContentLocale: PriceSheetContentLocale;
  theme: PriceSheetTheme;
  items: Array<{
    id?: string;
    name: string;
    description: string | null;
    section: string | null;
    translations: PriceSheetItemTranslations;
    priceCents: number;
  }>;
}): PriceSheetFormValues {
  const secondaryLocale = getAlternatePriceSheetContentLocale(input.defaultContentLocale);
  const secondarySheetTranslation = input.translations[secondaryLocale];

  return {
    title: input.title,
    description: input.description ?? "",
    secondaryTitle: secondarySheetTranslation?.title ?? "",
    secondaryDescription: secondarySheetTranslation?.description ?? "",
    contactLabel: input.publicSettings.contactLabel ?? "",
    contactEmail: input.publicSettings.contactEmail ?? "",
    contactPhone: input.publicSettings.contactPhone ?? "",
    primaryCtaLabel: input.publicSettings.primaryCtaLabel ?? "",
    secondaryCtaLabel: input.publicSettings.secondaryCtaLabel ?? "",
    inquiryText: input.publicSettings.inquiryText ?? "",
    publicInquiryState: input.publicSettings.inquiryEnabled ? "enabled" : "hidden",
    slug: input.slug,
    status: input.status,
    currency: input.currency,
    defaultContentLocale: input.defaultContentLocale,
    theme: input.theme,
    items:
      input.items.length > 0
        ? input.items.map((item) => {
            const secondaryItemTranslation = item.translations[secondaryLocale];

            return {
              id: item.id,
              name: item.name,
              description: item.description ?? "",
              section: item.section ?? "",
              secondaryName: secondaryItemTranslation?.name ?? "",
              secondaryDescription: secondaryItemTranslation?.description ?? "",
              secondarySection: secondaryItemTranslation?.section ?? "",
              price: formatPriceFromCents(item.priceCents),
            };
          })
        : [getEmptyPriceSheetItemValues()],
  };
}

export function getPriceSheetFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");

    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function formatPriceFromCents(priceCents: number) {
  return (priceCents / 100).toFixed(2);
}

export function formatPriceSheetAmount(priceCents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

function getSheetTranslations(
  values: Pick<PriceSheetFormValues, "secondaryTitle" | "secondaryDescription">,
  secondaryLocale: PriceSheetContentLocale,
): PriceSheetTranslations {
  if (values.secondaryTitle.trim().length === 0) {
    return {};
  }

  return {
    [secondaryLocale]: {
      title: values.secondaryTitle,
      description: values.secondaryDescription || null,
    },
  };
}

function getPublicSettings(
  values: Pick<
    PriceSheetFormValues,
    "contactLabel" | "contactEmail" | "contactPhone" | "primaryCtaLabel" | "secondaryCtaLabel" | "inquiryText" | "publicInquiryState"
  >,
): PriceSheetPublicSettings {
  const emptySettings = getEmptyPriceSheetPublicSettings();

  return {
    ...emptySettings,
    contactLabel: toOptionalString(values.contactLabel),
    contactEmail: toOptionalString(values.contactEmail),
    contactPhone: toOptionalString(values.contactPhone),
    primaryCtaLabel: toOptionalString(values.primaryCtaLabel),
    secondaryCtaLabel: toOptionalString(values.secondaryCtaLabel),
    inquiryText: toOptionalString(values.inquiryText),
    inquiryEnabled: values.publicInquiryState === "enabled",
  };
}

function getItemTranslations(
  values: Pick<PriceSheetFormValues["items"][number], "secondaryName" | "secondaryDescription" | "secondarySection">,
  secondaryLocale: PriceSheetContentLocale,
): PriceSheetItemTranslations {
  if (values.secondaryName.trim().length === 0) {
    return {};
  }

  return {
    [secondaryLocale]: {
      name: values.secondaryName,
      description: values.secondaryDescription || null,
      section: values.secondarySection || null,
    },
  };
}

function decimalToCents(value: string) {
  return Math.round(Number(value) * 100);
}

function toOptionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}
