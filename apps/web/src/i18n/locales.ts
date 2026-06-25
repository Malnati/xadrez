export const locales = ["pt-BR", "en-US", "es-419"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";
export const localeStorageKey = "xadrez_locale_v1";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}
