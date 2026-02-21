"use client";

import { useMemo, useState } from "react";
import type { SiteSettings } from "@prisma/client";
import { PublicHeader } from "@/components/public/public-header";
import { useLocale } from "@/components/locale-provider";
import { parseLetsWorkContent, parseOptionsText } from "@/lib/lets-work-content";

type FormState = {
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
};

const initialFormState: FormState = {
  fullName: "",
  brandName: "",
  projectType: "",
  serviceFocus: "",
  projectDescription: "",
  mainGoal: "",
  location: "",
  timeline: "",
  budgetRange: "",
  phone: "",
  email: "",
  preferredDate: "",
  preferredTime: "",
  notes: ""
};

function buildMailBody(locale: "en" | "ar", state: FormState) {
  if (locale === "ar") {
    return [
      "ط·ظ„ط¨ طھط¹ط§ظˆظ† ط¬ط¯ظٹط¯ - Let's Work Together",
      "",
      "1) ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ظ…ط´ط±ظˆط¹",
      `ط§ظ„ط§ط³ظ…: ${state.fullName}`,
      `ط§ط³ظ… ط§ظ„ط¹ظ„ط§ظ…ط©/ط§ظ„ط´ط±ظƒط©: ${state.brandName}`,
      `ظ†ظˆط¹ ط§ظ„ظ…ط´ط±ظˆط¹: ${state.projectType}`,
      `ط§ظ„ط®ط¯ظ…ط© ط§ظ„ظ…ط·ظ„ظˆط¨ط©: ${state.serviceFocus}`,
      `ظˆطµظپ ط§ظ„ظ…ط´ط±ظˆط¹: ${state.projectDescription}`,
      `ط§ظ„ظ‡ط¯ظپ ط§ظ„ط±ط¦ظٹط³ظٹ: ${state.mainGoal}`,
      "",
      "2) ط§ظ„ط¬ط¯ظˆظ„ ظˆط§ظ„ظ…ظٹط²ط§ظ†ظٹط©",
      `ط§ظ„ظ…ظˆظ‚ط¹: ${state.location}`,
      `ط§ظ„ط¬ط¯ظˆظ„ ط§ظ„ط²ظ…ظ†ظٹ: ${state.timeline}`,
      `ط§ظ„ظ…ظٹط²ط§ظ†ظٹط© ط§ظ„طھظ‚ط¯ظٹط±ظٹط©: ${state.budgetRange}`,
      `ط§ظ„طھط§ط±ظٹط® ط§ظ„ظ…ظ‚طھط±ط­: ${state.preferredDate}`,
      `ط§ظ„ظˆظ‚طھ ط§ظ„ظ…ظ‚طھط±ط­: ${state.preferredTime}`,
      "",
      "3) ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„طھظˆط§طµظ„",
      `ط§ظ„ظ‡ط§طھظپ: ${state.phone}`,
      `ط§ظ„ط§ظٹظ…ظٹظ„: ${state.email}`,
      "",
      `ظ…ظ„ط§ط­ط¸ط§طھ ط¥ط¶ط§ظپظٹط©: ${state.notes || "-"}`
    ].join("\n");
  }

  return [
    "New Collaboration Request - Let's Work Together",
    "",
    "1) Project Brief",
    `Full Name: ${state.fullName}`,
    `Brand/Company: ${state.brandName}`,
    `Project Type: ${state.projectType}`,
    `Service Focus: ${state.serviceFocus}`,
    `Project Description: ${state.projectDescription}`,
    `Primary Goal: ${state.mainGoal}`,
    "",
    "2) Timeline & Budget",
    `Location: ${state.location}`,
    `Timeline: ${state.timeline}`,
    `Estimated Budget: ${state.budgetRange}`,
    `Preferred Date: ${state.preferredDate}`,
    `Preferred Time: ${state.preferredTime}`,
    "",
    "3) Contact Details",
    `Phone: ${state.phone}`,
    `Email: ${state.email}`,
    "",
    `Additional Notes: ${state.notes || "-"}`
  ].join("\n");
}

export function WorkTogetherPage({ settings }: { settings: SiteSettings }) {
  const { locale, dir } = useLocale();
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const text = useMemo(
    () =>
      locale === "ar"
        ? parseLetsWorkContent(settings.letsWorkContentAr, "ar")
        : parseLetsWorkContent(settings.letsWorkContentEn, "en"),
    [locale, settings.letsWorkContentAr, settings.letsWorkContentEn]
  );

  const projectTypeOptions = useMemo(() => parseOptionsText(text.projectTypeOptions), [text.projectTypeOptions]);
  const serviceFocusOptions = useMemo(() => parseOptionsText(text.serviceFocusOptions), [text.serviceFocusOptions]);
  const timelineOptions = useMemo(() => parseOptionsText(text.timelineOptions), [text.timelineOptions]);
  const budgetOptions = useMemo(() => parseOptionsText(text.budgetOptions), [text.budgetOptions]);

  return (
    <main className="site-shell secondary-page" dir={dir}>
      <PublicHeader ownerNameEn={settings.ownerNameEn} ownerNameAr={settings.ownerNameAr} />

      <section className="section-block top-spacing">
        <div className="container page-heading">
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </section>

      <section className="section-block">
        <div className="container booking-layout">
          <aside className="booking-aside">
            <h3>{text.sidebarTitle}</h3>
            <ol>
              <li>{text.step1}</li>
              <li>{text.step2}</li>
              <li>{text.step3}</li>
            </ol>
            <p>{settings.email}</p>
          </aside>

          <div className="booking-wrap">
            <form
              className="booking-form"
              onSubmit={(event) => {
                event.preventDefault();
                const subject =
                  locale === "ar"
                    ? `ط·ظ„ط¨ طھط¹ط§ظˆظ† ط¬ط¯ظٹط¯ - ${formState.projectType || "Letâ€™s Work Together"}`
                    : `New Collaboration Request - ${formState.projectType || "Let's Work Together"}`;
                const body = buildMailBody(locale, formState);
                const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(settings.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="booking-section-title full-span">{text.projectBrief}</p>

              <label>
                {text.fullName}
                <input
                  required
                  value={formState.fullName}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </label>

              <label>
                {text.brandName}
                <input
                  required
                  value={formState.brandName}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, brandName: event.target.value }))
                  }
                />
              </label>

              <label>
                {text.projectType}
                <select
                  required
                  value={formState.projectType}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, projectType: event.target.value }))
                  }
                >
                  <option value="">{locale === "ar" ? "ط§ط®طھط± ظ†ظˆط¹ ط§ظ„ظ…ط´ط±ظˆط¹" : "Select project type"}</option>
                  {projectTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {text.serviceFocus}
                <select
                  required
                  value={formState.serviceFocus}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, serviceFocus: event.target.value }))
                  }
                >
                  <option value="">
                    {locale === "ar" ? "ط§ط®طھط± ط§ظ„ط®ط¯ظ…ط© ط§ظ„ط£ط³ط§ط³ظٹط©" : "Select service focus"}
                  </option>
                  {serviceFocusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full-span">
                {text.projectDescription}
                <textarea
                  required
                  rows={5}
                  value={formState.projectDescription}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      projectDescription: event.target.value
                    }))
                  }
                />
              </label>

              <label className="full-span">
                {text.mainGoal}
                <input
                  required
                  value={formState.mainGoal}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, mainGoal: event.target.value }))
                  }
                />
              </label>

              <p className="booking-section-title full-span">{text.scheduleInfo}</p>

              <label>
                {text.location}
                <input
                  required
                  value={formState.location}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, location: event.target.value }))
                  }
                />
              </label>

              <label>
                {text.timeline}
                <select
                  required
                  value={formState.timeline}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, timeline: event.target.value }))
                  }
                >
                  <option value="">{locale === "ar" ? "ط§ط®طھط± ط§ظ„ط¥ط·ط§ط± ط§ظ„ط²ظ…ظ†ظٹ" : "Select timeline"}</option>
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {text.budgetRange}
                <select
                  required
                  value={formState.budgetRange}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, budgetRange: event.target.value }))
                  }
                >
                  <option value="">{locale === "ar" ? "ط§ط®طھط± ط§ظ„ظ…ظٹط²ط§ظ†ظٹط©" : "Select budget range"}</option>
                  {budgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {text.preferredDate}
                <input
                  type="date"
                  value={formState.preferredDate}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, preferredDate: event.target.value }))
                  }
                />
              </label>

              <label>
                {text.preferredTime}
                <input
                  type="time"
                  value={formState.preferredTime}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, preferredTime: event.target.value }))
                  }
                />
              </label>

              <p className="booking-section-title full-span">{text.contactInfo}</p>

              <label>
                {text.phone}
                <input
                  required
                  value={formState.phone}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </label>

              <label>
                {text.email}
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </label>

              <label className="full-span">
                {text.notes}
                <textarea
                  rows={3}
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, notes: event.target.value }))
                  }
                />
              </label>

              <button type="submit" className="primary-button full-span">
                {text.send}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

