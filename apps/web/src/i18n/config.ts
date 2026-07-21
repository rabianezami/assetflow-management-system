export const locales = ["en", "fa", "ps"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  ps: "پښتو",
};

export const rtlLocales = ["fa", "ps"] as const satisfies readonly Locale[];

export function isRtlLocale(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}
