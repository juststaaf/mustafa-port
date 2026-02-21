import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/public/blog-post-page";
import { getBlogPostBySlug } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

export default async function BlogSinglePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getBlogPostBySlug(slug)
  ]);

  if (!settings || !post) {
    notFound();
  }

  const safePost = {
    ...post,
    contentHtmlEn: sanitizeRichHtml(post.contentHtmlEn),
    contentHtmlAr: sanitizeRichHtml(post.contentHtmlAr)
  };

  return <BlogPostPage settings={settings} post={safePost} />;
}
