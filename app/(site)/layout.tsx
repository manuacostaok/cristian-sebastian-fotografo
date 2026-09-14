import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { PhotographerJsonLd } from "@/components/seo/JsonLd";
import { getWhatsAppNumber, getInstagramUrl } from "@/lib/data/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [phoneNumber, instagramUrl] = await Promise.all([getWhatsAppNumber(), getInstagramUrl()]);

  return (
    <>
      <PhotographerJsonLd instagramUrl={instagramUrl} whatsappNumber={phoneNumber} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber={phoneNumber} />
    </>
  );
}
