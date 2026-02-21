import type { Locale } from "@/lib/locale";

export type LetsWorkContent = {
  title: string;
  subtitle: string;
  projectBrief: string;
  contactInfo: string;
  scheduleInfo: string;
  fullName: string;
  brandName: string;
  projectType: string;
  serviceFocus: string;
  projectDescription: string;
  mainGoal: string;
  location: string;
  timeline: string;
  budgetRange: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  send: string;
  sidebarTitle: string;
  step1: string;
  step2: string;
  step3: string;
  projectTypeOptions: string;
  serviceFocusOptions: string;
  timelineOptions: string;
  budgetOptions: string;
};

export const letsWorkFieldOrder: Array<keyof LetsWorkContent> = [
  "title",
  "subtitle",
  "projectBrief",
  "scheduleInfo",
  "contactInfo",
  "fullName",
  "brandName",
  "projectType",
  "serviceFocus",
  "projectDescription",
  "mainGoal",
  "location",
  "timeline",
  "budgetRange",
  "phone",
  "email",
  "preferredDate",
  "preferredTime",
  "notes",
  "send",
  "sidebarTitle",
  "step1",
  "step2",
  "step3",
  "projectTypeOptions",
  "serviceFocusOptions",
  "timelineOptions",
  "budgetOptions"
];

export const letsWorkDefaultsEn: LetsWorkContent = {
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
  step3: "Execution proposal with clear scope.",
  projectTypeOptions: "Marketing Campaign\nArt Direction\nBrand Identity\nSocial Content\nUI/UX\nOther",
  serviceFocusOptions: "Marketing Consultation\nMeta Ads Campaign\nPhotography\nMotion Graphics\nGraphic Design\nArt Production",
  timelineOptions: "Within 1 week\nWithin 2 weeks\nWithin 1 month\nMore than 1 month",
  budgetOptions: "Under $500\n$500 - $1,500\n$1,500 - $3,000\nAbove $3,000"
};

export const letsWorkDefaultsAr: LetsWorkContent = {
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
  step3: "إرسال تصور عمل مع نطاق واضح.",
  projectTypeOptions: "حملة تسويقية\nإخراج فني\nهوية بصرية\nمحتوى سوشال\nUI/UX\nأخرى",
  serviceFocusOptions: "استشارات تسويق\nحملة اعلانات ميتا\nتصوير\nموشن كرافك\nكرافك دزاين\nانتاج فني",
  timelineOptions: "خلال أسبوع\nخلال أسبوعين\nخلال شهر\nأكثر من شهر",
  budgetOptions: "أقل من 500$\n500$ - 1,500$\n1,500$ - 3,000$\nأكثر من 3,000$"
};

function getDefaults(locale: Locale): LetsWorkContent {
  return locale === "ar" ? letsWorkDefaultsAr : letsWorkDefaultsEn;
}

export function parseLetsWorkContent(
  raw: string | null | undefined,
  locale: Locale
): LetsWorkContent {
  const defaults = getDefaults(locale);
  let parsed: Partial<LetsWorkContent> = {};

  if (raw) {
    try {
      const maybeObject = JSON.parse(raw) as Partial<LetsWorkContent>;
      if (maybeObject && typeof maybeObject === "object") {
        parsed = maybeObject;
      }
    } catch {
      parsed = {};
    }
  }

  const merged = { ...defaults };
  for (const key of letsWorkFieldOrder) {
    const value = parsed[key];
    if (typeof value === "string" && value.trim().length > 0) {
      merged[key] = value.trim();
    }
  }
  return merged;
}

export function buildLetsWorkContentFromForm(formData: FormData, locale: Locale): string {
  const defaults = getDefaults(locale);
  const result: LetsWorkContent = { ...defaults };

  for (const key of letsWorkFieldOrder) {
    const fieldName = `lw_${key}_${locale}`;
    const value = formData.get(fieldName);
    if (typeof value === "string" && value.trim().length > 0) {
      result[key] = value.trim();
    }
  }

  return JSON.stringify(result);
}

export function parseOptionsText(raw: string): string[] {
  return raw
    .split(/\r?\n|[|]/g)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
