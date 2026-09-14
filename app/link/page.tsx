import type { Metadata } from "next";
import Link from "next/link";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { getWhatsAppNumber, getInstagramUrl } from "@/lib/data/settings";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Enlaces",
  description: "Todo lo que necesitás de Christian Sebastián en un solo lugar.",
};

const LINKS = [
  { href: "/portfolio", label: "Ver portfolio" },
  { href: "/disponibilidad", label: "Consultar fecha" },
  { href: "/presupuesto", label: "Pedir presupuesto" },
];

export default async function LinkInBioPage() {
  const [phoneNumber, instagramUrl] = await Promise.all([getWhatsAppNumber(), getInstagramUrl()]);
  const whatsappHref = buildWhatsAppLink(generalMessage(), phoneNumber);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 py-16 text-paper">
      <PhotoFrame seed="link-in-bio" className="absolute inset-0 h-full w-full opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-bright">Fotógrafo — Buenos Aires</p>
        <h1 className="mt-3 font-display text-3xl">Christian Sebastián</h1>
        <p className="mt-2 font-display text-base italic text-paper/80">
          Historias que merecen ser recordadas.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-full border border-paper/30 px-6 py-4 text-center text-xs uppercase tracking-[0.14em] transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gold px-6 py-4 text-center text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
          >
            WhatsApp
          </a>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 text-center text-xs uppercase tracking-[0.14em] text-paper/70 transition-colors hover:text-paper"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
