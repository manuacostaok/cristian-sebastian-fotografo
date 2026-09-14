"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createService(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.service.create({
    data: {
      name,
      description: String(formData.get("description") ?? "") || null,
      basePrice: Number(formData.get("basePrice") ?? 0),
      requiresCustomQuote: formData.get("requiresCustomQuote") === "on",
      categoryTag: String(formData.get("categoryTag") ?? "") || null,
    },
  });
  revalidatePath("/admin/servicios");
  revalidatePath("/presupuesto");
}

export async function updateService(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.service.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "") || null,
      basePrice: Number(formData.get("basePrice") ?? 0),
      requiresCustomQuote: formData.get("requiresCustomQuote") === "on",
      categoryTag: String(formData.get("categoryTag") ?? "") || null,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/servicios");
  revalidatePath("/presupuesto");
}

export async function deleteService(formData: FormData) {
  await prisma.service.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/servicios");
  revalidatePath("/presupuesto");
}
