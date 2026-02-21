import { WorkTogetherPage } from "@/components/public/work-together-page";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LetsWorkTogetherPageRoute() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    return null;
  }

  return <WorkTogetherPage settings={settings} />;
}
