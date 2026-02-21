"use client";

import Image from "next/image";
import type { Certificate, SiteSettings } from "@prisma/client";
import { PublicHeader } from "@/components/public/public-header";
import { useLocale } from "@/components/locale-provider";
import { formatDateByLocale } from "@/lib/locale";

export function CertificatesPage({
  settings,
  certificates
}: {
  settings: SiteSettings;
  certificates: Certificate[];
}) {
  const { locale, dir } = useLocale();

  return (
    <main className="site-shell secondary-page" dir={dir}>
      <PublicHeader ownerNameEn={settings.ownerNameEn} ownerNameAr={settings.ownerNameAr} />

      <section className="section-block top-spacing">
        <div className="container page-heading">
          <h1>{locale === "ar" ? "الشهادات" : "Certificates"}</h1>
          <p>
            {locale === "ar"
              ? "محطات تعلم وتطوير عززت مساري في التسويق والإخراج الفني."
              : "Milestones that shaped my marketing and art direction process."}
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="container certificates-timeline">
          {certificates.map((certificate) => (
            <article key={certificate.id} className="certificate-item">
              <p className="certificate-date">{formatDateByLocale(locale, certificate.issuedAt)}</p>
              <h2>{certificate.title}</h2>
              <h3>{certificate.issuer}</h3>
              {certificate.description ? <p>{certificate.description}</p> : null}
              {certificate.imagePath ? (
                <Image
                  src={certificate.imagePath}
                  alt={certificate.title}
                  className="certificate-image"
                  width={640}
                  height={400}
                  sizes="(max-width: 720px) 92vw, 320px"
                />
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
