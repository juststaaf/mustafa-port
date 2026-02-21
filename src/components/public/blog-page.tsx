"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogPost, SiteSettings } from "@prisma/client";
import { PublicHeader } from "@/components/public/public-header";
import { useLocale } from "@/components/locale-provider";
import { formatDateByLocale, pickByLocale } from "@/lib/locale";

export function BlogPage({ settings, posts }: { settings: SiteSettings; posts: BlogPost[] }) {
  const { locale, dir } = useLocale();

  return (
    <main className="site-shell secondary-page" dir={dir}>
      <PublicHeader ownerNameEn={settings.ownerNameEn} ownerNameAr={settings.ownerNameAr} />

      <section className="section-block top-spacing">
        <div className="container page-heading">
          <h1>{locale === "ar" ? "مدونة الأفكار المجنونة" : "Wild Ideas Journal"}</h1>
          <p>
            {locale === "ar"
              ? "أفكار سريعة، زوايا غير متوقعة، ورؤية فنية للتسويق."
              : "Unfiltered thoughts, strange angles, and artistic strategy notes."}
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="container blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card expanded blog-page-card">
              {post.coverImage ? (
                <div className="blog-page-cover-frame">
                  <Image
                    src={post.coverImage}
                    alt={pickByLocale(locale, post.titleEn, post.titleAr)}
                    className="blog-cover blog-page-cover"
                    width={960}
                    height={540}
                    sizes="(max-width: 720px) 92vw, (max-width: 1140px) 45vw, 360px"
                  />
                </div>
              ) : null}
              <p className="blog-date">{formatDateByLocale(locale, post.publishedAt)}</p>
              <h2>{pickByLocale(locale, post.titleEn, post.titleAr)}</h2>
              <p>{pickByLocale(locale, post.excerptEn, post.excerptAr)}</p>
              <Link href={`/blog/${post.slug}`}>{locale === "ar" ? "فتح التدوينة" : "Open Post"}</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
