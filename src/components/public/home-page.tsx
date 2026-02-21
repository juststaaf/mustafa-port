"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { BlogPost, Collaboration, Service, SiteSettings, Work } from "@prisma/client";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { IntroOverlay } from "@/components/public/intro-overlay";
import { useLocale } from "@/components/locale-provider";
import { formatDateByLocale, pickByLocale } from "@/lib/locale";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type HomePageProps = {
  settings: SiteSettings;
  services: Service[];
  works: Work[];
  collaborations: Collaboration[];
  posts: BlogPost[];
};

function toInstagramUrl(username: string) {
  if (username.startsWith("http://") || username.startsWith("https://")) {
    return username;
  }
  const cleaned = username.replace(/^@/, "");
  return `https://www.instagram.com/${cleaned}`;
}

function toWhatsAppUrl(phone: string) {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) {
    digits = `964${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}`;
}

function toLinkedInHandle(link: string) {
  try {
    const parsed = new URL(link);
    const cleaned = parsed.pathname.replace(/^\/+|\/+$/g, "");
    return cleaned || "LinkedIn";
  } catch {
    return link;
  }
}

function CountUpValue({
  value,
  prefix = "",
  suffix = ""
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const target = Math.max(0, Math.floor(value));
    const start = performance.now();
    const duration = 1200;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export function HomePage({
  settings,
  services,
  works,
  collaborations,
  posts
}: HomePageProps) {
  const { locale, dir } = useLocale();
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);

  const text = useMemo(
    () => ({
      navWorks: locale === "ar" ? "الأعمال" : "Works",
      navServices: locale === "ar" ? "الخدمات" : "Services",
      navPartners: locale === "ar" ? "التعاونات" : "Collaborations",
      navAbout: locale === "ar" ? "عني" : "About",
      navBlog: locale === "ar" ? "المدونة" : "Blog",
      navContact: locale === "ar" ? "تواصل" : "Contact",
      services: locale === "ar" ? "الخدمات" : "Services",
      collaborations: locale === "ar" ? "تعاونات سابقة" : "Past Collaborations",
      about: pickByLocale(locale, settings.aboutTitleEn, settings.aboutTitleAr),
      blog: locale === "ar" ? "دفتر الملاحظات" : "Notes",
      contact: pickByLocale(locale, settings.contactTitleEn, settings.contactTitleAr),
      readMore: locale === "ar" ? "اقرأ أكثر" : "Read More",
      morePosts: locale === "ar" ? "كل التدوينات" : "All Posts",
      viewCertificates: locale === "ar" ? "عرض الشهادات" : "View Certificates",
      letsWork: pickByLocale(locale, settings.ctaTitleEn, settings.ctaTitleAr),
      quickReply: locale === "ar" ? "عادةً يتم الرد خلال 24 ساعة." : "Usually replies within 24 hours.",
      emailLabel: locale === "ar" ? "البريد الإلكتروني" : "Email",
      phoneLabel: locale === "ar" ? "الهاتف" : "Phone",
      whatsappLabel: "WhatsApp",
      instagramLabel: "Instagram",
      linkedinLabel: "LinkedIn",
      chatNow: locale === "ar" ? "تواصل واتساب" : "Chat on WhatsApp"
    }),
    [locale, settings]
  );

  const heroTitle = pickByLocale(locale, settings.heroTitleEn, settings.heroTitleAr);
  const heroSubtitle = pickByLocale(locale, settings.heroSubtitleEn, settings.heroSubtitleAr);
  const ownerName = pickByLocale(locale, settings.ownerNameEn, settings.ownerNameAr);
  const role = pickByLocale(locale, settings.roleEn, settings.roleAr);
  const aboutBody = pickByLocale(locale, settings.aboutBodyEn, settings.aboutBodyAr);
  const contactBody = pickByLocale(locale, settings.contactBodyEn, settings.contactBodyAr);
  const linkedInHandle = toLinkedInHandle(settings.linkedin);
  const resultItems = useMemo(
    () => [
      {
        key: "campaigns",
        value: settings.resultsCampaigns,
        label: locale === "ar" ? "حملة تسويقية" : "Marketing Campaigns",
        prefix: "+"
      },
      {
        key: "clients",
        value: settings.resultsClients,
        label: locale === "ar" ? "تعاون / عميل" : "Collaborations / Clients"
      },
      {
        key: "active",
        value: settings.resultsActive,
        label: locale === "ar" ? "حملة حالية" : "Active Campaigns"
      },
      {
        key: "experience",
        value: settings.resultsExperience,
        label: locale === "ar" ? "سنوات الخبرة" : "Years of Experience"
      }
    ],
    [locale, settings.resultsActive, settings.resultsCampaigns, settings.resultsClients, settings.resultsExperience]
  );

  const marqueeItems = collaborations.length > 0 ? collaborations : [];
  const marqueeItemsReverse = [...marqueeItems].reverse();

  const getCollaborationStyle = (accentColor: string | null): CSSProperties => ({
    ["--collab-accent" as string]: accentColor || "#00e5ff"
  });

  const getServiceStyle = (index: number): CSSProperties => {
    const palette = ["#00e5ff", "#ff4d8d", "#ff9f1c", "#6ce6a3", "#8aa8ff"];
    return {
      ["--service-accent" as string]: palette[index % palette.length]
    };
  };

  useEffect(() => {
    if (works.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveWorkIndex((prev) => (prev + 1) % works.length);
    }, 4600);

    return () => window.clearInterval(interval);
  }, [works.length]);

  return (
    <main className="site-shell" dir={dir}>
      <IntroOverlay
        ownerNameEn={settings.ownerNameEn}
        ownerNameAr={settings.ownerNameAr}
        roleEn={settings.roleEn}
        roleAr={settings.roleAr}
        audioSrc={settings.introAudioPath}
      />

      <header className="top-nav">
        <div className="container nav-inner">
          <Link href="#hero" className="brand-wordmark">
            {ownerName}
          </Link>
          <nav className="main-nav">
            <a href="#works">{text.navWorks}</a>
            <a href="#services">{text.navServices}</a>
            <a href="#collaborations">{text.navPartners}</a>
            <a href="#about">{text.navAbout}</a>
            <a href="#blog">{text.navBlog}</a>
            <a href="#contact">{text.navContact}</a>
            <Link href="/lets-work-together" className="nav-cta">
              {text.letsWork}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      <section id="hero" className="hero-section">
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="hero-role">{role}</p>
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
            <div className="hero-actions">
              <Link href="/lets-work-together" className="primary-button">
                {text.letsWork}
              </Link>
              <Link href="/certificates" className="ghost-button">
                {text.viewCertificates}
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-portrait-wrap"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {settings.portraitPath ? (
              <div className="hero-portrait-frame">
                <Image
                  src={settings.portraitPath}
                  alt={ownerName}
                  className="hero-portrait"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 35vw"
                />
              </div>
            ) : (
              <div className="hero-portrait placeholder" aria-hidden="true">
                <span>{ownerName}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="results-strip-section" aria-label={locale === "ar" ? "نتائج الأعمال" : "Performance Results"}>
        <div className="container">
          <div className="results-strip">
            {resultItems.map((item, index) => (
              <motion.article
                key={item.key}
                className="result-item"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <p className="result-value">
                  <CountUpValue value={item.value} prefix={item.prefix} />
                </p>
                <p className="result-label">{item.label}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="section-block">
        <div className="featured-slider-shell">
          <div className="featured-slider-track">
            {works.length > 0 ? (
              works.map((work, index) => (
                <motion.article
                  key={work.id}
                  className={`featured-slide ${index === activeWorkIndex ? "is-active" : ""}`}
                  initial={false}
                  animate={{
                    opacity: index === activeWorkIndex ? 1 : 0,
                    scale: index === activeWorkIndex ? 1 : 1.03
                  }}
                  transition={{ duration: 0.95, ease: [0.2, 0.75, 0.2, 1] }}
                >
                  {work.logoPath ? (
                    <Image
                      src={work.logoPath}
                      alt={work.name}
                      className="featured-slide-image"
                      fill
                      priority={index === 0}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="featured-slide-image featured-slide-placeholder" aria-hidden="true" />
                  )}
                  <div className="featured-slide-overlay" />
                  <div className="featured-slide-caption">
                    <span>{work.name}</span>
                  </div>
                </motion.article>
              ))
            ) : (
              <article className="featured-slide is-active">
                <div className="featured-slide-image featured-slide-placeholder" aria-hidden="true" />
              </article>
            )}
          </div>

          {works.length > 1 ? (
            <div className="featured-slider-dots">
              {works.map((work, index) => (
                <button
                  key={work.id}
                  type="button"
                  className={index === activeWorkIndex ? "is-active" : ""}
                  onClick={() => setActiveWorkIndex(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="services" className="section-block">
        <div className="container">
          <h2>{text.services}</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                className="service-card"
                style={getServiceStyle(index)}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -9, scale: 1.01 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.52,
                  delay: index * 0.05,
                  ease: [0.22, 0.7, 0.2, 1]
                }}
              >
                <div className="service-card-head">
                  <span className="service-card-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="service-card-orbit" aria-hidden="true" />
                </div>
                <h3>{pickByLocale(locale, service.titleEn, service.titleAr)}</h3>
                <p>{pickByLocale(locale, service.descriptionEn, service.descriptionAr)}</p>
                <div className="service-card-glow" aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="collaborations" className="section-block collaborations-block">
        <div className="container">
          <h2>{text.collaborations}</h2>

          <div className="collab-marquee-stack">
            <div className="marquee-track">
              <div className="marquee-content">
                {[...marqueeItems, ...marqueeItems].map((item, index) => (
                  <div
                    className="marquee-chip"
                    key={`forward-${item.id}-${index}`}
                    style={getCollaborationStyle(item.accentColor)}
                  >
                    <div className="marquee-chip-inner">
                      <div className="marquee-logo-wrap">
                        {item.logoPath ? (
                          <Image src={item.logoPath} alt={item.name} width={58} height={58} sizes="58px" />
                        ) : (
                          <span>{item.name[0]}</span>
                        )}
                      </div>
                      <span className="marquee-name">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="marquee-track reverse">
              <div className="marquee-content reverse">
                {[...marqueeItemsReverse, ...marqueeItemsReverse].map((item, index) => (
                  <div
                    className="marquee-chip"
                    key={`reverse-${item.id}-${index}`}
                    style={getCollaborationStyle(item.accentColor)}
                  >
                    <div className="marquee-chip-inner">
                      <div className="marquee-logo-wrap">
                        {item.logoPath ? (
                          <Image src={item.logoPath} alt={item.name} width={58} height={58} sizes="58px" />
                        ) : (
                          <span>{item.name[0]}</span>
                        )}
                      </div>
                      <span className="marquee-name">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-block">
        <div className="container about-grid">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>{text.about}</h2>
            <p>{aboutBody}</p>
          </motion.div>
          <motion.div
            className="about-cta-card"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3>{pickByLocale(locale, settings.ctaTitleEn, settings.ctaTitleAr)}</h3>
            <p>{pickByLocale(locale, settings.ctaBodyEn, settings.ctaBodyAr)}</p>
            <Link href="/lets-work-together" className="primary-button">
              {text.letsWork}
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="blog" className="section-block">
        <div className="container">
          <h2>{text.blog}</h2>
          <div className="blog-grid">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="blog-card home-blog-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {post.coverImage ? (
                  <div className="home-blog-cover-frame">
                    <Image
                      src={post.coverImage}
                      alt={pickByLocale(locale, post.titleEn, post.titleAr)}
                      className="blog-cover home-blog-cover"
                      width={960}
                      height={540}
                      sizes="(max-width: 720px) 92vw, (max-width: 1140px) 45vw, 360px"
                    />
                  </div>
                ) : null}
                <p className="blog-date">{formatDateByLocale(locale, post.publishedAt)}</p>
                <h3>{pickByLocale(locale, post.titleEn, post.titleAr)}</h3>
                <p>{pickByLocale(locale, post.excerptEn, post.excerptAr)}</p>
                <Link href={`/blog/${post.slug}`}>{text.readMore}</Link>
              </motion.article>
            ))}
          </div>
          <Link href="/blog" className="ghost-button">
            {text.morePosts}
          </Link>
        </div>
      </section>

      <section id="contact" className="section-block">
        <div className="container contact-grid">
          <div className="contact-copy">
            <h2>{text.contact}</h2>
            <p>{contactBody}</p>
          </div>

          <div className="contact-panel">
            <div className="contact-panel-head">
              <span className="contact-live-dot" aria-hidden="true" />
              <p>{text.quickReply}</p>
            </div>

            <div className="contact-cta-row">
              <Link href="/lets-work-together" className="primary-button">
                {text.letsWork}
              </Link>
              <a href={toWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noreferrer" className="ghost-button">
                {text.chatNow}
              </a>
            </div>

            <div className="contact-links">
              <a href={`mailto:${settings.email}`} className="contact-item">
                <span className="contact-item-label">{text.emailLabel}</span>
                <strong className="contact-item-value">{settings.email}</strong>
                <span className="contact-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href={`tel:${settings.phone}`} className="contact-item">
                <span className="contact-item-label">{text.phoneLabel}</span>
                <strong className="contact-item-value">{settings.phone}</strong>
                <span className="contact-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href={toWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noreferrer" className="contact-item">
                <span className="contact-item-label">{text.whatsappLabel}</span>
                <strong className="contact-item-value">{settings.whatsapp}</strong>
                <span className="contact-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href={toInstagramUrl(settings.instagram)} target="_blank" rel="noreferrer" className="contact-item">
                <span className="contact-item-label">{text.instagramLabel}</span>
                <strong className="contact-item-value">@{settings.instagram.replace(/^@/, "")}</strong>
                <span className="contact-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="contact-item">
                <span className="contact-item-label">{text.linkedinLabel}</span>
                <strong className="contact-item-value">{linkedInHandle}</strong>
                <span className="contact-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
