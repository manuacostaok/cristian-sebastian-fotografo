/**
 * Seeds real example photography (free-license photos from Picsum/Unsplash,
 * uploaded through the real Cloudinary pipeline) into Projects/Photos/
 * Testimonials/Journal — so the site shows real images instead of brand
 * gradients until Christian uploads his own work. Safe to re-run: creates
 * fresh projects each time rather than mutating, so run once.
 */
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

async function upload(seed: string, w: number, h: number, alt: string) {
  const res = await cloudinary.uploader.upload(picsum(seed, w, h), {
    folder: "christian-sebastian",
  });
  return {
    url: res.secure_url,
    cloudinaryId: res.public_id,
    width: res.width,
    height: res.height,
    alt,
  };
}

const DIMS = {
  portrait: [900, 1125] as const,
  landscape: [1200, 900] as const,
  square: [900, 900] as const,
  wide: [1600, 900] as const,
};

type ProjectSeed = {
  title: string;
  slug: string;
  categorySlug: string;
  date: string;
  location: string;
  description: string;
  credits?: string;
  featured: boolean;
  photos: { seed: string; aspect: keyof typeof DIMS; alt: string }[];
};

const PROJECTS: ProjectSeed[] = [
  {
    title: "Dana — Sus XV",
    slug: "dana-sus-xv",
    categorySlug: "15-anos",
    date: "2026-03-14",
    location: "Buenos Aires",
    description:
      "Un salón, una familia entera y una noche que Dana va a recordar cada vez que mire estas fotos.",
    credits: "Producción: Estudio Dana XV",
    featured: true,
    photos: [
      { seed: "dana-1", aspect: "portrait", alt: "Entrada de Dana al salón" },
      { seed: "dana-2", aspect: "landscape", alt: "Vals de Dana" },
      { seed: "dana-3", aspect: "portrait", alt: "Detalle del vestido" },
      { seed: "dana-4", aspect: "wide", alt: "Pista de baile" },
    ],
  },
  {
    title: "Martina — 18 Años",
    slug: "martina-18-anos",
    categorySlug: "cumpleanos-18",
    date: "2026-11-14",
    location: "Buenos Aires",
    description: "Luces láser, amigos de toda la vida y una Martina que no paró de bailar.",
    featured: true,
    photos: [
      { seed: "martina-1", aspect: "portrait", alt: "Martina bajo luces láser" },
      { seed: "martina-2", aspect: "landscape", alt: "Grupo de amigos" },
      { seed: "martina-3", aspect: "square", alt: "Brindis" },
    ],
  },
  {
    title: "Otoño de Amigas",
    slug: "otono-de-amigas",
    categorySlug: "exteriores",
    date: "2025-05-10",
    location: "Buenos Aires",
    description: "Camisas blancas, jean y una tarde de otoño en el campo.",
    featured: true,
    photos: [
      { seed: "otono-1", aspect: "wide", alt: "Grupo caminando entre árboles" },
      { seed: "otono-2", aspect: "portrait", alt: "Retrato individual, luz dorada" },
      { seed: "otono-3", aspect: "square", alt: "Detalle de manos y flores" },
      { seed: "otono-4", aspect: "landscape", alt: "Grupo sentado en el pasto" },
    ],
  },
  {
    title: "Sofía en el Palacio",
    slug: "sofia-en-el-palacio",
    categorySlug: "eventos",
    date: "2025-09-20",
    location: "Buenos Aires",
    description: "Una locación con escaleras de mármol y luz de época.",
    featured: true,
    photos: [
      { seed: "palacio-1", aspect: "portrait", alt: "Escalera de mármol" },
      { seed: "palacio-2", aspect: "landscape", alt: "Reflejo en el piso del salón" },
      { seed: "palacio-3", aspect: "portrait", alt: "Retrato en el balcón" },
    ],
  },
  {
    title: "Retrato en la Costa",
    slug: "retrato-en-la-costa",
    categorySlug: "retratos",
    date: "2025-07-02",
    location: "Costa Atlántica",
    description: "Sombrero, abrigo y el mar de fondo.",
    featured: false,
    photos: [
      { seed: "costa-1", aspect: "portrait", alt: "Retrato frente al mar" },
      { seed: "costa-2", aspect: "wide", alt: "Caminando por la costa" },
    ],
  },
  {
    title: "Noche de Luces",
    slug: "noche-de-luces",
    categorySlug: "eventos",
    date: "2025-06-15",
    location: "Buenos Aires",
    description: "Vestido con luces LED, pista llena y una energía que no se puede fingir.",
    featured: false,
    photos: [
      { seed: "noche-1", aspect: "portrait", alt: "Vestido con luces LED" },
      { seed: "noche-2", aspect: "wide", alt: "Pista de baile llena" },
    ],
  },
];

async function main() {
  console.log("Subiendo y creando proyectos de ejemplo...");

  const featuredIds: string[] = [];
  let martinaEventId: string | null = null;

  for (const p of PROJECTS) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) {
      console.warn(`Categoría ${p.categorySlug} no encontrada, salteando ${p.title}`);
      continue;
    }

    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`Ya existe: ${p.title} — salteo.`);
      if (p.featured) featuredIds.push(existing.id);
      continue;
    }

    const project = await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        categoryId: category.id,
        date: new Date(p.date),
        location: p.location,
        description: p.description,
        credits: p.credits,
        featured: p.featured,
        published: true,
      },
    });

    let coverPhotoId: string | null = null;
    for (const ph of p.photos) {
      const [w, h] = DIMS[ph.aspect];
      const uploaded = await upload(ph.seed, w, h, ph.alt);
      const photo = await prisma.photo.create({
        data: {
          url: uploaded.url,
          cloudinaryId: uploaded.cloudinaryId,
          width: uploaded.width,
          height: uploaded.height,
          alt: uploaded.alt,
          categoryId: category.id,
          projectId: project.id,
        },
      });
      if (!coverPhotoId) coverPhotoId = photo.id;
      console.log(`  + foto ${ph.seed} -> ${p.title}`);
    }

    if (coverPhotoId) {
      await prisma.project.update({ where: { id: project.id }, data: { coverPhotoId } });
    }

    if (p.featured) featuredIds.push(project.id);

    if (p.slug === "martina-18-anos") {
      const event = await prisma.event.create({
        data: {
          name: project.title,
          date: project.date!,
          location: project.location,
          categoryId: category.id,
          projectId: project.id,
          status: "UPCOMING",
          visibility: "PUBLIC",
        },
      });
      martinaEventId = event.id;
    }
  }

  console.log("Subiendo foto de portada (Hero)...");
  const hero = await upload("hero-main-cover", 1920, 1200, "Christian Sebastián — foto principal");
  const heroPhoto = await prisma.photo.create({
    data: { url: hero.url, cloudinaryId: hero.cloudinaryId, width: hero.width, height: hero.height, alt: hero.alt },
  });

  await prisma.homeConfig.upsert({
    where: { id: "home" },
    create: { id: "home", heroPhotoId: heroPhoto.id, featuredProjectIds: featuredIds, upcomingEventId: martinaEventId },
    update: { heroPhotoId: heroPhoto.id, featuredProjectIds: featuredIds, upcomingEventId: martinaEventId },
  });

  console.log("Creando testimonios...");
  const testimonials = [
    {
      name: "Familia Acosta",
      eventLabel: "15 años de Dana",
      text: "Christian entendió exactamente lo que queríamos antes de que lo dijéramos. Las fotos son mejores de lo que imaginamos.",
      rating: 5,
    },
    {
      name: "Martina R.",
      eventLabel: "18 años",
      text: "Nos sacamos fotos con Christian y ni notamos la cámara — eso es lo que más valoro. Súper profesional y divertido.",
      rating: 5,
    },
    {
      name: "Sofía G.",
      eventLabel: "Sesión exteriores",
      text: "La sesión de otoño quedó como de revista. Cada foto cuenta algo distinto.",
      rating: 5,
    },
  ];
  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: t.name, eventLabel: t.eventLabel } });
    if (!exists) {
      await prisma.testimonial.create({ data: { ...t, featured: true, published: true } });
    }
  }

  console.log("Creando notas de Journal...");
  const journalCover1 = await upload("journal-locacion", 1600, 900, "Locación para 15 años");
  const journalCover2 = await upload("journal-otono", 1600, 900, "Detrás de cámara sesión de otoño");

  const posts = [
    {
      title: "Qué llevar en cuenta al elegir la locación de tus 15",
      slug: "elegir-locacion-15-anos",
      content:
        "La locación define gran parte de tus fotos antes de que empiece la fiesta. Buscá espacios con luz natural durante el día y buena iluminación ambiente de noche — evitá tubos fluorescentes fríos. Si el salón tiene un patio, escalera o balcón, aprovechalo para retratos individuales antes de que empiece el baile.",
      coverPhotoUrl: journalCover1.url,
      tags: ["15 años", "consejos"],
    },
    {
      title: "Detrás de cámara: la sesión de otoño",
      slug: "detras-de-camara-sesion-otono",
      content:
        "Cuando el grupo me propuso hacer algo distinto a la sesión típica, elegimos un día de semana a media tarde, con el otoño en su punto justo. Nada de poses forzadas — caminamos, hablamos, y fui fotografiando lo que iba pasando.",
      coverPhotoUrl: journalCover2.url,
      tags: ["exteriores", "detrás de cámara"],
    },
  ];
  for (const post of posts) {
    const exists = await prisma.journalPost.findUnique({ where: { slug: post.slug } });
    if (!exists) {
      await prisma.journalPost.create({
        data: { ...post, published: true, publishedAt: new Date() },
      });
    }
  }

  console.log("Subiendo foto de Sobre mí...");
  const aboutPhoto = await upload("sobre-mi-portrait", 900, 1125, "Christian Sebastián");

  console.log("\n== LISTO ==");
  console.log("Pegá esta URL en app/(site)/sobre-mi/page.tsx (prop url de RevealPhoto):");
  console.log(aboutPhoto.url);
  console.log("\nHero/Link-in-bio ya quedaron conectados vía HomeConfig / podés reusar esta URL:");
  console.log(hero.url);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
