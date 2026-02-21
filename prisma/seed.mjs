import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const services = [
  {
    titleEn: "Marketing Consultation",
    titleAr: "استشارات تسويق",
    descriptionEn: "Audit current funnels and define realistic growth targets.",
    descriptionAr: "تدقيق القنوات الحالية وبناء أهداف نمو واقعية."
  },
  {
    titleEn: "Campaign Design",
    titleAr: "حملة تسويقية",
    descriptionEn: "Creative campaign concept from idea board to launch.",
    descriptionAr: "تصميم حملة إبداعية متكاملة من الفكرة إلى الإطلاق."
  },
  {
    titleEn: "Brand Strategy",
    titleAr: "استراتيجيات",
    descriptionEn: "Positioning, messaging and audience direction with artistic edge.",
    descriptionAr: "صياغة تموضع وهوية ورسائل موجهة بطابع فني."
  },
  {
    titleEn: "Meta Ads",
    titleAr: "حملة اعلانات ميتا",
    descriptionEn: "Targeted ad structures for Facebook and Instagram ecosystems.",
    descriptionAr: "هيكلة حملات ميتا بشكل موجّه لتحقيق نتائج ملموسة."
  },
  {
    titleEn: "Production Photography",
    titleAr: "تصوير",
    descriptionEn: "Visual capture designed for campaign storytelling.",
    descriptionAr: "إنتاج تصوير موجه لسرد بصري متناسق مع الحملة."
  },
  {
    titleEn: "Motion Graphics",
    titleAr: "موشن كرافك",
    descriptionEn: "Animated visuals that turn static concepts into momentum.",
    descriptionAr: "تحويل الفكرة الثابتة إلى تجربة بصرية متحركة وجاذبة."
  },
  {
    titleEn: "Art Direction",
    titleAr: "انتاج فني",
    descriptionEn: "Unifying visual direction across content, campaigns and tone.",
    descriptionAr: "قيادة فنية توحّد الهوية البصرية في كل نقاط الظهور."
  },
  {
    titleEn: "Graphic Design",
    titleAr: "كرافك دزاين",
    descriptionEn: "Posters, social assets and visual systems with distinct character.",
    descriptionAr: "تصميمات جرافيكية تعكس شخصية مميزة للحضور الرقمي."
  },
  {
    titleEn: "UI/UX Direction",
    titleAr: "UI/UX",
    descriptionEn: "Product flow and interface direction rooted in brand narrative.",
    descriptionAr: "توجيه تجربة ومنتج رقمي يرتكز على قصة الهوية."
  }
];

const works = [
  "Pulse Studio",
  "Noor Foundry",
  "Rimal Agency",
  "Atheer Space",
  "Shift Lab",
  "Makan Creative",
  "Rewaq Stories",
  "Azraq Project",
  "Mosaic Line",
  "Delta Visuals"
];

const collaborations = [
  "Rafidain Tech",
  "Babylon District",
  "Mada Collective",
  "Orbit House",
  "Hadara Brand",
  "Loom Partners",
  "Grit Media",
  "Basmah Initiative",
  "Vanta Studio",
  "Saha Works",
  "Focus Point",
  "Canvas Hill"
];

const collaborationAccentPalette = [
  "#00e5ff",
  "#ff4d8d",
  "#ff9f1c",
  "#6ce6a3",
  "#8aa8ff",
  "#ff7d57"
];

const workLogoPlaceholders = [
  "/placeholder/work-1.svg",
  "/placeholder/work-2.svg",
  "/placeholder/work-3.svg"
];

const blogCoverPlaceholders = [
  "/placeholder/blog-cover-1.svg",
  "/placeholder/blog-cover-2.svg",
  "/placeholder/blog-cover-3.svg"
];

const letsWorkContentEn = JSON.stringify({
  title: "Let's Work Together",
  subtitle: "Fill in a clear brief and you will get a structured reply to move your idea into execution.",
  projectBrief: "Project Brief",
  contactInfo: "Contact Details",
  scheduleInfo: "Timeline & Budget",
  fullName: "Full Name",
  brandName: "Brand / Company Name",
  projectType: "Project Type",
  serviceFocus: "Primary Service Needed",
  projectDescription: "Project Description",
  mainGoal: "Primary Goal",
  location: "Location",
  timeline: "Expected Timeline",
  budgetRange: "Estimated Budget",
  phone: "Phone Number",
  email: "Email",
  preferredDate: "Preferred Date",
  preferredTime: "Preferred Time",
  notes: "Additional Notes",
  send: "Send Request via Gmail",
  sidebarTitle: "How We Work",
  step1: "Brief review within 24 hours.",
  step2: "Discovery call to lock the direction.",
  step3: "Execution proposal with clear scope."
});

const letsWorkContentAr = JSON.stringify({
  title: "خلّينا نشتغل سوا",
  subtitle: "املأ البريف بشكل واضح، وراح يصلك رد منظم حتى نحول الفكرة إلى خطة تنفيذ حقيقية.",
  projectBrief: "معلومات المشروع",
  contactInfo: "معلومات التواصل",
  scheduleInfo: "الجدول والميزانية",
  fullName: "الاسم الكامل",
  brandName: "اسم العلامة/الشركة",
  projectType: "نوع المشروع",
  serviceFocus: "الخدمة الأساسية المطلوبة",
  projectDescription: "وصف المشروع",
  mainGoal: "شنو الهدف الرئيسي؟",
  location: "الموقع",
  timeline: "الإطار الزمني المتوقع",
  budgetRange: "الميزانية التقديرية",
  phone: "رقم الهاتف",
  email: "الايميل",
  preferredDate: "تاريخ مفضل للاتصال",
  preferredTime: "وقت مفضل",
  notes: "ملاحظات إضافية",
  send: "إرسال الطلب عبر Gmail",
  sidebarTitle: "آلية التعاون",
  step1: "مراجعة البريف خلال 24 ساعة.",
  step2: "مكالمة نقاش أولية لتثبيت الرؤية.",
  step3: "إرسال تصور عمل مع نطاق واضح."
});

const certificates = [
  {
    title: "Advanced Marketing Strategy",
    issuer: "Meta Blueprint",
    issuedAt: new Date("2024-08-01"),
    description: "Applied audience architecture, conversion journeys and reporting."
  },
  {
    title: "Creative Direction for Campaigns",
    issuer: "Google Creative Campus",
    issuedAt: new Date("2024-03-12"),
    description: "Story systems and visual decision frameworks for brand campaigns."
  },
  {
    title: "UI/UX Product Thinking",
    issuer: "Coursera",
    issuedAt: new Date("2023-11-05"),
    description: "Design process focused on clarity, usability and measurable outcomes."
  },
  {
    title: "Motion Design Masterclass",
    issuer: "School of Motion",
    issuedAt: new Date("2023-07-20"),
    description: "Animation timing, transitions, and identity-led motion systems."
  },
  {
    title: "Professional Photography Workflow",
    issuer: "Adobe Education",
    issuedAt: new Date("2022-10-17"),
    description: "Visual production workflow from shoot planning to post processing."
  }
];

const posts = [
  {
    titleEn: "Chaos Is the Raw Material",
    titleAr: "الفوضى هي المادة الخام",
    excerptEn: "How I turn raw ideas into campaign-ready visual direction.",
    excerptAr: "كيف أحوّل الأفكار الخام إلى اتجاه بصري جاهز للحملات.",
    contentHtmlEn:
      "<h2>The first sketch is never polite</h2><p>I start from messy notes, fragmented words, and screenshots. Strategy appears when chaos begins to repeat itself.</p><ul><li>Observe pattern</li><li>Name intention</li><li>Design execution</li></ul>",
    contentHtmlAr:
      "<h2>البداية دائماً غير مرتبة</h2><p>أبدأ من أفكار مبعثرة ومراجع سريعة. الاستراتيجية تظهر عندما تتكرر الإشارات نفسها أمامي.</p><ul><li>ملاحظة النمط</li><li>تسمية النية</li><li>تحويلها لتنفيذ بصري</li></ul>",
    publishedAt: new Date("2026-02-01")
  },
  {
    titleEn: "When Color Becomes a Message",
    titleAr: "لما يصير اللون رسالة",
    excerptEn: "Choosing palettes that speak before text starts.",
    excerptAr: "اختيار ألوان تتكلم قبل ما يبدأ النص.",
    contentHtmlEn:
      "<p>Color has function. It should guide pace, mood and priority. If every block screams, the message dies.</p>",
    contentHtmlAr:
      "<p>اللون إله وظيفة. يحدد المزاج، ويوجه العين، ويعطي الأولوية. إذا كل عنصر يصرخ، الرسالة تضيع.</p>",
    publishedAt: new Date("2026-01-20")
  },
  {
    titleEn: "Campaigns Need Rhythm",
    titleAr: "الحملات تحتاج إيقاع",
    excerptEn: "Visual rhythm keeps audiences inside the story longer.",
    excerptAr: "الإيقاع البصري يخلي الجمهور داخل القصة لفترة أطول.",
    contentHtmlEn:
      "<p>Strong campaigns move like music. Intro, rise, pause, punchline, and aftertaste.</p>",
    contentHtmlAr:
      "<p>الحملة القوية تمشي مثل الموسيقى: بداية، تصاعد، استراحة، ذروة، وأثر بعد النهاية.</p>",
    publishedAt: new Date("2026-01-08")
  },
  {
    titleEn: "UI and Art Direction Can Coexist",
    titleAr: "UI والاتجاه الفني ممكن يتعايشون",
    excerptEn: "Usability and artistic identity are not opposite poles.",
    excerptAr: "سهولة الاستخدام والهوية الفنية مو ضد بعض.",
    contentHtmlEn:
      "<p>Clean interfaces can still feel expressive if spacing, type and motion are deliberate.</p>",
    contentHtmlAr:
      "<p>الواجهات الواضحة ممكن تبقى فنية إذا المسافات والخط والحركة محسوبة.</p>",
    publishedAt: new Date("2025-12-21")
  },
  {
    titleEn: "The Power of a Single Frame",
    titleAr: "قوة لقطة واحدة",
    excerptEn: "Sometimes one image carries an entire campaign direction.",
    excerptAr: "أحياناً صورة وحدة تحمل اتجاه حملة كامل.",
    contentHtmlEn:
      "<p>Photography is not decoration. It can be the strategic anchor for all messaging layers.</p>",
    contentHtmlAr:
      "<p>التصوير ليس ديكور، ممكن يكون العمود الاستراتيجي لكل طبقات الرسالة.</p>",
    publishedAt: new Date("2025-12-01")
  }
];

async function main() {
  const configuredInitialPassword = process.env.STUDIO_INITIAL_PASSWORD;
  if (!configuredInitialPassword && process.env.NODE_ENV === "production") {
    throw new Error("STUDIO_INITIAL_PASSWORD is required in production.");
  }
  const initialPassword = configuredInitialPassword || "AA12321@@mm";
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  await prisma.adminCredential.upsert({
    where: { id: 1 },
    update: { passwordHash },
    create: { id: 1, passwordHash }
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      portraitPath: "/placeholder/portrait-temp.svg",
      letsWorkContentEn,
      letsWorkContentAr,
      resultsCampaigns: 120,
      resultsClients: 31,
      resultsActive: 7,
      resultsExperience: 7,
      backgroundGlow1: "#ff601d",
      backgroundGlow2: "#00e5ff",
      backgroundGlow3: "#ff4d8d",
      backgroundBase1: "#050608",
      backgroundBase2: "#10131b",
      backgroundBase3: "#07080c"
    },
    create: {
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
        "I work at the edge of strategy and visual storytelling. Every campaign I build starts with artistic intention and lands on market impact.",
      aboutBodyAr:
        "أعمل في تقاطع الاستراتيجية والسرد البصري. كل حملة أبنيها تبدأ بنية فنية وتنتهي بأثر تسويقي واضح.",
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
      portraitPath: "/placeholder/portrait-temp.svg",
      introAudioPath: "/audio/intro-pulse.mp3"
    }
  });

  await prisma.service.deleteMany();
  await prisma.work.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.blogPost.deleteMany();

  await prisma.service.createMany({
    data: services.map((service, index) => ({
      ...service,
      displayOrder: index + 1
    }))
  });

  await prisma.work.createMany({
    data: works.map((name, index) => ({
      name,
      displayOrder: index + 1,
      logoPath: workLogoPlaceholders[index % workLogoPlaceholders.length]
    }))
  });

  await prisma.collaboration.createMany({
    data: collaborations.map((name, index) => ({
      name,
      displayOrder: index + 1,
      logoPath: workLogoPlaceholders[index % workLogoPlaceholders.length],
      accentColor: collaborationAccentPalette[index % collaborationAccentPalette.length]
    }))
  });

  await prisma.certificate.createMany({
    data: certificates.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
      imagePath: "/placeholder/certificate-temp.svg"
    }))
  });

  await prisma.blogPost.createMany({
    data: posts.map((post, index) => ({
      ...post,
      slug: slugify(post.titleEn, { lower: true, strict: true }),
      coverImage: blogCoverPlaceholders[index % blogCoverPlaceholders.length]
    }))
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
