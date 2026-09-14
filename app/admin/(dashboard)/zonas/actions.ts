"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createWorkZone(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.workZone.create({
    data: { name, slug: slugify(name), order: Number(formData.get("order") ?? 0) },
  });
  revalidatePath("/admin/zonas");
  revalidatePath("/sobre-mi");
}

export async function updateWorkZone(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();

  await prisma.workZone.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      order: Number(formData.get("order") ?? 0),
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/zonas");
  revalidatePath("/sobre-mi");
}

export async function deleteWorkZone(formData: FormData) {
  await prisma.workZone.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/zonas");
  revalidatePath("/sobre-mi");
}
