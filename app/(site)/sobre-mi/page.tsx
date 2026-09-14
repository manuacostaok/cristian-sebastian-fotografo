import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Christian Sebastián, fotógrafo en Buenos Aires. Mi enfoque, mi proceso y cómo trabajamos juntos.",
};

const PROCESS = [
  {
    step: "01",
    title: "Consulta",
    text: "Charlamos sobre tu evento: fecha, lugar, estilo y lo que más te importa que quede registrado.",
  },
  {
    step: "02",
    title: "Cobertura",
    text: "El día del evento trabajo para no interrumpir — busco los momentos reales, no los posados forzados.",
  },
  {
    step: "03",
    title: "Selección y edición",
    text: "Curamos juntos las mejores fotos y las edito una por una, cuidando color y detalle.",
  },
  {
    step: "04",
    title: "Entrega",
    text: "Recibís tu galería digital lista para compartir, con opción de álbum impreso.",
  },
];

export default async function SobreMiPage() {
  const zones = await safeQuery(
    () => prisma.workZone.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    [],
  );

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Sobre mí</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">
              Fotógrafo de las cosas que no vuelven a pasar.
            </h1>
            <div className="mt-8 space-y-5 text-paper-muted">
              <p>
                Hace 15 años que fotografío 15 años, cumpleaños de 18, bodas y todo tipo de
                celebraciones en Buenos Aires. Empecé por curiosidad y hoy es lo que más me
                apasiona: estar en el medio de una fiesta, con la cámara, sin que nadie note
                demasiado que estoy ahí.
              </p>
              <p>
                No busco la foto perfecta y fría. Busco la que se siente real — el abrazo, la
                lágrima que se escapa, el salto en la pista. Eso es lo que después se mira una y
                otra vez.
              </p>
              <p>
                Trabajo solo o con un segundo fotógrafo según el evento, y siempre entrego una
                selección curada, no miles de fotos sin editar.
              </p>
            </div>
            <div className="mt-10">
              <ButtonLink href="/consultar" variant="solid">
                Trabajemos juntos
              </ButtonLink>
            </div>
          </div>
          <RevealPhoto seed="sobre-mi" alt="Christian Sebastián" className="aspect-[4/5] w-full" />
        </div>

        <div className="mt-28 border-t border-paper-line pt-20 sm:mt-36">
          <h2 className="font-display text-3xl sm:text-4xl">Cómo trabajamos</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step}>
                <p className="font-display text-3xl text-gold">{p.step}</p>
                <p className="mt-3 font-display text-lg">{p.title}</p>
                <p className="mt-2 text-sm text-paper-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        {zones.length > 0 && (
          <div className="mt-20 border-t border-paper-line pt-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Zonas de cobertura</p>
            <p className="mt-4 max-w-lg text-paper-muted">{zones.map((z) => z.name).join(" · ")}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
