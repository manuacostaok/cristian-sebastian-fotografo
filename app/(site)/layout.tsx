import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { getWhatsAppNumber } from "@/lib/data/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const phoneNumber = await getWhatsAppNumber();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber={phoneNumber} />
    </>
  );
}
