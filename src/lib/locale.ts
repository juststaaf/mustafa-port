export type Locale = "en" | "ar";

export function isArabic(locale: Locale) {
  return locale === "ar";
}

export function pickByLocale(locale: Locale, enValue: string, arValue: string) {
  return locale === "ar" ? arValue : enValue;
}

export function formatDateByLocale(locale: Locale, date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-IQ" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(value);
}
