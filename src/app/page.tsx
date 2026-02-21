import { getSiteData } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { HomePage } from "@/components/public/home-page";
import { letsWorkDefaultsAr, letsWorkDefaultsEn } from "@/lib/lets-work-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  const letsWorkContentEn = JSON.stringify(letsWorkDefaultsEn);
  const letsWorkContentAr = JSON.stringify(letsWorkDefaultsAr);

  if (!data.settings) {
    const settings = await prisma.siteSettings.create({
      data: {
        id: 1,
        siteNameEn: "Mustafa Mazin",
        siteNameAr: "مصطفى مازن",
        ownerNameEn: "Mustafa Mazin",
        ownerNameAr: "مصطفى مازن",
        roleEn: "Art Marketing Strategist",
        roleAr: "استراتيجي تسويق فني",
        heroTitleEn: "Marketing x Art Direction",
        heroTitleAr: "تسويق x إخراج فني",
        heroSubtitleEn: "Wild ideas shaped into measurable campaigns.",
        heroSubtitleAr: "أفكار مجنونة تُصاغ لحملات قابلة للقياس.",
        aboutTitleEn: "About",
        aboutTitleAr: "عني",
        aboutBodyEn: "Portfolio settings are now initialized from the dashboard.",
        aboutBodyAr: "تمت تهيئة إعدادات الموقع ويمكن تعديلها من لوحة التحكم.",
        contactTitleEn: "Contact",
        contactTitleAr: "تواصل",
        contactBodyEn: "Tell me about your next move.",
        contactBodyAr: "احكيلي عن خطوتك القادمة.",
        ctaTitleEn: "Let's Work Together",
        ctaTitleAr: "خلّينا نشتغل سوا",
        ctaBodyEn: "Book a focused discussion and move your idea to execution.",
        ctaBodyAr: "احجز نقاش مركز وننقل الفكرة إلى تنفيذ.",
        resultsCampaigns: 120,
        resultsClients: 31,
        resultsActive: 7,
        resultsExperience: 7,
        backgroundGlow1: "#ff601d",
        backgroundGlow2: "#00e5ff",
        backgroundGlow3: "#ff4d8d",
        backgroundBase1: "#050608",
        backgroundBase2: "#10131b",
        backgroundBase3: "#07080c",
        email: "hello@mustafamazin.com",
        phone: "07731403700",
        whatsapp: "07850881134",
        instagram: "juststaaf",
        linkedin: "https://www.linkedin.com/in/mustafa-mazin-255202225/",
        letsWorkContentEn,
        letsWorkContentAr,
        introAudioPath: "/audio/intro-pulse.mp3"
      }
    });

    return (
      <HomePage
        settings={settings}
        services={[]}
        works={[]}
        collaborations={[]}
        posts={[]}
      />
    );
  }

  return (
    <HomePage
      settings={data.settings}
      services={data.services}
      works={data.works}
      collaborations={data.collaborations}
      posts={data.posts}
    />
  );
}
