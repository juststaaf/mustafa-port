import type {
  BlogPost,
  Certificate,
  Collaboration,
  Service,
  SiteSettings,
  Work
} from "@prisma/client";
import Image from "next/image";
import {
  createBlogPostAction,
  createCertificateAction,
  createCollaborationAction,
  createServiceAction,
  createWorkAction,
  deleteBlogPostAction,
  deleteCertificateAction,
  deleteCollaborationAction,
  deleteServiceAction,
  deleteWorkAction,
  logoutStudioAction,
  resetBackgroundGradientAction,
  updateBlogPostAction,
  updateCertificateAction,
  updateCollaborationAction,
  updatePasswordAction,
  updateServiceAction,
  updateSiteSettingsAction,
  updateWorkAction
} from "@/app/studio/actions";
import { RichTextEditor } from "@/app/studio/rich-text-editor";
import {
  letsWorkFieldOrder,
  parseLetsWorkContent,
  type LetsWorkContent
} from "@/lib/lets-work-content";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

const letsWorkFieldLabels: Record<keyof LetsWorkContent, string> = {
  title: "Title",
  subtitle: "Subtitle",
  projectBrief: "Project Brief Section",
  scheduleInfo: "Timeline & Budget Section",
  contactInfo: "Contact Details Section",
  fullName: "Full Name Label",
  brandName: "Brand Name Label",
  projectType: "Project Type Label",
  serviceFocus: "Service Focus Label",
  projectDescription: "Project Description Label",
  mainGoal: "Main Goal Label",
  location: "Location Label",
  timeline: "Timeline Label",
  budgetRange: "Budget Label",
  phone: "Phone Label",
  email: "Email Label",
  preferredDate: "Preferred Date Label",
  preferredTime: "Preferred Time Label",
  notes: "Notes Label",
  send: "Submit Button Label",
  sidebarTitle: "Sidebar Title",
  step1: "Sidebar Step 1",
  step2: "Sidebar Step 2",
  step3: "Sidebar Step 3",
  projectTypeOptions: "Project Type Options (one per line)",
  serviceFocusOptions: "Service Focus Options (one per line)",
  timelineOptions: "Timeline Options (one per line)",
  budgetOptions: "Budget Options (one per line)"
};

const letsWorkTextareaFields = new Set<keyof LetsWorkContent>([
  "projectTypeOptions",
  "serviceFocusOptions",
  "timelineOptions",
  "budgetOptions"
]);

type StudioDashboardProps = {
  settings: SiteSettings;
  services: Service[];
  works: Work[];
  collaborations: Collaboration[];
  certificates: Certificate[];
  posts: BlogPost[];
};

export function StudioDashboard({
  settings,
  services,
  works,
  collaborations,
  certificates,
  posts
}: StudioDashboardProps) {
  const letsWorkTextEn = parseLetsWorkContent(settings.letsWorkContentEn, "en");
  const letsWorkTextAr = parseLetsWorkContent(settings.letsWorkContentAr, "ar");

  return (
    <div className="studio-shell">
      <header className="studio-header">
        <div>
          <h1>Studio Dashboard</h1>
          <p>Manage full portfolio content and visual assets from one panel.</p>
        </div>
        <form action={logoutStudioAction}>
          <button type="submit" className="danger">
            Logout
          </button>
        </form>
      </header>

      <details open className="studio-section">
        <summary>Global Content Settings</summary>
        <form action={updateSiteSettingsAction} className="studio-grid-form">
          <label>
            Site Name EN
            <input name="siteNameEn" defaultValue={settings.siteNameEn} required />
          </label>
          <label>
            Site Name AR
            <input name="siteNameAr" defaultValue={settings.siteNameAr} required />
          </label>
          <label>
            Owner EN
            <input name="ownerNameEn" defaultValue={settings.ownerNameEn} required />
          </label>
          <label>
            Owner AR
            <input name="ownerNameAr" defaultValue={settings.ownerNameAr} required />
          </label>
          <label>
            Role EN
            <input name="roleEn" defaultValue={settings.roleEn} required />
          </label>
          <label>
            Role AR
            <input name="roleAr" defaultValue={settings.roleAr} required />
          </label>
          <label>
            Hero Title EN
            <input name="heroTitleEn" defaultValue={settings.heroTitleEn} required />
          </label>
          <label>
            Hero Title AR
            <input name="heroTitleAr" defaultValue={settings.heroTitleAr} required />
          </label>
          <label>
            Hero Subtitle EN
            <input name="heroSubtitleEn" defaultValue={settings.heroSubtitleEn} required />
          </label>
          <label>
            Hero Subtitle AR
            <input name="heroSubtitleAr" defaultValue={settings.heroSubtitleAr} required />
          </label>
          <label>
            About Title EN
            <input name="aboutTitleEn" defaultValue={settings.aboutTitleEn} required />
          </label>
          <label>
            About Title AR
            <input name="aboutTitleAr" defaultValue={settings.aboutTitleAr} required />
          </label>
          <label className="full">
            About Body EN
            <textarea name="aboutBodyEn" defaultValue={settings.aboutBodyEn} rows={4} required />
          </label>
          <label className="full">
            About Body AR
            <textarea name="aboutBodyAr" defaultValue={settings.aboutBodyAr} rows={4} required />
          </label>
          <label>
            Contact Title EN
            <input name="contactTitleEn" defaultValue={settings.contactTitleEn} required />
          </label>
          <label>
            Contact Title AR
            <input name="contactTitleAr" defaultValue={settings.contactTitleAr} required />
          </label>
          <label className="full">
            Contact Body EN
            <textarea name="contactBodyEn" defaultValue={settings.contactBodyEn} rows={3} required />
          </label>
          <label className="full">
            Contact Body AR
            <textarea name="contactBodyAr" defaultValue={settings.contactBodyAr} rows={3} required />
          </label>
          <label>
            CTA Title EN
            <input name="ctaTitleEn" defaultValue={settings.ctaTitleEn} required />
          </label>
          <label>
            CTA Title AR
            <input name="ctaTitleAr" defaultValue={settings.ctaTitleAr} required />
          </label>
          <label className="full">
            CTA Body EN
            <textarea name="ctaBodyEn" defaultValue={settings.ctaBodyEn} rows={3} required />
          </label>
          <label className="full">
            CTA Body AR
            <textarea name="ctaBodyAr" defaultValue={settings.ctaBodyAr} rows={3} required />
          </label>
          <label>
            Results: Campaigns
            <input type="number" min={0} name="resultsCampaigns" defaultValue={settings.resultsCampaigns} required />
          </label>
          <label>
            Results: Collaborations / Clients
            <input type="number" min={0} name="resultsClients" defaultValue={settings.resultsClients} required />
          </label>
          <label>
            Results: Active Campaigns
            <input type="number" min={0} name="resultsActive" defaultValue={settings.resultsActive} required />
          </label>
          <label>
            Results: Experience Years
            <input type="number" min={0} name="resultsExperience" defaultValue={settings.resultsExperience} required />
          </label>
          <p className="field-title full">Background Gradient Colors</p>
          <label>
            Glow Color 1
            <input type="color" name="backgroundGlow1" defaultValue={settings.backgroundGlow1} />
          </label>
          <label>
            Glow Color 2
            <input type="color" name="backgroundGlow2" defaultValue={settings.backgroundGlow2} />
          </label>
          <label>
            Glow Color 3
            <input type="color" name="backgroundGlow3" defaultValue={settings.backgroundGlow3} />
          </label>
          <label>
            Base Color 1
            <input type="color" name="backgroundBase1" defaultValue={settings.backgroundBase1} />
          </label>
          <label>
            Base Color 2
            <input type="color" name="backgroundBase2" defaultValue={settings.backgroundBase2} />
          </label>
          <label>
            Base Color 3
            <input type="color" name="backgroundBase3" defaultValue={settings.backgroundBase3} />
          </label>
          <p className="field-title full">Let&apos;s Work Page Texts EN</p>
          {letsWorkFieldOrder.map((key) => (
            <label key={`lw-en-${key}`} className={letsWorkTextareaFields.has(key) ? "full" : undefined}>
              {letsWorkFieldLabels[key]}
              {letsWorkTextareaFields.has(key) ? (
                <textarea
                  name={`lw_${key}_en`}
                  defaultValue={letsWorkTextEn[key]}
                  rows={4}
                  required
                />
              ) : (
                <input
                  name={`lw_${key}_en`}
                  defaultValue={letsWorkTextEn[key]}
                  required
                />
              )}
            </label>
          ))}
          <p className="field-title full">Let&apos;s Work Page Texts AR</p>
          {letsWorkFieldOrder.map((key) => (
            <label key={`lw-ar-${key}`} className={letsWorkTextareaFields.has(key) ? "full" : undefined}>
              {letsWorkFieldLabels[key]}
              {letsWorkTextareaFields.has(key) ? (
                <textarea
                  name={`lw_${key}_ar`}
                  defaultValue={letsWorkTextAr[key]}
                  rows={4}
                  required
                />
              ) : (
                <input
                  name={`lw_${key}_ar`}
                  defaultValue={letsWorkTextAr[key]}
                  required
                />
              )}
            </label>
          ))}
          <label>
            Email
            <input type="email" name="email" defaultValue={settings.email} required />
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={settings.phone} required />
          </label>
          <label>
            WhatsApp
            <input name="whatsapp" defaultValue={settings.whatsapp} required />
          </label>
          <label>
            Instagram Username
            <input name="instagram" defaultValue={settings.instagram} required />
          </label>
          <label className="full">
            LinkedIn URL
            <input name="linkedin" defaultValue={settings.linkedin} required />
          </label>
          <label className="full">
            Intro Audio Path
            <input name="introAudioPath" defaultValue={settings.introAudioPath || ""} />
          </label>
          <label className="full">
            Portrait Image (JPG/PNG to WebP)
            <input type="file" name="portraitFile" accept="image/*" />
          </label>
          <input type="hidden" name="portraitPath" value={settings.portraitPath || ""} />
          <button type="submit" className="primary full">
            Save Global Settings
          </button>
        </form>
        <form action={resetBackgroundGradientAction} className="studio-grid-form compact">
          <button type="submit" className="danger">
            Reset Default Background Gradient
          </button>
        </form>
      </details>

      <details className="studio-section">
        <summary>Security</summary>
        <form action={updatePasswordAction} className="studio-grid-form compact">
          <label>
            Current Password
            <input name="currentPassword" type="password" required />
          </label>
          <label>
            New Password
            <input name="newPassword" type="password" minLength={8} required />
          </label>
          <button type="submit" className="primary">
            Change Password
          </button>
        </form>
      </details>

      <details className="studio-section">
        <summary>Services</summary>
        <form action={createServiceAction} className="studio-grid-form compact">
          <label>
            Title EN
            <input name="titleEn" required />
          </label>
          <label>
            Title AR
            <input name="titleAr" required />
          </label>
          <label>
            Description EN
            <input name="descriptionEn" required />
          </label>
          <label>
            Description AR
            <input name="descriptionAr" required />
          </label>
          <label>
            Order
            <input name="displayOrder" type="number" defaultValue={services.length + 1} />
          </label>
          <button type="submit" className="primary">
            Add Service
          </button>
        </form>

        <div className="studio-list">
          {services.map((service) => (
            <form key={service.id} className="studio-item-row">
              <input type="hidden" name="id" value={service.id} />
              <input name="titleEn" defaultValue={service.titleEn} required />
              <input name="titleAr" defaultValue={service.titleAr} required />
              <input name="descriptionEn" defaultValue={service.descriptionEn} required />
              <input name="descriptionAr" defaultValue={service.descriptionAr} required />
              <input name="displayOrder" type="number" defaultValue={service.displayOrder} />
              <button type="submit" formAction={updateServiceAction}>
                Update
              </button>
              <button type="submit" formAction={deleteServiceAction} className="danger">
                Delete
              </button>
            </form>
          ))}
        </div>
      </details>

      <details className="studio-section">
        <summary>Works</summary>
        <form action={createWorkAction} className="studio-grid-form compact">
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Order
            <input name="displayOrder" type="number" defaultValue={works.length + 1} />
          </label>
          <label>
            Logo
            <input type="file" name="logoFile" accept="image/*" />
          </label>
          <button type="submit" className="primary">
            Add Work
          </button>
        </form>

        <div className="studio-list">
          {works.map((work) => (
            <form
              key={work.id}
              className="studio-item-row with-image"
            >
              {work.logoPath ? (
                <Image src={work.logoPath} alt={work.name} className="thumb" width={50} height={50} sizes="50px" />
              ) : (
                <span className="thumb empty">N/A</span>
              )}
              <input type="hidden" name="id" value={work.id} />
              <input type="hidden" name="existingLogoPath" value={work.logoPath || ""} />
              <input name="name" defaultValue={work.name} required />
              <input name="displayOrder" type="number" defaultValue={work.displayOrder} />
              <input type="file" name="logoFile" accept="image/*" />
              <button type="submit" formAction={updateWorkAction}>
                Update
              </button>
              <button type="submit" formAction={deleteWorkAction} className="danger">
                Delete
              </button>
            </form>
          ))}
        </div>
      </details>

      <details className="studio-section">
        <summary>Collaborations</summary>
        <form
          action={createCollaborationAction}
          className="studio-grid-form compact"
        >
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Order
            <input name="displayOrder" type="number" defaultValue={collaborations.length + 1} />
          </label>
          <label>
            Logo
            <input type="file" name="logoFile" accept="image/*" />
          </label>
          <label>
            Accent Color
            <input type="color" name="accentColor" defaultValue="#00e5ff" />
          </label>
          <button type="submit" className="primary">
            Add Collaboration
          </button>
        </form>

        <div className="studio-list">
          {collaborations.map((collaboration) => (
            <form
              key={collaboration.id}
              className="studio-item-row with-image"
            >
              {collaboration.logoPath ? (
                <Image
                  src={collaboration.logoPath}
                  alt={collaboration.name}
                  className="thumb"
                  width={50}
                  height={50}
                  sizes="50px"
                />
              ) : (
                <span className="thumb empty">N/A</span>
              )}
              <input type="hidden" name="id" value={collaboration.id} />
              <input type="hidden" name="existingLogoPath" value={collaboration.logoPath || ""} />
              <input name="name" defaultValue={collaboration.name} required />
              <input name="displayOrder" type="number" defaultValue={collaboration.displayOrder} />
              <input type="file" name="logoFile" accept="image/*" />
              <input
                type="color"
                name="accentColor"
                defaultValue={collaboration.accentColor || "#00e5ff"}
              />
              <button type="submit" formAction={updateCollaborationAction}>
                Update
              </button>
              <button type="submit" formAction={deleteCollaborationAction} className="danger">
                Delete
              </button>
            </form>
          ))}
        </div>
      </details>

      <details className="studio-section">
        <summary>Certificates</summary>
        <form
          action={createCertificateAction}
          className="studio-grid-form compact"
        >
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Issuer
            <input name="issuer" required />
          </label>
          <label>
            Issue Date
            <input name="issuedAt" type="date" required />
          </label>
          <label>
            Order
            <input name="displayOrder" type="number" defaultValue={certificates.length + 1} />
          </label>
          <label className="full">
            Description
            <textarea name="description" rows={3} />
          </label>
          <label>
            Certificate Image
            <input type="file" name="imageFile" accept="image/*" />
          </label>
          <button type="submit" className="primary">
            Add Certificate
          </button>
        </form>

        <div className="studio-list">
          {certificates.map((certificate) => (
            <form
              key={certificate.id}
              className="studio-item-row vertical with-image"
            >
              <div className="item-top-row">
                {certificate.imagePath ? (
                  <Image
                    src={certificate.imagePath}
                    alt={certificate.title}
                    className="thumb"
                    width={50}
                    height={50}
                    sizes="50px"
                  />
                ) : (
                  <span className="thumb empty">N/A</span>
                )}
                <input type="hidden" name="id" value={certificate.id} />
                <input type="hidden" name="existingImagePath" value={certificate.imagePath || ""} />
                <input name="title" defaultValue={certificate.title} required />
                <input name="issuer" defaultValue={certificate.issuer} required />
                <input
                  name="issuedAt"
                  type="date"
                  defaultValue={toDateInputValue(certificate.issuedAt)}
                  required
                />
                <input
                  name="displayOrder"
                  type="number"
                  defaultValue={certificate.displayOrder}
                />
                <input type="file" name="imageFile" accept="image/*" />
              </div>
              <textarea name="description" rows={3} defaultValue={certificate.description || ""} />
              <div className="row-actions">
                <button type="submit" formAction={updateCertificateAction}>
                  Update
                </button>
                <button type="submit" formAction={deleteCertificateAction} className="danger">
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </details>

      <details className="studio-section">
        <summary>Blog</summary>
        <form action={createBlogPostAction} className="studio-grid-form">
          <label>
            Title EN
            <input name="titleEn" required />
          </label>
          <label>
            Title AR
            <input name="titleAr" required />
          </label>
          <label>
            Excerpt EN
            <textarea name="excerptEn" rows={2} required />
          </label>
          <label>
            Excerpt AR
            <textarea name="excerptAr" rows={2} required />
          </label>
          <label>
            Publish Date
            <input name="publishedAt" type="date" required />
          </label>
          <label>
            Cover
            <input type="file" name="coverFile" accept="image/*" />
          </label>
          <div className="full">
            <p className="field-title">Content EN (Rich Editor)</p>
            <RichTextEditor name="contentHtmlEn" />
          </div>
          <div className="full">
            <p className="field-title">Content AR (Rich Editor)</p>
            <RichTextEditor name="contentHtmlAr" />
          </div>
          <button type="submit" className="primary full">
            Add Blog Post
          </button>
        </form>

        <div className="studio-list">
          {posts.map((post) => (
            <form key={post.id} className="studio-item-row vertical">
              <div className="item-top-row">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.titleEn} className="thumb" width={50} height={50} sizes="50px" />
                ) : (
                  <span className="thumb empty">N/A</span>
                )}
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="existingCoverImage" value={post.coverImage || ""} />
                <input name="titleEn" defaultValue={post.titleEn} required />
                <input name="titleAr" defaultValue={post.titleAr} required />
                <input
                  name="publishedAt"
                  type="date"
                  defaultValue={toDateInputValue(post.publishedAt)}
                  required
                />
                <input type="file" name="coverFile" accept="image/*" />
              </div>
              <textarea name="excerptEn" rows={2} defaultValue={post.excerptEn} required />
              <textarea name="excerptAr" rows={2} defaultValue={post.excerptAr} required />
              <div className="full">
                <p className="field-title">Content EN</p>
                <RichTextEditor name="contentHtmlEn" defaultValue={post.contentHtmlEn} />
              </div>
              <div className="full">
                <p className="field-title">Content AR</p>
                <RichTextEditor name="contentHtmlAr" defaultValue={post.contentHtmlAr} />
              </div>
              <div className="row-actions">
                <button type="submit" formAction={updateBlogPostAction}>
                  Update
                </button>
                <button type="submit" formAction={deleteBlogPostAction} className="danger">
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </details>
    </div>
  );
}
