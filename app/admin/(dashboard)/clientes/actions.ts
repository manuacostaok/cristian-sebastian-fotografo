"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createClient(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !phone) return;

  await prisma.client.create({
    data: {
      name,
      phone,
      email: String(formData.get("email") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/admin/clientes");
}

export async function updateClient(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.client.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
      status: String(formData.get("status") ?? "ACTIVE"),
    },
  });
  revalidatePath("/admin/clientes");
}

export async function deleteClient(formData: FormData) {
  await prisma.client.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/clientes");
}
