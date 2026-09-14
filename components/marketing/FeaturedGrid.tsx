import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { formatDateLong } from "@/lib/utils";
import type { StoryProject, PortfolioCategory } from "@/lib/types";

const SPANS = [
  "lg:col-span-7 lg:row-span-2 aspect-[4/5]",
  "lg:col-span-5 aspect-[4/3]",
  "lg:col-span-5 aspect-[4/3]",
  "lg:col-span-7 aspect-[16/9]",
];

export function FeaturedGrid({
  projects,
  categories,
}: {
  projects: StoryProject[];
  categories: PortfolioCategory[];
}) {
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container wide>
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl sm:text-4xl">Historias destacadas</h2>
          <Link
            href="/portfolio"
            className="hidden text-[11px] uppercase tracking-[0.16em] text-paper-muted transition-opacity hover:opacity-60 sm:block"
          >
            Ver todo el portfolio
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          {projects.slice(0, 4).map((project, i) => (
            <Link
              key={project.id}
              href={`/historias/${project.slug}`}
              className={`group relative block overflow-hidden aspect-[4/5] ${SPANS[i % SPANS.length]}`}
            >
              <RevealPhoto
                seed={project.coverSeed}
                url={project.coverUrl}
                alt={project.title}
                className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-gold-bright">
                  {categoryName(project.categoryId)}
                </p>
                <h3 className="mt-2 font-display text-2xl text-paper">{project.title}</h3>
                <p className="mt-1 text-xs text-paper/70">
                  {project.location} — {formatDateLong(new Date(project.date))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
