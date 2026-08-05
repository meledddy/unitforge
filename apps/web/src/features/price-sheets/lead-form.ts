import { z } from "zod";

import { priceSheetContentLocaleSchema } from "@/features/price-sheets/validation";

import type {
  PriceSheetContentLocale,
  PriceSheetInterfaceLanguage,
} from "./localization";

export interface PriceSheetLeadFormCopy {
  eyebrow: string;
  title: string;
  description: string;
  helperText: string;
  contactNameLabel: string;
  companyNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  openFormLabel: string;
  closeFormLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDescription: string;
  submitAnotherLabel: string;
  privacyNotice: string;
  privacyLinkLabel: string;
  hiddenTitle: string;
  hiddenDescription: string;
  demoHiddenTitle: string;
  demoHiddenDescription: string;
  errorMessage: string;
  unavailableMessage: string;
  validationTitle: string;
}

export interface PriceSheetLeadSubmissionInput {
  priceSheetSlug: string;
  locale: PriceSheetContentLocale;
  contactName: string;
  companyOrBusinessName: string | null;
  email: string;
  phoneOrHandle: string | null;
  message: string;
}

const priceSheetLeadCopy: Record<
  PriceSheetInterfaceLanguage,
  PriceSheetLeadFormCopy
> = {
  en: {
    eyebrow: "",
    title: "Request a quote",
    description: "Tell this business what you need and how to contact you.",
    helperText: "",
    contactNameLabel: "Contact name",
    companyNameLabel: "Company or business name",
    emailLabel: "Email",
    phoneLabel: "Phone or handle",
    messageLabel: "What do you need?",
    openFormLabel: "Request a quote",
    closeFormLabel: "Hide form",
    submitLabel: "Send inquiry",
    submittingLabel: "Sending...",
    successTitle: "Thank you",
    successDescription:
      "Your request and contact details have been shared with this business.",
    submitAnotherLabel: "Send another inquiry",
    privacyNotice:
      "Your details are shared with this business. Unitforge processes them to deliver the inquiry.",
    privacyLinkLabel: "Privacy",
    hiddenTitle: "Inquiry form unavailable",
    hiddenDescription:
      "This price sheet is currently not accepting public inquiries.",
    demoHiddenTitle: "Inquiry preview",
    demoHiddenDescription:
      "Submissions are disabled in this demo. On a live page, the form sends each request to the operator inbox.",
    errorMessage: "Check the highlighted fields and try again.",
    unavailableMessage: "This inquiry page is unavailable.",
    validationTitle: "Please review the form",
  },
  ru: {
    eyebrow: "",
    title: "Оставить заявку",
    description: "Опишите задачу и оставьте контакты для связи.",
    helperText: "",
    contactNameLabel: "Контактное лицо",
    companyNameLabel: "Компания или бизнес",
    emailLabel: "Почта",
    phoneLabel: "Телефон или аккаунт",
    messageLabel: "Что вам нужно?",
    openFormLabel: "Оставить заявку",
    closeFormLabel: "Скрыть форму",
    submitLabel: "Отправить запрос",
    submittingLabel: "Отправка...",
    successTitle: "Спасибо",
    successDescription: "Заявка и ваши контакты переданы этому бизнесу.",
    submitAnotherLabel: "Отправить еще один запрос",
    privacyNotice:
      "Ваши данные получит этот бизнес. Unitforge обрабатывает их для передачи заявки.",
    privacyLinkLabel: "Конфиденциальность",
    hiddenTitle: "Форма запроса недоступна",
    hiddenDescription: "Этот прайс-лист сейчас не принимает публичные запросы.",
    demoHiddenTitle: "Как работают заявки",
    demoHiddenDescription:
      "В демо отправка отключена. На рабочей странице форма передаёт каждую заявку во входящие владельца.",
    errorMessage: "Проверьте выделенные поля и попробуйте снова.",
    unavailableMessage: "Страница запроса недоступна.",
    validationTitle: "Проверьте форму",
  },
};

export function getPriceSheetLeadCopy(language: PriceSheetInterfaceLanguage) {
  return priceSheetLeadCopy[language];
}

export function getPriceSheetLeadFormSchema(
  language: PriceSheetInterfaceLanguage,
) {
  const copy = getPriceSheetLeadCopy(language);

  return z.object({
    priceSheetSlug: z.string().trim().min(1, copy.unavailableMessage),
    locale: priceSheetContentLocaleSchema,
    contactName: z
      .string()
      .trim()
      .min(
        1,
        language === "ru"
          ? "Укажите контактное лицо."
          : "Contact name is required.",
      )
      .max(
        120,
        language === "ru"
          ? "Имя слишком длинное."
          : "Contact name is too long.",
      ),
    companyOrBusinessName: z
      .string()
      .trim()
      .max(
        160,
        language === "ru"
          ? "Название компании слишком длинное."
          : "Company name is too long.",
      ),
    email: z
      .string()
      .trim()
      .min(1, language === "ru" ? "Укажите почту." : "Email is required.")
      .max(
        160,
        language === "ru" ? "Почта слишком длинная." : "Email is too long.",
      )
      .refine(
        (value) => z.string().email().safeParse(value).success,
        language === "ru"
          ? "Укажите корректную почту."
          : "Enter a valid email.",
      ),
    phoneOrHandle: z
      .string()
      .trim()
      .max(
        120,
        language === "ru"
          ? "Контакт слишком длинный."
          : "Phone or handle is too long.",
      ),
    message: z
      .string()
      .trim()
      .min(
        1,
        language === "ru" ? "Опишите запрос." : "Inquiry text is required.",
      )
      .max(
        2000,
        language === "ru"
          ? "Сообщение слишком длинное."
          : "Inquiry text is too long.",
      ),
  });
}

export type PriceSheetLeadFormValues = z.input<
  ReturnType<typeof getPriceSheetLeadFormSchema>
>;

export function parsePriceSheetLeadFormData(
  formData: FormData,
  language: PriceSheetInterfaceLanguage,
) {
  return getPriceSheetLeadFormSchema(language).safeParse({
    priceSheetSlug: formData.get("priceSheetSlug"),
    locale: formData.get("locale"),
    contactName: formData.get("contactName"),
    companyOrBusinessName: formData.get("companyOrBusinessName"),
    email: formData.get("email"),
    phoneOrHandle: formData.get("phoneOrHandle"),
    message: formData.get("message"),
  });
}

export function getPriceSheetLeadFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");

    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

export function toPriceSheetLeadSubmissionInput(
  values: PriceSheetLeadFormValues,
): PriceSheetLeadSubmissionInput {
  return {
    priceSheetSlug: values.priceSheetSlug,
    locale: values.locale,
    contactName: values.contactName.trim(),
    companyOrBusinessName: toOptionalString(values.companyOrBusinessName),
    email: values.email.trim(),
    phoneOrHandle: toOptionalString(values.phoneOrHandle),
    message: values.message.trim(),
  };
}

function toOptionalString(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}
