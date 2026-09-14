"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createPhotoFromUpload(data: {
  url: string;
  cloudinaryId: string;
  width: number;
  height: number;
  categoryId?: string;
}) {
  await prisma.photo.create({
    data: {
      url: data.url,
      cloudinaryId: data.cloudinaryId,
      width: data.width,
      height: data.height,
      categoryId: data.categoryId || null,
    },
  });
  revalidatePath("/admin/portfolio/fotos");
  revalidatePath("/portfolio");
}

export async function updatePhoto(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.photo.update({
    where: { id },
    data: {
      categoryId: String(formData.get("categoryId") ?? "") || null,
      alt: String(formData.get("alt") ?? ""),
      featured: formData.get("featured") === "on",
    },
  });
  revalidatePath("/admin/portfolio/fotos");
  revalidatePath("/portfolio");
}

export async function deletePhoto(formData: FormData) {
  await prisma.photo.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/portfolio/fotos");
  revalidatePath("/portfolio");
}
