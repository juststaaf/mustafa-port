import { BlogPage } from "@/components/public/blog-page";
import { getBlogList } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const posts = await getBlogList();

  if (!settings) {
    return null;
  }

  return <BlogPage settings={settings} posts={posts} />;
}
