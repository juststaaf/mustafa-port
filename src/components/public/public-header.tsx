"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { useLocale } from "@/components/locale-provider";

type PublicHeaderProps = {
  ownerNameEn: string;
  ownerNameAr: string;
};

export function PublicHeader({ ownerNameEn, ownerNameAr }: PublicHeaderProps) {
  const { locale } = useLocale();
  const ownerName = locale === "ar" ? ownerNameAr : ownerNameEn;

  return (
    <header className="top-nav secondary">
      <div className="container nav-inner">
        <Link href="/" className="brand-wordmark">
          {ownerName}
        </Link>
        <nav className="main-nav">
          <Link href="/">{locale === "ar" ? "الرئيسية" : "Home"}</Link>
          <Link href="/blog">{locale === "ar" ? "المدونة" : "Blog"}</Link>
          <Link href="/certificates">{locale === "ar" ? "الشهادات" : "Certificates"}</Link>
          <Link href="/lets-work-together" className="nav-cta">
            {locale === "ar" ? "خلّينا نشتغل سوا" : "Let's Work Together"}
          </Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
