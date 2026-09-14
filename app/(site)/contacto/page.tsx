import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { buildWhatsAppLink, generalMessage } from "@/lib/whatsapp";
import { getWhatsAppNumber, getInstagramUrl } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Hablemos sobre tu evento.",
};

export default async function ContactoPage() {
  const [phoneNumber, instagramUrlSetting] = await Promise.all([getWhatsAppNumber(), getInstagramUrl()]);
  const whatsappHref = buildWhatsAppLink(generalMessage(), phoneNumber);
  const instagramUrl = instagramUrlSetting || "https://instagram.com/christiansebastianfotografo";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hola@christiansebastian.com";

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Contacto</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Hablemos</h1>
        <p className="mt-4 max-w-md text-paper-muted">
          La forma más rápida de recibir una respuesta es por WhatsApp. También podés
          escribirme por Instagram o email.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <ContactCard
            icon={<MessageCircle size={20} strokeWidth={1.5} />}
            label="WhatsApp"
            href={whatsappHref}
          />
          <ContactCard icon={<InstagramIcon />} label="Instagram" href={instagramUrl} />
          <ContactCard icon={<Mail size={20} strokeWidth={1.5} />} label="Email" href={`mailto:${email}`} />
        </div>

        <div className="mt-14 border-t border-paper-line pt-10">
          <ButtonLink href="/consultar" variant="solid">
            Ir al formulario de consulta
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ContactCard({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-start gap-4 border border-paper-line p-6 transition-colors hover:border-ink/40"
    >
      {icon}
      <span className="text-sm uppercase tracking-[0.1em]">{label}</span>
    </a>
  );
}
