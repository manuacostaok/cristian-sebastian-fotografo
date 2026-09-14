import Link from "next/link";
import { RevealPhoto } from "@/components/ui/RevealPhoto";
import { formatDateLong } from "@/lib/utils";
import type { StoryProject, PortfolioCategory } from "@/lib/types";

const SPANS = [
  "lg:col-span-6 aspect-[4/5]",
  "lg:col-span-6 aspect-[4/5]",
  "lg:col-span-4 aspect-[3/4]",
  "lg:col-span-4 aspect-[3/4]",
  "lg:col-span-4 aspect-[3/4]",
];

export function ProjectGrid({
  projects,
  categories,
}: {
  projects: StoryProject[];
  categories: PortfolioCategory[];
}) {
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  if (projects.length === 0) {
    return (
      <p className="py-24 text-center text-paper-muted">
        Todavía no hay historias publicadas en esta categoría.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`/historias/${project.slug}`}
          className={`group relative block overflow-hidden ${SPANS[i % SPANS.length]}`}
        >
          <RevealPhoto
            seed={project.coverSeed}
            url={project.coverUrl}
            alt={project.title}
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gold-bright">
              {categoryName(project.categoryId)}
            </p>
            <h3 className="mt-1.5 font-display text-xl text-paper">{project.title}</h3>
            <p className="mt-1 text-xs text-paper/70">
              {formatDateLong(new Date(project.date))}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
