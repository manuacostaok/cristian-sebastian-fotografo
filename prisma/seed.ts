import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "15 Años", slug: "15-anos", order: 0 },
  { name: "Cumpleaños 18", slug: "cumpleanos-18", order: 1 },
  { name: "Exteriores", slug: "exteriores", order: 2 },
  { name: "Eventos", slug: "eventos", order: 3 },
  { name: "Retratos", slug: "retratos", order: 4 },
  { name: "Bodas", slug: "bodas", order: 5 },
];

const SERVICES = [
  { name: "Cobertura 15 Años", description: "Cobertura completa del evento, 5 horas.", basePrice: 450000, categoryTag: "15-anos" },
  { name: "Cobertura Cumpleaños 18", description: "Cobertura completa del evento, 4 horas.", basePrice: 380000, categoryTag: "cumpleanos-18" },
  { name: "Sesión Exteriores", description: "Sesión de 2 horas en la locación que elijas.", basePrice: 180000, categoryTag: "exteriores" },
  { name: "Cobertura de Evento", description: "Cumpleaños, aniversarios y celebraciones.", basePrice: 300000, categoryTag: "eventos" },
  { name: "Cobertura de Boda", description: "Cada boda es distinta — armamos la propuesta juntos.", basePrice: 0, requiresCustomQuote: true, categoryTag: "bodas" },
];

const EXTRAS = [
  { name: "Álbum impreso premium", description: "30x30cm, tapa dura, 40 páginas.", price: 120000 },
  { name: "Segundo fotógrafo", description: "Cobertura simultánea desde otro ángulo.", price: 90000 },
  { name: "Tomas con drone", description: "Video y foto aérea del evento.", price: 70000 },
  { name: "Video resumen", description: "Video de 2-3 minutos editado.", price: 150000 },
  { name: "Entrega express (72hs)", description: "Selección editada en 3 días hábiles.", price: 60000 },
  { name: "Sesión previa", description: "Sesión de 1 hora antes del evento.", price: 80000 },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@christiansebastian.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        name: "Christian Sebastián",
        role: "ADMIN",
      },
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword} — cambiá la contraseña después del primer login.`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: { name: category.name, order: category.order },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categorías.`);

  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) await prisma.service.create({ data: service });
  }
  console.log(`Seeded ${SERVICES.length} servicios.`);

  for (const extra of EXTRAS) {
    const existing = await prisma.extra.findFirst({ where: { name: extra.name } });
    if (!existing) await prisma.extra.create({ data: extra });
  }
  console.log(`Seeded ${EXTRAS.length} extras.`);

  await prisma.homeConfig.upsert({
    where: { id: "home" },
    create: { id: "home" },
    update: {},
  });

  await prisma.settings.upsert({
    where: { id: "settings" },
    create: { id: "settings" },
    update: {},
  });

  console.log("Home config y Settings listos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
