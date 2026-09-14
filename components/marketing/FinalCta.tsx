import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { HomeConfigData } from "@/lib/types";

export function FinalCta({ config }: { config: HomeConfigData }) {
  return (
    <section className="bg-paper py-28 sm:py-36">
      <Container className="text-center">
        <h2 className="mx-auto max-w-xl font-display text-4xl sm:text-5xl">
          {config.ctaFinalTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-paper-muted">{config.ctaFinalText}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/consultar" variant="solid">
            Consultar fecha
          </ButtonLink>
          <ButtonLink href="/presupuesto" variant="outline">
            Armar presupuesto
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
