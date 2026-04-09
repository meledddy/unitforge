import { z } from "zod";

export const priceSheetStatusValues = ["draft", "published"] as const;
export const priceSheetThemeValues = ["amber", "slate", "stone"] as const;

export const priceSheetStatusSchema = z.enum(priceSheetStatusValues);
export const priceSheetThemeSchema = z.enum(priceSheetThemeValues);

const pricePattern = /^\d+(?:\.\d{1,2})?$/;

export const priceSheetItemFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Item name is required.").max(160, "Item name is too long."),
  description: z.string().trim().max(600, "Description is too long."),
  section: z.string().trim().max(120, "Category / section is too long."),
  price: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => pricePattern.test(value), "Price must be a valid amount."),
});

export const priceSheetFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title is too long."),
  description: z.string().trim().max(600, "Description is too long."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(160, "Slug is too long.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens."),
  status: priceSheetStatusSchema,
  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter ISO code.")
    .transform((value) => value.toUpperCase()),
  locale: z.string().trim().min(2, "Locale is required.").max(32, "Locale is too long."),
  theme: priceSheetThemeSchema,
  items: z.array(priceSheetItemFormSchema).min(1, "Add at least one item."),
});

export type PriceSheetStatus = z.infer<typeof priceSheetStatusSchema>;
export type PriceSheetTheme = z.infer<typeof priceSheetThemeSchema>;
export type PriceSheetFormValues = z.input<typeof priceSheetFormSchema>;

export interface PriceSheetMutationInput {
  title: string;
  description: string | null;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  locale: string;
  theme: PriceSheetTheme;
  items: Array<{
    id?: string;
    name: string;
    description: string | null;
    section: string | null;
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
    price: "",
  };
}

export function getEmptyPriceSheetFormValues(): PriceSheetFormValues {
  return {
    title: "",
    description: "",
    slug: "",
    status: "draft",
    currency: "USD",
    locale: "en-US",
    theme: "amber",
    items: [getEmptyPriceSheetItemValues()],
  };
}

export function parsePriceSheetFormPayload(payload: string) {
  try {
    return priceSheetFormSchema.safeParse(JSON.parse(payload));
  } catch {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          message: "Form payload could not be read.",
          path: [],
        },
      ]),
    };
  }
}

export function toPriceSheetMutationInput(values: PriceSheetFormValues): PriceSheetMutationInput {
  const parsed = priceSheetFormSchema.parse(values);

  return {
    ...parsed,
    description: parsed.description || null,
    items: parsed.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || null,
      section: item.section || null,
      priceCents: decimalToCents(item.price),
    })),
  };
}

export function toPriceSheetFormValues(input: {
  title: string;
  description: string | null;
  slug: string;
  status: PriceSheetStatus;
  currency: string;
  locale: string;
  theme: PriceSheetTheme;
  items: Array<{
    id?: string;
    name: string;
    description: string | null;
    section: string | null;
    priceCents: number;
  }>;
}): PriceSheetFormValues {
  return {
    title: input.title,
    description: input.description ?? "",
    slug: input.slug,
    status: input.status,
    currency: input.currency,
    locale: input.locale,
    theme: input.theme,
    items:
      input.items.length > 0
        ? input.items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description ?? "",
            section: item.section ?? "",
            price: formatPriceFromCents(item.priceCents),
          }))
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

function decimalToCents(value: string) {
  return Math.round(Number(value) * 100);
}
