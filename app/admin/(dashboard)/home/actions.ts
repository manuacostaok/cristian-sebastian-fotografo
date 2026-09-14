"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateHomeConfig(formData: FormData) {
  const shared = {
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    heroCtaPrimary: String(formData.get("heroCtaPrimary") ?? ""),
    heroCtaSecondary: String(formData.get("heroCtaSecondary") ?? ""),
    statsYears: Number(formData.get("statsYears") ?? 0),
    statsEvents: Number(formData.get("statsEvents") ?? 0),
    statsLocation: String(formData.get("statsLocation") ?? ""),
    statsSpecialty: String(formData.get("statsSpecialty") ?? ""),
    ctaFinalTitle: String(formData.get("ctaFinalTitle") ?? ""),
    ctaFinalText: String(formData.get("ctaFinalText") ?? ""),
    featuredProjectIds: formData.getAll("featuredProjectIds").map(String),
    upcomingEventId: String(formData.get("upcomingEventId") ?? "") || null,
  };

  await prisma.homeConfig.upsert({
    where: { id: "home" },
    create: { id: "home", ...shared },
    update: shared,
  });
  revalidatePath("/admin/home");
  revalidatePath("/");
}
