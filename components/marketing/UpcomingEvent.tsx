import { Container } from "@/components/ui/Container";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { ButtonLink } from "@/components/ui/Button";
import { formatDateLong } from "@/lib/utils";
import type { StoryProject } from "@/lib/types";

export function UpcomingEvent({ project }: { project: StoryProject | null }) {
  if (!project) return null;

  return (
    <section className="bg-ink py-24 text-paper sm:py-32">
      <Container wide>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <RevealPhoto
            seed={project.coverSeed}
            url={project.coverUrl}
            alt={project.title}
            className="aspect-[4/5] w-full lg:aspect-[3/4]"
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-bright">
              Próximamente
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">{project.title}</h2>
            <p className="mt-3 text-sm text-ink-muted">
              {formatDateLong(new Date(project.date))} — {project.location}
            </p>
            <p className="mt-6 max-w-md text-paper/80">{project.description}</p>
            <div className="mt-8">
              <ButtonLink href="/disponibilidad" variant="outline">
                Ver disponibilidad
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
