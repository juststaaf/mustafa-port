import { prisma } from "@/lib/prisma";

export async function getSiteData() {
  const [settings, services, works, collaborations, posts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.service.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.work.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.collaboration.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      take: 4
    })
  ]);

  return { settings, services, works, collaborations, posts };
}

export async function getBlogList() {
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" }
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getCertificatesList() {
  return prisma.certificate.findMany({
    orderBy: [{ issuedAt: "desc" }, { displayOrder: "asc" }]
  });
}
