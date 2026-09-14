"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { AvailabilityStatus } from "@prisma/client";

export async function setAvailability(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  if (!date) return;

  await prisma.availabilityDay.upsert({
    where: { date: new Date(date) },
    create: {
      date: new Date(date),
      status: String(formData.get("status")) as AvailabilityStatus,
      internalNote: String(formData.get("internalNote") ?? "") || null,
    },
    update: {
      status: String(formData.get("status")) as AvailabilityStatus,
      internalNote: String(formData.get("internalNote") ?? "") || null,
    },
  });
  revalidatePath("/admin/disponibilidad");
  revalidatePath("/disponibilidad");
}

export async function deleteAvailability(formData: FormData) {
  await prisma.availabilityDay.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/disponibilidad");
  revalidatePath("/disponibilidad");
}
