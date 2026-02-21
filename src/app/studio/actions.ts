"use server";

import bcrypt from "bcryptjs";
import slugify from "slugify";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkStudioRateLimit } from "@/lib/rate-limit";
import { clearStudioSession, isStudioAuthenticated, setStudioSession } from "@/lib/session";
import { removeUploadedFile, saveImageAsWebp } from "@/lib/uploads";
import { buildLetsWorkContentFromForm } from "@/lib/lets-work-content";
import { sanitizeRichHtml } from "@/lib/sanitize-html";
import { backgroundThemeDefaults, normalizeBackgroundColor } from "@/lib/background-theme";

type AuthFormState = {
  error?: string;
};

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumberField(formData: FormData, key: string, defaultValue = 0) {
  const value = Number(getTextField(formData, key));
  if (!Number.isFinite(value)) {
    return defaultValue;
  }
  return value;
}

function getFileField(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) {
    return value;
  }
  return null;
}

function normalizeAccentColor(rawValue: string) {
  const value = rawValue.trim();
  if (!value) {
    return null;
  }
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase();
  }
  return null;
}

async function requireStudioAuth() {
  const isAuthenticated = await isStudioAuthenticated();
  if (!isAuthenticated) {
    redirect("/studio");
  }
}

async function buildUniqueSlug(titleEn: string, postId?: number) {
  const baseSlug = slugify(titleEn, { lower: true, strict: true }) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === postId) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function loginStudioAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = getTextField(formData, "password");
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local";

  const rateResult = checkStudioRateLimit(ip);
  if (!rateResult.allowed) {
    const waitSeconds = Math.ceil(rateResult.retryAfterMs / 1000);
    return {
      error: `Too many attempts. Try again in ${waitSeconds}s.`
    };
  }

  const credentials = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (!credentials) {
    return { error: "Admin credentials are not initialized yet." };
  }

  const isValid = await bcrypt.compare(password, credentials.passwordHash);
  if (!isValid) {
    return { error: "Invalid password." };
  }

  await setStudioSession();
  redirect("/studio");
}

export async function logoutStudioAction() {
  await clearStudioSession();
  redirect("/studio");
}

export async function updatePasswordAction(formData: FormData) {
  await requireStudioAuth();
  const currentPassword = getTextField(formData, "currentPassword");
  const newPassword = getTextField(formData, "newPassword");

  if (newPassword.length < 8) {
    return;
  }

  const credentials = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (!credentials) {
    return;
  }

  const isValid = await bcrypt.compare(currentPassword, credentials.passwordHash);
  if (!isValid) {
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.adminCredential.update({
    where: { id: 1 },
    data: { passwordHash }
  });

  revalidatePath("/studio");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireStudioAuth();
  const letsWorkContentEn = buildLetsWorkContentFromForm(formData, "en");
  const letsWorkContentAr = buildLetsWorkContentFromForm(formData, "ar");
  const currentSettings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
    select: { portraitPath: true }
  });

  const portraitFile = getFileField(formData, "portraitFile");
  let portraitPath = currentSettings?.portraitPath || null;

  if (portraitFile) {
    const uploaded = await saveImageAsWebp(portraitFile, "portrait");
    if (uploaded) {
      if (portraitPath) {
        await removeUploadedFile(portraitPath);
      }
      portraitPath = uploaded;
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteNameEn: getTextField(formData, "siteNameEn"),
      siteNameAr: getTextField(formData, "siteNameAr"),
      ownerNameEn: getTextField(formData, "ownerNameEn"),
      ownerNameAr: getTextField(formData, "ownerNameAr"),
      roleEn: getTextField(formData, "roleEn"),
      roleAr: getTextField(formData, "roleAr"),
      heroTitleEn: getTextField(formData, "heroTitleEn"),
      heroTitleAr: getTextField(formData, "heroTitleAr"),
      heroSubtitleEn: getTextField(formData, "heroSubtitleEn"),
      heroSubtitleAr: getTextField(formData, "heroSubtitleAr"),
      aboutTitleEn: getTextField(formData, "aboutTitleEn"),
      aboutTitleAr: getTextField(formData, "aboutTitleAr"),
      aboutBodyEn: getTextField(formData, "aboutBodyEn"),
      aboutBodyAr: getTextField(formData, "aboutBodyAr"),
      contactTitleEn: getTextField(formData, "contactTitleEn"),
      contactTitleAr: getTextField(formData, "contactTitleAr"),
      contactBodyEn: getTextField(formData, "contactBodyEn"),
      contactBodyAr: getTextField(formData, "contactBodyAr"),
      ctaTitleEn: getTextField(formData, "ctaTitleEn"),
      ctaTitleAr: getTextField(formData, "ctaTitleAr"),
      ctaBodyEn: getTextField(formData, "ctaBodyEn"),
      ctaBodyAr: getTextField(formData, "ctaBodyAr"),
      backgroundGlow1: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow1"),
        backgroundThemeDefaults.backgroundGlow1
      ),
      backgroundGlow2: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow2"),
        backgroundThemeDefaults.backgroundGlow2
      ),
      backgroundGlow3: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow3"),
        backgroundThemeDefaults.backgroundGlow3
      ),
      backgroundBase1: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase1"),
        backgroundThemeDefaults.backgroundBase1
      ),
      backgroundBase2: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase2"),
        backgroundThemeDefaults.backgroundBase2
      ),
      backgroundBase3: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase3"),
        backgroundThemeDefaults.backgroundBase3
      ),
      resultsCampaigns: getNumberField(formData, "resultsCampaigns", 120),
      resultsClients: getNumberField(formData, "resultsClients", 31),
      resultsActive: getNumberField(formData, "resultsActive", 7),
      resultsExperience: getNumberField(formData, "resultsExperience", 7),
      email: getTextField(formData, "email"),
      phone: getTextField(formData, "phone"),
      whatsapp: getTextField(formData, "whatsapp"),
      instagram: getTextField(formData, "instagram"),
      linkedin: getTextField(formData, "linkedin"),
      letsWorkContentEn,
      letsWorkContentAr,
      introAudioPath: getTextField(formData, "introAudioPath") || null,
      portraitPath
    },
    create: {
      id: 1,
      siteNameEn: getTextField(formData, "siteNameEn"),
      siteNameAr: getTextField(formData, "siteNameAr"),
      ownerNameEn: getTextField(formData, "ownerNameEn"),
      ownerNameAr: getTextField(formData, "ownerNameAr"),
      roleEn: getTextField(formData, "roleEn"),
      roleAr: getTextField(formData, "roleAr"),
      heroTitleEn: getTextField(formData, "heroTitleEn"),
      heroTitleAr: getTextField(formData, "heroTitleAr"),
      heroSubtitleEn: getTextField(formData, "heroSubtitleEn"),
      heroSubtitleAr: getTextField(formData, "heroSubtitleAr"),
      aboutTitleEn: getTextField(formData, "aboutTitleEn"),
      aboutTitleAr: getTextField(formData, "aboutTitleAr"),
      aboutBodyEn: getTextField(formData, "aboutBodyEn"),
      aboutBodyAr: getTextField(formData, "aboutBodyAr"),
      contactTitleEn: getTextField(formData, "contactTitleEn"),
      contactTitleAr: getTextField(formData, "contactTitleAr"),
      contactBodyEn: getTextField(formData, "contactBodyEn"),
      contactBodyAr: getTextField(formData, "contactBodyAr"),
      ctaTitleEn: getTextField(formData, "ctaTitleEn"),
      ctaTitleAr: getTextField(formData, "ctaTitleAr"),
      ctaBodyEn: getTextField(formData, "ctaBodyEn"),
      ctaBodyAr: getTextField(formData, "ctaBodyAr"),
      backgroundGlow1: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow1"),
        backgroundThemeDefaults.backgroundGlow1
      ),
      backgroundGlow2: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow2"),
        backgroundThemeDefaults.backgroundGlow2
      ),
      backgroundGlow3: normalizeBackgroundColor(
        getTextField(formData, "backgroundGlow3"),
        backgroundThemeDefaults.backgroundGlow3
      ),
      backgroundBase1: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase1"),
        backgroundThemeDefaults.backgroundBase1
      ),
      backgroundBase2: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase2"),
        backgroundThemeDefaults.backgroundBase2
      ),
      backgroundBase3: normalizeBackgroundColor(
        getTextField(formData, "backgroundBase3"),
        backgroundThemeDefaults.backgroundBase3
      ),
      resultsCampaigns: getNumberField(formData, "resultsCampaigns", 120),
      resultsClients: getNumberField(formData, "resultsClients", 31),
      resultsActive: getNumberField(formData, "resultsActive", 7),
      resultsExperience: getNumberField(formData, "resultsExperience", 7),
      email: getTextField(formData, "email"),
      phone: getTextField(formData, "phone"),
      whatsapp: getTextField(formData, "whatsapp"),
      instagram: getTextField(formData, "instagram"),
      linkedin: getTextField(formData, "linkedin"),
      letsWorkContentEn,
      letsWorkContentAr,
      introAudioPath: getTextField(formData, "introAudioPath") || null,
      portraitPath
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/certificates");
  revalidatePath("/lets-work-together");
  revalidatePath("/studio");
}

export async function resetBackgroundGradientAction() {
  await requireStudioAuth();

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      backgroundGlow1: backgroundThemeDefaults.backgroundGlow1,
      backgroundGlow2: backgroundThemeDefaults.backgroundGlow2,
      backgroundGlow3: backgroundThemeDefaults.backgroundGlow3,
      backgroundBase1: backgroundThemeDefaults.backgroundBase1,
      backgroundBase2: backgroundThemeDefaults.backgroundBase2,
      backgroundBase3: backgroundThemeDefaults.backgroundBase3
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/certificates");
  revalidatePath("/lets-work-together");
  revalidatePath("/studio");
}

export async function createServiceAction(formData: FormData) {
  await requireStudioAuth();
  await prisma.service.create({
    data: {
      titleEn: getTextField(formData, "titleEn"),
      titleAr: getTextField(formData, "titleAr"),
      descriptionEn: getTextField(formData, "descriptionEn"),
      descriptionAr: getTextField(formData, "descriptionAr"),
      displayOrder: getNumberField(formData, "displayOrder")
    }
  });
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function updateServiceAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  await prisma.service.update({
    where: { id },
    data: {
      titleEn: getTextField(formData, "titleEn"),
      titleAr: getTextField(formData, "titleAr"),
      descriptionEn: getTextField(formData, "descriptionEn"),
      descriptionAr: getTextField(formData, "descriptionAr"),
      displayOrder: getNumberField(formData, "displayOrder")
    }
  });
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function deleteServiceAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function createWorkAction(formData: FormData) {
  await requireStudioAuth();
  const logoFile = getFileField(formData, "logoFile");
  const logoPath = logoFile ? await saveImageAsWebp(logoFile, "work") : null;

  await prisma.work.create({
    data: {
      name: getTextField(formData, "name"),
      displayOrder: getNumberField(formData, "displayOrder"),
      logoPath
    }
  });

  revalidatePath("/");
  revalidatePath("/studio");
}

export async function updateWorkAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentWork = await prisma.work.findUnique({
    where: { id },
    select: { logoPath: true }
  });
  if (!currentWork) {
    return;
  }
  const logoFile = getFileField(formData, "logoFile");

  let logoPath = currentWork.logoPath || null;
  if (logoFile) {
    const uploadedPath = await saveImageAsWebp(logoFile, "work");
    if (uploadedPath) {
      if (logoPath) {
        await removeUploadedFile(logoPath);
      }
      logoPath = uploadedPath;
    }
  }

  await prisma.work.update({
    where: { id },
    data: {
      name: getTextField(formData, "name"),
      displayOrder: getNumberField(formData, "displayOrder"),
      logoPath
    }
  });

  revalidatePath("/");
  revalidatePath("/studio");
}

export async function deleteWorkAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentWork = await prisma.work.findUnique({
    where: { id },
    select: { logoPath: true }
  });
  await prisma.work.delete({ where: { id } });
  await removeUploadedFile(currentWork?.logoPath);
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function createCollaborationAction(formData: FormData) {
  await requireStudioAuth();
  const logoFile = getFileField(formData, "logoFile");
  const logoPath = logoFile ? await saveImageAsWebp(logoFile, "collab") : null;
  const accentColor = normalizeAccentColor(getTextField(formData, "accentColor"));

  await prisma.collaboration.create({
    data: {
      name: getTextField(formData, "name"),
      displayOrder: getNumberField(formData, "displayOrder"),
      logoPath,
      accentColor
    }
  });

  revalidatePath("/");
  revalidatePath("/studio");
}

export async function updateCollaborationAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentCollaboration = await prisma.collaboration.findUnique({
    where: { id },
    select: { logoPath: true }
  });
  if (!currentCollaboration) {
    return;
  }
  const logoFile = getFileField(formData, "logoFile");
  const accentColor = normalizeAccentColor(getTextField(formData, "accentColor"));

  let logoPath = currentCollaboration.logoPath || null;
  if (logoFile) {
    const uploadedPath = await saveImageAsWebp(logoFile, "collab");
    if (uploadedPath) {
      if (logoPath) {
        await removeUploadedFile(logoPath);
      }
      logoPath = uploadedPath;
    }
  }

  await prisma.collaboration.update({
    where: { id },
    data: {
      name: getTextField(formData, "name"),
      displayOrder: getNumberField(formData, "displayOrder"),
      logoPath,
      accentColor
    }
  });

  revalidatePath("/");
  revalidatePath("/studio");
}

export async function deleteCollaborationAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentCollaboration = await prisma.collaboration.findUnique({
    where: { id },
    select: { logoPath: true }
  });
  await prisma.collaboration.delete({ where: { id } });
  await removeUploadedFile(currentCollaboration?.logoPath);
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function createCertificateAction(formData: FormData) {
  await requireStudioAuth();
  const imageFile = getFileField(formData, "imageFile");
  const imagePath = imageFile ? await saveImageAsWebp(imageFile, "certificate") : null;

  await prisma.certificate.create({
    data: {
      title: getTextField(formData, "title"),
      issuer: getTextField(formData, "issuer"),
      issuedAt: new Date(getTextField(formData, "issuedAt")),
      description: getTextField(formData, "description") || null,
      displayOrder: getNumberField(formData, "displayOrder"),
      imagePath
    }
  });

  revalidatePath("/certificates");
  revalidatePath("/studio");
}

export async function updateCertificateAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentCertificate = await prisma.certificate.findUnique({
    where: { id },
    select: { imagePath: true }
  });
  if (!currentCertificate) {
    return;
  }
  const imageFile = getFileField(formData, "imageFile");

  let imagePath = currentCertificate.imagePath || null;
  if (imageFile) {
    const uploadedPath = await saveImageAsWebp(imageFile, "certificate");
    if (uploadedPath) {
      if (imagePath) {
        await removeUploadedFile(imagePath);
      }
      imagePath = uploadedPath;
    }
  }

  await prisma.certificate.update({
    where: { id },
    data: {
      title: getTextField(formData, "title"),
      issuer: getTextField(formData, "issuer"),
      issuedAt: new Date(getTextField(formData, "issuedAt")),
      description: getTextField(formData, "description") || null,
      displayOrder: getNumberField(formData, "displayOrder"),
      imagePath
    }
  });

  revalidatePath("/certificates");
  revalidatePath("/studio");
}

export async function deleteCertificateAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentCertificate = await prisma.certificate.findUnique({
    where: { id },
    select: { imagePath: true }
  });
  await prisma.certificate.delete({ where: { id } });
  await removeUploadedFile(currentCertificate?.imagePath);
  revalidatePath("/certificates");
  revalidatePath("/studio");
}

export async function createBlogPostAction(formData: FormData) {
  await requireStudioAuth();
  const coverFile = getFileField(formData, "coverFile");
  const coverImage = coverFile ? await saveImageAsWebp(coverFile, "blog") : null;
  const titleEn = getTextField(formData, "titleEn");
  const slug = await buildUniqueSlug(titleEn);
  const contentHtmlEn = sanitizeRichHtml(getTextField(formData, "contentHtmlEn"));
  const contentHtmlAr = sanitizeRichHtml(getTextField(formData, "contentHtmlAr"));

  await prisma.blogPost.create({
    data: {
      slug,
      titleEn,
      titleAr: getTextField(formData, "titleAr"),
      excerptEn: getTextField(formData, "excerptEn"),
      excerptAr: getTextField(formData, "excerptAr"),
      contentHtmlEn,
      contentHtmlAr,
      publishedAt: new Date(getTextField(formData, "publishedAt")),
      coverImage
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/studio");
}

export async function updateBlogPostAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const titleEn = getTextField(formData, "titleEn");
  const slug = await buildUniqueSlug(titleEn, id);
  const currentPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { coverImage: true }
  });
  if (!currentPost) {
    return;
  }

  const coverFile = getFileField(formData, "coverFile");
  let coverImage = currentPost.coverImage || null;
  const contentHtmlEn = sanitizeRichHtml(getTextField(formData, "contentHtmlEn"));
  const contentHtmlAr = sanitizeRichHtml(getTextField(formData, "contentHtmlAr"));

  if (coverFile) {
    const uploadedPath = await saveImageAsWebp(coverFile, "blog");
    if (uploadedPath) {
      if (coverImage) {
        await removeUploadedFile(coverImage);
      }
      coverImage = uploadedPath;
    }
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      slug,
      titleEn,
      titleAr: getTextField(formData, "titleAr"),
      excerptEn: getTextField(formData, "excerptEn"),
      excerptAr: getTextField(formData, "excerptAr"),
      contentHtmlEn,
      contentHtmlAr,
      publishedAt: new Date(getTextField(formData, "publishedAt")),
      coverImage
    }
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/studio");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireStudioAuth();
  const id = getNumberField(formData, "id");
  const currentPost = await prisma.blogPost.findUnique({
    where: { id },
    select: { coverImage: true }
  });
  await prisma.blogPost.delete({ where: { id } });
  await removeUploadedFile(currentPost?.coverImage);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/studio");
}
