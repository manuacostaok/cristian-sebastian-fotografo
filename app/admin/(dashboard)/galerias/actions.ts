"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createGallery(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const eventId = String(formData.get("eventId") ?? "") || null;
  if (!title) return;

  const gallery = await prisma.privateGallery.create({
    data: { title, eventId, token: randomUUID().replace(/-/g, "") },
  });
  revalidatePath("/admin/galerias");
  redirect(`/admin/galerias/${gallery.id}`);
}

export async function updateGallery(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.privateGallery.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      downloadEnabled: formData.get("downloadEnabled") === "on",
    },
  });
  revalidatePath("/admin/galerias");
  revalidatePath(`/admin/galerias/${id}`);
}

export async function deleteGallery(formData: FormData) {
  await prisma.privateGallery.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/galerias");
  redirect("/admin/galerias");
}

export async function assignPhotoToGallery(formData: FormData) {
  const photoId = String(formData.get("photoId"));
  const galleryId = String(formData.get("galleryId"));
  await prisma.photo.update({ where: { id: photoId }, data: { privateGalleryId: galleryId } });
  revalidatePath(`/admin/galerias/${galleryId}`);
}

export async function removePhotoFromGallery(formData: FormData) {
  const photoId = String(formData.get("photoId"));
  const galleryId = String(formData.get("galleryId"));
  await prisma.photo.update({ where: { id: photoId }, data: { privateGalleryId: null } });
  revalidatePath(`/admin/galerias/${galleryId}`);
}
