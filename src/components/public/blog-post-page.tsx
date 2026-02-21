"use client";

import Link from "next/link";
import Image from "next/image";
import type { BlogPost, SiteSettings } from "@prisma/client";
import { PublicHeader } from "@/components/public/public-header";
import { useLocale } from "@/components/locale-provider";
import { formatDateByLocale, pickByLocale } from "@/lib/locale";

export function BlogPostPage({
  settings,
  post
}: {
  settings: SiteSettings;
  post: BlogPost;
}) {
  const { locale, dir } = useLocale();
  const content = pickByLocale(locale, post.contentHtmlEn, post.contentHtmlAr);

  return (
    <main className="site-shell secondary-page" dir={dir}>
      <PublicHeader ownerNameEn={settings.ownerNameEn} ownerNameAr={settings.ownerNameAr} />

      <section className="section-block top-spacing">
        <article className="container blog-post-single">
          <Link href="/blog" className="back-link">
            {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
          </Link>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={pickByLocale(locale, post.titleEn, post.titleAr)}
              className="blog-post-cover"
              width={1280}
              height={720}
              sizes="(max-width: 900px) 92vw, 860px"
            />
          ) : null}
          <p className="blog-date">{formatDateByLocale(locale, post.publishedAt)}</p>
          <h1>{pickByLocale(locale, post.titleEn, post.titleAr)}</h1>
          <p className="blog-excerpt">{pickByLocale(locale, post.excerptEn, post.excerptAr)}</p>
          <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </section>
    </main>
  );
}
