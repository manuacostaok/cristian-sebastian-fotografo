import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InquiryForm } from "@/components/booking/InquiryForm";
import { getWhatsAppNumber } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Consultar fecha",
  description: "Consultá disponibilidad para tu evento con Christian Sebastián.",
};

export default async function ConsultarPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const { fecha } = await searchParams;
  const phoneNumber = await getWhatsAppNumber();

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-2xl">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Consultar fecha</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Contame sobre tu evento</h1>
          <p className="mt-4 text-paper-muted">
            Completá el formulario y te respondemos a la brevedad, o si preferís, seguí
            directo por WhatsApp desde el botón flotante.
          </p>
        </header>

        <InquiryForm defaultDate={fecha} phoneNumber={phoneNumber} />
      </Container>
    </div>
  );
}
