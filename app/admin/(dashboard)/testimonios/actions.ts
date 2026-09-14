"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTestimonial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  if (!name || !text) return;

  await prisma.testimonial.create({
    data: {
      name,
      text,
      eventLabel: String(formData.get("eventLabel") ?? "") || null,
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
      featured: formData.get("featured") === "on",
      published: true,
    },
  });
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}

export async function updateTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.testimonial.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      text: String(formData.get("text") ?? "").trim(),
      eventLabel: String(formData.get("eventLabel") ?? "") || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await prisma.testimonial.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}
