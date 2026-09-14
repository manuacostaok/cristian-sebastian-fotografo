import { Hero } from "@/components/marketing/Hero";
import { StatsBar } from "@/components/marketing/StatsBar";
import { FeaturedGrid } from "@/components/marketing/FeaturedGrid";
import { UpcomingEvent } from "@/components/marketing/UpcomingEvent";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FinalCta } from "@/components/marketing/FinalCta";
import {
  getHomeConfig,
  getFeaturedProjects,
  getCategories,
  getUpcomingProject,
  getTestimonials,
} from "@/lib/data/content";

export default async function HomePage() {
  const [config, featured, categories, upcoming, testimonials] = await Promise.all([
    getHomeConfig(),
    getFeaturedProjects(),
    getCategories(),
    getUpcomingProject(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero config={config} />
      <StatsBar config={config} />
      <FeaturedGrid projects={featured} categories={categories} />
      <UpcomingEvent project={upcoming} />
      <Testimonials items={testimonials} />
      <FinalCta config={config} />
    </>
  );
}
