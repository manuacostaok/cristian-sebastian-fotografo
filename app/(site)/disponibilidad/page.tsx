import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { ButtonLink } from "@/components/ui/Button";
import { getMonthAvailability } from "@/lib/data/availability";

export const metadata: Metadata = {
  title: "Disponibilidad",
  description: "Consultá la disponibilidad de Christian Sebastián para tu evento.",
};

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.y ? parseInt(params.y, 10) : now.getFullYear();
  const month = params.m ? parseInt(params.m, 10) : now.getMonth();

  const availability = await getMonthAvailability(year, month);

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container className="max-w-2xl">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Disponibilidad</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">¿Cuándo es tu fecha?</h1>
          <p className="mt-4 text-paper-muted">
            Elegí un día para consultar. Nunca compartimos información privada de otros
            clientes — solo el estado general del día.
          </p>
        </header>

        <AvailabilityCalendar year={year} month={month} availability={availability} />

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-paper-line pt-8">
          <p className="text-sm text-paper-muted">¿Preferís hablar directamente?</p>
          <ButtonLink href="/consultar" variant="outline">
            Ir al formulario de consulta
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
