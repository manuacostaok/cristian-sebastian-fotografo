export type PhotoAspect = "portrait" | "landscape" | "square" | "wide";

export type PortfolioPhoto = {
  id: string;
  seed: string;
  /** Real Cloudinary URL once uploaded via /admin — falls back to the seed gradient until then. */
  url?: string;
  alt: string;
  aspect: PhotoAspect;
  categoryId: string;
  projectId?: string;
};

export type PortfolioCategory = {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  coverSeed: string;
  coverUrl?: string;
};

export type StoryProject = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  date: string;
  location: string;
  description: string;
  credits?: string;
  featured: boolean;
  published: boolean;
  coverSeed: string;
  coverUrl?: string;
  photos: PortfolioPhoto[];
};

export type Testimonial = {
  id: string;
  name: string;
  eventLabel: string;
  text: string;
  rating?: number;
  featured: boolean;
};

export type ServiceOption = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  requiresCustomQuote: boolean;
  categoryTag: string;
};

export type ExtraOption = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type HomeConfigData = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroSeed: string;
  heroUrl?: string;
  statsYears: number;
  statsEvents: number;
  statsLocation: string;
  statsSpecialty: string;
  ctaFinalTitle: string;
  ctaFinalText: string;
};

export type AvailabilityStatus = "AVAILABLE" | "CONSULT" | "BUSY";

export type JournalPostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverSeed: string;
  coverUrl?: string;
  publishedAt: string;
  tags: string[];
};
