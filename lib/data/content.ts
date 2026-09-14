import type {
  PortfolioCategory,
  StoryProject,
  Testimonial,
  ServiceOption,
  ExtraOption,
  HomeConfigData,
  JournalPostData,
} from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import {
  mapCategory,
  mapProject,
  mapTestimonial,
  mapService,
  mapExtra,
  mapJournalPost,
} from "@/lib/data/mappers";

/**
 * Seed content layer. Shaped exactly like the eventual Prisma models so that
 * swapping these functions for real `prisma.*.findMany()` calls (once
 * DATABASE_URL is connected) requires no changes at the call sites.
 *
 * Content below is curated from the real Instagram catalog
 * (@christiansebastianfotografo): 15 años / 18 años party photography is the
 * core of the business, with a strong "Exteriores" editorial line. Weddings
 * are modeled but not emphasized since none currently appear in the feed.
 */

export const CATEGORIES: PortfolioCategory[] = [
  { id: "cat-15", name: "15 Años", slug: "15-anos", order: 0, active: true, coverSeed: "cat-15" },
  { id: "cat-18", name: "Cumpleaños 18", slug: "cumpleanos-18", order: 1, active: true, coverSeed: "cat-18" },
  { id: "cat-ext", name: "Exteriores", slug: "exteriores", order: 2, active: true, coverSeed: "cat-ext" },
  { id: "cat-eve", name: "Eventos", slug: "eventos", order: 3, active: true, coverSeed: "cat-eve" },
  { id: "cat-ret", name: "Retratos", slug: "retratos", order: 4, active: true, coverSeed: "cat-ret" },
  { id: "cat-bod", name: "Bodas", slug: "bodas", order: 5, active: true, coverSeed: "cat-bod" },
];

export const PROJECTS: StoryProject[] = [
  {
    id: "proj-dana",
    title: "Dana — Sus XV",
    slug: "dana-sus-xv",
    categoryId: "cat-15",
    date: "2026-03-14",
    location: "Buenos Aires",
    description:
      "Un salón, una familia entera y una noche que Dana va a recordar cada vez que mire estas fotos. Luces, vestido y la coreografía que ensayó todo un verano.",
    credits: "Producción: Estudio Dana XV",
    featured: true,
    published: true,
    coverSeed: "dana-cover",
    photos: [
      { id: "p1", seed: "dana-1", alt: "Entrada de Dana al salón", aspect: "portrait", categoryId: "cat-15", projectId: "proj-dana" },
      { id: "p2", seed: "dana-2", alt: "Vals de Dana", aspect: "landscape", categoryId: "cat-15", projectId: "proj-dana" },
      { id: "p3", seed: "dana-3", alt: "Detalle del vestido", aspect: "portrait", categoryId: "cat-15", projectId: "proj-dana" },
      { id: "p4", seed: "dana-4", alt: "Pista de baile", aspect: "wide", categoryId: "cat-15", projectId: "proj-dana" },
      { id: "p5", seed: "dana-5", alt: "Con las amigas", aspect: "square", categoryId: "cat-15", projectId: "proj-dana" },
    ],
  },
  {
    id: "proj-martina18",
    title: "Martina — 18 Años",
    slug: "martina-18-anos",
    categoryId: "cat-18",
    date: "2026-11-14",
    location: "Buenos Aires",
    description:
      "Una fiesta pensada al detalle: luces láser, amigos de toda la vida y una Martina que no paró de bailar. Próximamente en el portfolio.",
    featured: true,
    published: true,
    coverSeed: "martina-cover",
    photos: [
      { id: "p6", seed: "martina-1", alt: "Martina bajo luces láser", aspect: "portrait", categoryId: "cat-18", projectId: "proj-martina18" },
      { id: "p7", seed: "martina-2", alt: "Grupo de amigos", aspect: "landscape", categoryId: "cat-18", projectId: "proj-martina18" },
      { id: "p8", seed: "martina-3", alt: "Brindis", aspect: "square", categoryId: "cat-18", projectId: "proj-martina18" },
    ],
  },
  {
    id: "proj-otono",
    title: "Otoño de Amigas",
    slug: "otono-de-amigas",
    categoryId: "cat-ext",
    date: "2025-05-10",
    location: "Buenos Aires",
    description:
      "Camisas blancas, jean y una tarde de otoño en el campo. Sesión exterior pensada como editorial, no como catálogo de poses.",
    featured: true,
    published: true,
    coverSeed: "otono-cover",
    photos: [
      { id: "p9", seed: "otono-1", alt: "Grupo caminando entre árboles", aspect: "wide", categoryId: "cat-ext", projectId: "proj-otono" },
      { id: "p10", seed: "otono-2", alt: "Retrato individual, luz dorada", aspect: "portrait", categoryId: "cat-ext", projectId: "proj-otono" },
      { id: "p11", seed: "otono-3", alt: "Detalle de manos y flores", aspect: "square", categoryId: "cat-ext", projectId: "proj-otono" },
      { id: "p12", seed: "otono-4", alt: "Grupo sentado en el pasto", aspect: "landscape", categoryId: "cat-ext", projectId: "proj-otono" },
    ],
  },
  {
    id: "proj-palacio",
    title: "Sofía en el Palacio",
    slug: "sofia-en-el-palacio",
    categoryId: "cat-eve",
    date: "2025-09-20",
    location: "Buenos Aires",
    description:
      "Una locación con escaleras de mármol y luz de época — el escenario perfecto para una fiesta que combinó lo clásico con lo festivo.",
    featured: true,
    published: true,
    coverSeed: "palacio-cover",
    photos: [
      { id: "p13", seed: "palacio-1", alt: "Escalera de mármol", aspect: "portrait", categoryId: "cat-eve", projectId: "proj-palacio" },
      { id: "p14", seed: "palacio-2", alt: "Reflejo en el piso del salón", aspect: "landscape", categoryId: "cat-eve", projectId: "proj-palacio" },
      { id: "p15", seed: "palacio-3", alt: "Retrato en el balcón", aspect: "portrait", categoryId: "cat-eve", projectId: "proj-palacio" },
    ],
  },
  {
    id: "proj-costa",
    title: "Retrato en la Costa",
    slug: "retrato-en-la-costa",
    categoryId: "cat-ret",
    date: "2025-07-02",
    location: "Costa Atlántica",
    description: "Sombrero, abrigo y el mar de fondo. Una sesión de retrato pura, sin producción de más.",
    featured: false,
    published: true,
    coverSeed: "costa-cover",
    photos: [
      { id: "p16", seed: "costa-1", alt: "Retrato frente al mar", aspect: "portrait", categoryId: "cat-ret", projectId: "proj-costa" },
      { id: "p17", seed: "costa-2", alt: "Caminando por la costa", aspect: "wide", categoryId: "cat-ret", projectId: "proj-costa" },
    ],
  },
  {
    id: "proj-noche",
    title: "Noche de Luces",
    slug: "noche-de-luces",
    categoryId: "cat-eve",
    date: "2025-06-15",
    location: "Buenos Aires",
    description: "Vestido con luces LED, pista llena y una energía que no se puede fingir.",
    featured: false,
    published: true,
    coverSeed: "noche-cover",
    photos: [
      { id: "p18", seed: "noche-1", alt: "Vestido con luces LED", aspect: "portrait", categoryId: "cat-eve", projectId: "proj-noche" },
      { id: "p19", seed: "noche-2", alt: "Pista de baile llena", aspect: "wide", categoryId: "cat-eve", projectId: "proj-noche" },
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Familia Acosta",
    eventLabel: "15 años de Dana",
    text: "Christian entendió exactamente lo que queríamos antes de que lo dijéramos. Las fotos son mejores de lo que imaginamos.",
    rating: 5,
    featured: true,
  },
  {
    id: "t2",
    name: "Martina R.",
    eventLabel: "18 años",
    text: "Nos sacamos fotos con Christian y ni notamos la cámara — eso es lo que más valoro. Súper profesional y divertido.",
    rating: 5,
    featured: true,
  },
  {
    id: "t3",
    name: "Sofía G.",
    eventLabel: "Sesión exteriores",
    text: "La sesión de otoño quedó como de revista. Cada foto cuenta algo distinto.",
    rating: 5,
    featured: true,
  },
];

export const SERVICES: ServiceOption[] = [
  { id: "srv-15", name: "Cobertura 15 Años", description: "Cobertura completa del evento, 5 horas.", basePrice: 450000, requiresCustomQuote: false, categoryTag: "15-anos" },
  { id: "srv-18", name: "Cobertura Cumpleaños 18", description: "Cobertura completa del evento, 4 horas.", basePrice: 380000, requiresCustomQuote: false, categoryTag: "cumpleanos-18" },
  { id: "srv-ext", name: "Sesión Exteriores", description: "Sesión de 2 horas en la locación que elijas.", basePrice: 180000, requiresCustomQuote: false, categoryTag: "exteriores" },
  { id: "srv-eve", name: "Cobertura de Evento", description: "Cumpleaños, aniversarios y celebraciones.", basePrice: 300000, requiresCustomQuote: false, categoryTag: "eventos" },
  { id: "srv-bod", name: "Cobertura de Boda", description: "Cada boda es distinta — armamos la propuesta juntos.", basePrice: 0, requiresCustomQuote: true, categoryTag: "bodas" },
];

export const EXTRAS: ExtraOption[] = [
  { id: "ext-album", name: "Álbum impreso premium", description: "30x30cm, tapa dura, 40 páginas.", price: 120000 },
  { id: "ext-2ndphoto", name: "Segundo fotógrafo", description: "Cobertura simultánea desde otro ángulo.", price: 90000 },
  { id: "ext-drone", name: "Tomas con drone", description: "Video y foto aérea del evento.", price: 70000 },
  { id: "ext-video", name: "Video resumen", description: "Video de 2-3 minutos editado.", price: 150000 },
  { id: "ext-express", name: "Entrega express (72hs)", description: "Selección editada en 3 días hábiles.", price: 60000 },
  { id: "ext-previa", name: "Sesión previa", description: "Sesión de 1 hora antes del evento.", price: 80000 },
];

export const HOME_CONFIG: HomeConfigData = {
  heroTitle: "Christian Sebastián",
  heroSubtitle: "La fiesta dura una noche. La fotografía, para siempre.",
  heroCtaPrimary: "Ver portfolio",
  heroCtaSecondary: "Consultar fecha",
  heroSeed: "hero-main",
  statsYears: 15,
  statsEvents: 300,
  statsLocation: "Buenos Aires, Argentina",
  statsSpecialty: "15 Años · Cumpleaños · Eventos · Exteriores",
  ctaFinalTitle: "¿Tenés una fecha en mente?",
  ctaFinalText: "Contame sobre tu evento y armemos juntos algo que se sienta único.",
};

export const JOURNAL_POSTS: JournalPostData[] = [
  {
    id: "j1",
    title: "Qué llevar en cuenta al elegir la locación de tus 15",
    slug: "elegir-locacion-15-anos",
    excerpt: "La luz importa más que la decoración. Algunas ideas antes de reservar el salón.",
    content:
      "La locación define gran parte de tus fotos antes de que empiece la fiesta. Buscá espacios con luz natural durante el día y buena iluminación ambiente de noche — evitá tubos fluorescentes fríos. Si el salón tiene un patio, escalera o balcón, aprovechalo para retratos individuales antes de que empiece el baile.",
    coverSeed: "journal-1",
    publishedAt: "2026-02-10",
    tags: ["15 años", "consejos"],
  },
  {
    id: "j2",
    title: "Detrás de cámara: la sesión de otoño",
    slug: "detras-de-camara-sesion-otono",
    excerpt: "Cómo planeamos la sesión grupal que se transformó en una de mis favoritas del año.",
    content:
      "Cuando el grupo me propuso hacer algo distinto a la sesión típica, elegimos un día de semana a media tarde, con el otoño en su punto justo. Nada de poses forzadas — caminamos, hablamos, y fui fotografiando lo que iba pasando.",
    coverSeed: "journal-2",
    publishedAt: "2025-05-20",
    tags: ["exteriores", "detrás de cámara"],
  },
];

// ── Accessors ──
// Each tries the real database first and falls back to the curated seed
// above — so the site always looks complete pre-launch (no DATABASE_URL
// yet, or an admin hasn't added real content for that section) and shows
// real content the moment it exists.

const PROJECT_INCLUDE = { coverPhoto: true, photos: true } as const;

export async function getCategories(): Promise<PortfolioCategory[]> {
  const rows = await safeQuery(
    () => prisma.category.findMany({ where: { active: true }, orderBy: { order: "asc" }, include: { coverPhoto: true } }),
    null,
  );
  if (!rows || rows.length === 0) return CATEGORIES.filter((c) => c.active).sort((a, b) => a.order - b.order);
  return rows.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<PortfolioCategory | null> {
  const row = await safeQuery(
    () => prisma.category.findUnique({ where: { slug }, include: { coverPhoto: true } }),
    null,
  );
  if (row) return mapCategory(row);
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getProjects(): Promise<StoryProject[]> {
  const rows = await safeQuery(
    () => prisma.project.findMany({ where: { published: true }, orderBy: { date: "desc" }, include: PROJECT_INCLUDE }),
    null,
  );
  if (!rows || rows.length === 0) return PROJECTS.filter((p) => p.published);
  return rows.map(mapProject);
}

export async function getFeaturedProjects(): Promise<StoryProject[]> {
  const rows = await safeQuery(
    () =>
      prisma.project.findMany({
        where: { published: true, featured: true },
        orderBy: { date: "desc" },
        include: PROJECT_INCLUDE,
      }),
    null,
  );
  if (!rows || rows.length === 0) return PROJECTS.filter((p) => p.published && p.featured);
  return rows.map(mapProject);
}

export async function getProjectsByCategory(categoryId: string): Promise<StoryProject[]> {
  const rows = await safeQuery(
    () =>
      prisma.project.findMany({
        where: { published: true, categoryId },
        orderBy: { date: "desc" },
        include: PROJECT_INCLUDE,
      }),
    null,
  );
  if (rows && rows.length > 0) return rows.map(mapProject);
  // Real category with no real projects yet — don't fall back to unrelated seed IDs.
  const realCategory = await safeQuery(() => prisma.category.findUnique({ where: { id: categoryId } }), null);
  if (realCategory) return [];
  return PROJECTS.filter((p) => p.published && p.categoryId === categoryId);
}

export async function getProjectBySlug(slug: string): Promise<StoryProject | null> {
  const row = await safeQuery(
    () => prisma.project.findFirst({ where: { slug, published: true }, include: PROJECT_INCLUDE }),
    null,
  );
  if (row) return mapProject(row);
  return PROJECTS.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await safeQuery(
    () => prisma.testimonial.findMany({ where: { featured: true, published: true }, orderBy: { order: "asc" } }),
    null,
  );
  if (!rows || rows.length === 0) return TESTIMONIALS.filter((t) => t.featured);
  return rows.map(mapTestimonial);
}

export async function getServices(): Promise<ServiceOption[]> {
  const rows = await safeQuery(
    () => prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    null,
  );
  if (!rows || rows.length === 0) return SERVICES;
  return rows.map(mapService);
}

export async function getExtras(): Promise<ExtraOption[]> {
  const rows = await safeQuery(
    () => prisma.extra.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    null,
  );
  if (!rows || rows.length === 0) return EXTRAS;
  return rows.map(mapExtra);
}

export async function getHomeConfig(): Promise<HomeConfigData> {
  const row = await safeQuery(() => prisma.homeConfig.findUnique({ where: { id: "home" } }), null);
  if (!row) return HOME_CONFIG;

  return {
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroCtaPrimary: row.heroCtaPrimary,
    heroCtaSecondary: row.heroCtaSecondary,
    heroSeed: "hero-main",
    statsYears: row.statsYears,
    statsEvents: row.statsEvents,
    statsLocation: row.statsLocation,
    statsSpecialty: row.statsSpecialty,
    ctaFinalTitle: row.ctaFinalTitle,
    ctaFinalText: row.ctaFinalText,
  };
}

export async function getJournalPosts(): Promise<JournalPostData[]> {
  const rows = await safeQuery(
    () => prisma.journalPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    null,
  );
  if (!rows || rows.length === 0) {
    return [...JOURNAL_POSTS].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  return rows.map(mapJournalPost);
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPostData | null> {
  const row = await safeQuery(
    () => prisma.journalPost.findFirst({ where: { slug, published: true } }),
    null,
  );
  if (row) return mapJournalPost(row);
  return JOURNAL_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getUpcomingProject(): Promise<StoryProject | null> {
  const config = await safeQuery(() => prisma.homeConfig.findUnique({ where: { id: "home" } }), null);

  if (config?.upcomingEventId) {
    const event = await safeQuery(
      () =>
        prisma.event.findUnique({
          where: { id: config.upcomingEventId! },
          include: { project: { include: PROJECT_INCLUDE }, category: true },
        }),
      null,
    );
    // Never surface a private event publicly — even if the admin picked it
    // as "upcoming" before flagging it public, or picked it by mistake.
    if (event && event.visibility !== "PUBLIC") return null;
    if (event?.project) return mapProject(event.project);
    if (event) {
      return {
        id: event.id,
        title: event.name,
        slug: event.project?.slug ?? event.id,
        categoryId: event.categoryId ?? "",
        date: event.date.toISOString().slice(0, 10),
        location: event.location ?? "",
        description: "",
        featured: false,
        published: true,
        coverSeed: event.id,
        photos: [],
      };
    }
  }

  const rows = await safeQuery(
    () =>
      prisma.project.findMany({
        where: { published: true, date: { gt: new Date() } },
        orderBy: { date: "asc" },
        take: 1,
        include: PROJECT_INCLUDE,
      }),
    null,
  );
  if (rows && rows.length > 0) return mapProject(rows[0]);

  return (
    PROJECTS.filter((p) => new Date(p.date) > new Date()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )[0] ?? null
  );
}
