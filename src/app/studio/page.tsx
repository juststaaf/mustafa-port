import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isStudioAuthenticated } from "@/lib/session";
import { StudioLoginForm } from "@/app/studio/login-form";
import { StudioDashboard } from "@/app/studio/dashboard";
import { letsWorkDefaultsAr, letsWorkDefaultsEn } from "@/lib/lets-work-content";

export const dynamic = "force-dynamic";

async function ensureStudioRows() {
  const letsWorkContentEn = JSON.stringify(letsWorkDefaultsEn);
  const letsWorkContentAr = JSON.stringify(letsWorkDefaultsAr);

  const configuredInitialPassword = process.env.STUDIO_INITIAL_PASSWORD;
  if (!configuredInitialPassword && process.env.NODE_ENV === "production") {
    throw new Error("STUDIO_INITIAL_PASSWORD is required in production.");
  }
  const initialPassword = configuredInitialPassword || "AA12321@@mm";
  const existingCredential = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (!existingCredential) {
    const passwordHash = await bcrypt.hash(initialPassword, 10);
    await prisma.adminCredential.create({
      data: {
        id: 1,
        passwordHash
      }
    });
  }

  const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!existingSettings) {
    await prisma.siteSettings.create({
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
        aboutBodyEn:
          "I work at the edge of strategy and visual storytelling. Every campaign starts with artistic intention and lands on market impact.",
        aboutBodyAr:
          "أعمل في تقاطع الاستراتيجية والسرد البصري. كل حملة تبدأ بنية فنية وتنتهي بأثر تسويقي واضح.",
        contactTitleEn: "Contact",
        contactTitleAr: "تواصل",
        contactBodyEn: "Tell me what you are building, and we will shape a strong visual move.",
        contactBodyAr: "احكيلي شنو تبني، ونصنع حركة بصرية قوية.",
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
  }
}

export default async function StudioPage() {
  await ensureStudioRows();

  const authenticated = await isStudioAuthenticated();
  if (!authenticated) {
    return (
      <main className="studio-login-shell">
        <StudioLoginForm />
      </main>
    );
  }

  const [settings, services, works, collaborations, certificates, posts] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.service.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.work.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.collaboration.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.certificate.findMany({
      orderBy: [{ issuedAt: "desc" }, { displayOrder: "asc" }]
    }),
    prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } })
  ]);

  return (
    <main className="studio-page-shell">
      <StudioDashboard
        settings={settings}
        services={services}
        works={works}
        collaborations={collaborations}
        certificates={certificates}
        posts={posts}
      />
    </main>
  );
}
