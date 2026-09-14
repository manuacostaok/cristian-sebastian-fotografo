import { Container } from "@/components/ui/Container";
import type { HomeConfigData } from "@/lib/types";

export function StatsBar({ config }: { config: HomeConfigData }) {
  return (
    <section className="border-b border-paper-line bg-paper py-16">
      <Container wide>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          <Stat value={`${config.statsYears}`} label="Años de experiencia" />
          <Stat value={`+${config.statsEvents}`} label="Historias contadas" />
          <Stat value={config.statsLocation} label="Zona de trabajo" small />
          <Stat value={config.statsSpecialty} label="Especialidad" small />
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label, small }: { value: string; label: string; small?: boolean }) {
  return (
    <div>
      <p
        className={
          small
            ? "font-display text-lg leading-snug"
            : "font-display text-4xl leading-none sm:text-5xl"
        }
      >
        {value}
      </p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-paper-muted">
        {label}
      </p>
    </div>
  );
}
