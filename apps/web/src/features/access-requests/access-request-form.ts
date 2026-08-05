import { z } from "zod";

import type { InterfaceLocale } from "@/i18n/interface-locale";

export interface AccessRequestActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export type AccessRequestSource = "request-access" | "contact";

export const initialAccessRequestActionState: AccessRequestActionState = {
  status: "idle",
};

const accessRequestCopy = {
  en: {
    eyebrow: "Request access",
    title: "Tell us about your business.",
    description: "Share the essentials for an assisted first launch.",
    businessNameLabel: "Business name",
    businessNamePlaceholder: "Your business",
    contactNameLabel: "Contact name",
    contactNamePlaceholder: "Your name",
    emailLabel: "Work email",
    emailPlaceholder: "you@business.com",
    phoneLabel: "Phone",
    phoneOptional: "optional",
    phonePlaceholder: "+374 …",
    noteLabel: "What do you sell?",
    noteOptional: "optional",
    notePlaceholder: "A short note about your services or current price list",
    submitLabel: "Request access",
    submittingLabel: "Sending…",
    privacyPrefix: "By sending this request, you agree to our",
    privacyLinkLabel: "privacy notice",
    successTitle: "Request received",
    successDescription: "Your request is now in the Unitforge launch inbox.",
    validationMessage: "Check the highlighted fields.",
    unavailableMessage:
      "We could not save your request. Please try again shortly.",
    rateLimitMessage: (minutes: number) =>
      `Too many requests. Try again in about ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
    validation: {
      businessNameRequired: "Enter your business name.",
      businessNameLong: "Business name is too long.",
      contactNameRequired: "Enter a contact name.",
      contactNameLong: "Contact name is too long.",
      emailRequired: "Enter your email.",
      emailInvalid: "Enter a valid email.",
      emailLong: "Email is too long.",
      phoneLong: "Phone is too long.",
      noteLong: "Keep the note under 1,200 characters.",
    },
  },
  ru: {
    eyebrow: "Запрос доступа",
    title: "Расскажите о вашем бизнесе.",
    description: "Оставьте основную информацию для запуска первой страницы.",
    businessNameLabel: "Название бизнеса",
    businessNamePlaceholder: "Ваш бизнес",
    contactNameLabel: "Контактное лицо",
    contactNamePlaceholder: "Ваше имя",
    emailLabel: "Рабочая почта",
    emailPlaceholder: "you@business.com",
    phoneLabel: "Телефон",
    phoneOptional: "необязательно",
    phonePlaceholder: "+374 …",
    noteLabel: "Что вы продаёте?",
    noteOptional: "необязательно",
    notePlaceholder: "Коротко об услугах или текущем прайсе",
    submitLabel: "Запросить доступ",
    submittingLabel: "Отправка…",
    privacyPrefix: "Отправляя заявку, вы соглашаетесь с",
    privacyLinkLabel: "политикой конфиденциальности",
    successTitle: "Заявка получена",
    successDescription: "Заявка сохранена во входящих Unitforge.",
    validationMessage: "Проверьте выделенные поля.",
    unavailableMessage:
      "Не удалось сохранить заявку. Попробуйте ещё раз чуть позже.",
    rateLimitMessage: (minutes: number) =>
      `Слишком много запросов. Попробуйте снова примерно через ${minutes} мин.`,
    validation: {
      businessNameRequired: "Укажите название бизнеса.",
      businessNameLong: "Название бизнеса слишком длинное.",
      contactNameRequired: "Укажите контактное лицо.",
      contactNameLong: "Имя слишком длинное.",
      emailRequired: "Укажите почту.",
      emailInvalid: "Укажите корректную почту.",
      emailLong: "Почта слишком длинная.",
      phoneLong: "Телефон слишком длинный.",
      noteLong: "Сократите текст до 1 200 знаков.",
    },
  },
} as const;

export function getAccessRequestCopy(locale: InterfaceLocale) {
  return accessRequestCopy[locale];
}

export function getAccessRequestFormSchema(
  locale: InterfaceLocale,
  source: AccessRequestSource = "request-access",
) {
  const copy = getAccessRequestCopy(locale).validation;
  const businessNameRequired =
    source === "contact"
      ? locale === "ru"
        ? "Укажите тему обращения."
        : "Enter a subject."
      : copy.businessNameRequired;
  const noteSchema =
    source === "contact"
      ? z
          .string()
          .trim()
          .min(1, locale === "ru" ? "Напишите сообщение." : "Enter a message.")
          .max(1_200, copy.noteLong)
      : z.string().trim().max(1_200, copy.noteLong);

  return z.object({
    locale: z.enum(["en", "ru"]),
    businessName: z
      .string()
      .trim()
      .min(1, businessNameRequired)
      .max(160, copy.businessNameLong),
    contactName: z
      .string()
      .trim()
      .min(1, copy.contactNameRequired)
      .max(120, copy.contactNameLong),
    email: z
      .string()
      .trim()
      .min(1, copy.emailRequired)
      .max(160, copy.emailLong)
      .email(copy.emailInvalid)
      .transform((value) => value.toLowerCase()),
    phone: z.string().trim().max(120, copy.phoneLong),
    note: noteSchema,
  });
}

export type AccessRequestFormValues = z.infer<
  ReturnType<typeof getAccessRequestFormSchema>
>;

export function parseAccessRequestFormData(
  formData: FormData,
  locale: InterfaceLocale,
  source: AccessRequestSource = "request-access",
) {
  return getAccessRequestFormSchema(locale, source).safeParse({
    locale: getFormString(formData, "locale"),
    businessName: getFormString(formData, "businessName"),
    contactName: getFormString(formData, "contactName"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    note: getFormString(formData, "note"),
  });
}

export function getAccessRequestFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");

    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function isAccessRequestHoneypotFilled(formData: FormData) {
  return getFormString(formData, "website").trim().length > 0;
}

export function toAccessRequestSubmissionInput(
  values: AccessRequestFormValues,
) {
  return {
    businessName: values.businessName,
    contactName: values.contactName,
    email: values.email,
    phone: toOptionalString(values.phone),
    note: toOptionalString(values.note),
    locale: values.locale,
  };
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function toOptionalString(value: string) {
  return value.length > 0 ? value : null;
}
