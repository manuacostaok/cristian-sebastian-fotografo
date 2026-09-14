const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christiansebastian.com";

/** Photographer/LocalBusiness structured data — helps Google understand the business, not just parse text. */
export function PhotographerJsonLd({
  instagramUrl,
  whatsappNumber,
}: {
  instagramUrl?: string;
  whatsappNumber?: string;
}) {
  const sameAs = [instagramUrl].filter(Boolean) as string[];

  const data = {
    "@context": "https://schema.org",
    "@type": "Photographer",
    name: "Christian Sebastián",
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    description:
      "Fotógrafo profesional en Buenos Aires especializado en 15 años, cumpleaños de 18, eventos y sesiones exteriores.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    ...(sameAs.length > 0 && { sameAs }),
    ...(whatsappNumber && { telephone: `+${whatsappNumber}` }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
