"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  const data = {
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  };

  await prisma.settings.upsert({
    where: { id: "settings" },
    create: { id: "settings", ...data },
    update: data,
  });
  revalidatePath("/admin/configuracion");
  revalidatePath("/");
}
