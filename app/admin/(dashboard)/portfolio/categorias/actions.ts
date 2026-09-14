"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.category.create({
    data: { name, slug: slugify(name), order: Number(formData.get("order") ?? 0) },
  });
  revalidatePath("/admin/portfolio/categorias");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      order: Number(formData.get("order") ?? 0),
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/portfolio/categorias");
  revalidatePath("/portfolio");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/portfolio/categorias");
  revalidatePath("/portfolio");
}
