import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CategoryNav } from "@/components/portfolio/CategoryNav";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { getCategories, getCategoryBySlug, getProjectsByCategory } from "@/lib/data/content";

type Params = { categoria: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategoryBySlug(categoria);
  if (!category) return {};
  return {
    title: category.name,
    description: `Fotografías de ${category.name.toLowerCase()} por Christian Sebastián.`,
  };
}

export default async function PortfolioCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria } = await params;
  const category = await getCategoryBySlug(categoria);
  if (!category) notFound();

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjectsByCategory(category.id),
  ]);

  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container wide>
        <header className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">Portfolio</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{category.name}</h1>
        </header>

        <CategoryNav categories={categories} activeSlug={category.slug} />
        <div className="mt-12">
          <ProjectGrid projects={projects} categories={categories} />
        </div>
      </Container>
    </div>
  );
}
