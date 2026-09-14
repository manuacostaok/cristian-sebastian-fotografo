import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CategoryNav } from "@/components/portfolio/CategoryNav";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { getCategories, getProjects } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Historias fotografiadas por Christian Sebastián: 15 años, cumpleaños, eventos, exteriores y más.",
};

export default async function PortfolioPage() {
  const [categories, projects] = await Promise.all([getCategories(), getProjects()]);

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container wide>
        <header className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Portfolio</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Cada historia, contada distinto.
          </h1>
        </header>

        <CategoryNav categories={categories} />
        <div className="mt-12">
          <ProjectGrid projects={projects} categories={categories} />
        </div>
      </Container>
    </div>
  );
}
