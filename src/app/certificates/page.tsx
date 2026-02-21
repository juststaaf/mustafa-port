import { CertificatesPage } from "@/components/public/certificates-page";
import { getCertificatesList } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CertificatesRoutePage() {
  const [settings, certificates] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getCertificatesList()
  ]);

  if (!settings) {
    return null;
  }

  return <CertificatesPage settings={settings} certificates={certificates} />;
}
