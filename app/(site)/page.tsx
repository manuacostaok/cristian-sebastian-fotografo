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
      {config.showFeatured && <FeaturedGrid projects={featured} categories={categories} />}
      {config.showUpcoming && <UpcomingEvent project={upcoming} />}
      {config.showTestimonials && <Testimonials items={testimonials} />}
      <FinalCta config={config} />
    </>
  );
}
