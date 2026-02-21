import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Lalezar } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import type { Locale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { buildBackgroundCssVars } from "@/lib/background-theme";

const headingFont = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400"
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"]
});

const arabicHeadingFont = Lalezar({
  variable: "--font-ar-heading",
  subsets: ["arabic"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "Mustafa Mazin | Portfolio",
  description: "Art marketing strategist portfolio website."
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("site-locale")?.value;
  const initialLocale: Locale = localeCookie === "ar" ? "ar" : "en";
  let backgroundVars = buildBackgroundCssVars();

  try {
    const backgroundSettings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: {
        backgroundGlow1: true,
        backgroundGlow2: true,
        backgroundGlow3: true,
        backgroundBase1: true,
        backgroundBase2: true,
        backgroundBase3: true
      }
    });
    backgroundVars = buildBackgroundCssVars(backgroundSettings);
  } catch {
    backgroundVars = buildBackgroundCssVars();
  }

  return (
    <html lang={initialLocale} dir={initialLocale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${arabicHeadingFont.variable}`}
        style={backgroundVars}
      >
        <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
