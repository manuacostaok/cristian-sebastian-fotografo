import type { Prisma } from "@prisma/client";
import type {
  PortfolioCategory,
  StoryProject,
  PortfolioPhoto,
  Testimonial,
  ServiceOption,
  ExtraOption,
  JournalPostData,
} from "@/lib/types";

type CategoryRow = Prisma.CategoryGetPayload<{ include: { coverPhoto: true } }>;
type ProjectRow = Prisma.ProjectGetPayload<{ include: { coverPhoto: true; photos: true } }>;
type PhotoRow = Prisma.PhotoGetPayload<Record<string, never>>;
type TestimonialRow = Prisma.TestimonialGetPayload<Record<string, never>>;
type ServiceRow = Prisma.ServiceGetPayload<Record<string, never>>;
type ExtraRow = Prisma.ExtraGetPayload<Record<string, never>>;
type JournalPostRow = Prisma.JournalPostGetPayload<Record<string, never>>;

function aspectFromDimensions(width: number, height: number): PortfolioPhoto["aspect"] {
  const ratio = width / height;
  if (ratio > 1.4) return "wide";
  if (ratio > 1.1) return "landscape";
  if (ratio < 0.85) return "portrait";
  return "square";
}

export function mapPhoto(photo: PhotoRow): PortfolioPhoto {
  return {
    id: photo.id,
    seed: photo.id,
    url: photo.url,
    alt: photo.alt,
    aspect: aspectFromDimensions(photo.width, photo.height),
    categoryId: photo.categoryId ?? "",
    projectId: photo.projectId ?? undefined,
  };
}

export function mapCategory(category: CategoryRow): PortfolioCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    order: category.order,
    active: category.active,
    coverSeed: category.id,
    coverUrl: category.coverPhoto?.url,
  };
}

export function mapProject(project: ProjectRow): StoryProject {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    categoryId: project.categoryId,
    date: (project.date ?? project.createdAt).toISOString().slice(0, 10),
    location: project.location ?? "",
    description: project.description ?? "",
    credits: project.credits ?? undefined,
    featured: project.featured,
    published: project.published,
    coverSeed: project.id,
    coverUrl: project.coverPhoto?.url,
    photos: project.photos.map(mapPhoto),
  };
}

export function mapTestimonial(t: TestimonialRow): Testimonial {
  return {
    id: t.id,
    name: t.name,
    eventLabel: t.eventLabel ?? "",
    text: t.text,
    rating: t.rating ?? undefined,
    featured: t.featured,
  };
}

export function mapService(s: ServiceRow): ServiceOption {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    basePrice: Number(s.basePrice),
    requiresCustomQuote: s.requiresCustomQuote,
    categoryTag: s.categoryTag ?? "",
  };
}

export function mapExtra(e: ExtraRow): ExtraOption {
  return {
    id: e.id,
    name: e.name,
    description: e.description ?? "",
    price: Number(e.price),
  };
}

export function mapJournalPost(p: JournalPostRow): JournalPostData {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.content.slice(0, 160),
    content: p.content,
    coverSeed: p.id,
    coverUrl: p.coverPhotoUrl ?? undefined,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
    tags: p.tags,
  };
}
