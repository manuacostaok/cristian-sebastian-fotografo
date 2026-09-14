import type { MetadataRoute } from "next";
import { getCategories, getProjects, getJournalPosts } from "@/lib/data/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christiansebastian.com";

  const staticRoutes = [
    "",
    "/portfolio",
    "/disponibilidad",
    "/consultar",
    "/presupuesto",
    "/journal",
    "/sobre-mi",
    "/contacto",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const [categories, projects, posts] = await Promise.all([
    getCategories(),
    getProjects(),
    getJournalPosts(),
  ]);

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/portfolio/${c.slug}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${base}/historias/${p.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes, ...postRoutes];
}
