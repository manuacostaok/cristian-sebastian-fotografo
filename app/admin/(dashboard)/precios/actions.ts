"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createExtra(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.extra.create({
    data: {
      name,
      description: String(formData.get("description") ?? "") || null,
      price: Number(formData.get("price") ?? 0),
    },
  });
  revalidatePath("/admin/precios");
  revalidatePath("/presupuesto");
}

export async function updateExtra(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.extra.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "") || null,
      price: Number(formData.get("price") ?? 0),
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/precios");
  revalidatePath("/presupuesto");
}

export async function deleteExtra(formData: FormData) {
  await prisma.extra.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/precios");
  revalidatePath("/presupuesto");
}
