"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createProject(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!title || !categoryId) return;

  const project = await prisma.project.create({
    data: {
      title,
      slug: slugify(title),
      categoryId,
      date: formData.get("date") ? new Date(String(formData.get("date"))) : null,
      location: String(formData.get("location") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
    },
  });
  revalidatePath("/admin/proyectos");
  redirect(`/admin/proyectos/${project.id}`);
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.project.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      categoryId: String(formData.get("categoryId") ?? ""),
      date: formData.get("date") ? new Date(String(formData.get("date"))) : null,
      location: String(formData.get("location") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      credits: String(formData.get("credits") ?? "") || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      coverPhotoId: String(formData.get("coverPhotoId") ?? "") || null,
    },
  });
  revalidatePath("/admin/proyectos");
  revalidatePath(`/admin/proyectos/${id}`);
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/proyectos");
  redirect("/admin/proyectos");
}

export async function assignPhotoToProject(formData: FormData) {
  const photoId = String(formData.get("photoId"));
  const projectId = String(formData.get("projectId"));
  const categoryId = String(formData.get("categoryId"));

  await prisma.photo.update({
    where: { id: photoId },
    data: { projectId, categoryId },
  });
  revalidatePath(`/admin/proyectos/${projectId}`);
}

export async function removePhotoFromProject(formData: FormData) {
  const photoId = String(formData.get("photoId"));
  const projectId = String(formData.get("projectId"));

  await prisma.photo.update({ where: { id: photoId }, data: { projectId: null } });
  revalidatePath(`/admin/proyectos/${projectId}`);
}
