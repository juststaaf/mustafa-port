"use client";

import { useLocale } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-switcher" aria-label="language switcher">
      <button
        type="button"
        className={locale === "en" ? "is-active" : ""}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "ar" ? "is-active" : ""}
        onClick={() => setLocale("ar")}
      >
        AR
      </button>
    </div>
  );
}
