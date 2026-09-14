"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { EventStatus, EventVisibility, BalanceStatus } from "@prisma/client";

export async function createEvent(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  if (!name || !date) return;

  await prisma.event.create({
    data: {
      name,
      date: new Date(date),
      time: String(formData.get("time") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      clientId: String(formData.get("clientId") ?? "") || null,
      categoryId: String(formData.get("categoryId") ?? "") || null,
      status: String(formData.get("status") ?? "PENDING") as EventStatus,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as EventVisibility,
    },
  });
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id"));
  const totalPrice = String(formData.get("totalPrice") ?? "");
  const depositAmount = String(formData.get("depositAmount") ?? "");

  await prisma.event.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      date: new Date(String(formData.get("date"))),
      time: String(formData.get("time") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      clientId: String(formData.get("clientId") ?? "") || null,
      categoryId: String(formData.get("categoryId") ?? "") || null,
      status: String(formData.get("status") ?? "PENDING") as EventStatus,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as EventVisibility,
      notes: String(formData.get("notes") ?? "") || null,
      totalPrice: totalPrice ? Number(totalPrice) : null,
      depositAmount: depositAmount ? Number(depositAmount) : null,
      depositPaid: formData.get("depositPaid") === "on",
      balanceStatus: String(formData.get("balanceStatus") ?? "PENDING") as BalanceStatus,
    },
  });
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

export async function deleteEvent(formData: FormData) {
  await prisma.event.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/eventos");
}
