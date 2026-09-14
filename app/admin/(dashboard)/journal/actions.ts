"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;

  await prisma.journalPost.create({
    data: {
      title,
      slug: slugify(title),
      content,
      published: formData.get("published") === "on",
      publishedAt: formData.get("published") === "on" ? new Date() : null,
    },
  });
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}

export async function updatePost(formData: FormData) {
  const id = String(formData.get("id"));
  const published = formData.get("published") === "on";

  await prisma.journalPost.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      published,
    },
  });
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}

export async function deletePost(formData: FormData) {
  await prisma.journalPost.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}
