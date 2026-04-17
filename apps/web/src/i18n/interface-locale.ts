export const interfaceLocaleCookieName = "unitforge_locale";

export const interfaceLocales = ["en", "ru"] as const;

export type InterfaceLocale = (typeof interfaceLocales)[number];

export const defaultInterfaceLocale: InterfaceLocale = "en";

export function isInterfaceLocale(value: string | undefined | null): value is InterfaceLocale {
  return value === "en" || value === "ru";
}

export function resolveInterfaceLocale(value: string | undefined | null): InterfaceLocale {
  return isInterfaceLocale(value) ? value : defaultInterfaceLocale;
}

export function getInterfaceLocaleLabel(locale: InterfaceLocale) {
  return locale === "ru" ? "Русский" : "English";
}

export function getInterfaceLocaleTag(locale: InterfaceLocale) {
  return locale === "ru" ? "ru" : "en";
}

export function getInterfaceNumberLocale(locale: InterfaceLocale) {
  return locale === "ru" ? "ru-RU" : "en-US";
}
