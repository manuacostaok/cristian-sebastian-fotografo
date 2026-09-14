import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BudgetWizard } from "@/components/booking/BudgetWizard";
import { getServices, getExtras } from "@/lib/data/content";
import { getWhatsAppNumber } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Presupuesto",
  description: "Armá una estimación para tu evento en minutos.",
};

export default async function PresupuestoPage() {
  const [services, extras, phoneNumber] = await Promise.all([
    getServices(),
    getExtras(),
    getWhatsAppNumber(),
  ]);

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-3xl">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Presupuesto</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Armemos una estimación</h1>
          <p className="mt-4 text-paper-muted">
            Es orientativo — el presupuesto final siempre se confirma en persona o por WhatsApp.
          </p>
        </header>

        <BudgetWizard services={services} extras={extras} phoneNumber={phoneNumber} />
      </Container>
    </div>
  );
}
