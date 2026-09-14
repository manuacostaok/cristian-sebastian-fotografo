"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function convertLeadToClient(id: string) {
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });

  const client = await prisma.client.create({
    data: { name: lead.name, email: lead.email, phone: lead.phone },
  });

  await prisma.lead.update({
    where: { id },
    data: { clientId: client.id, status: "CONFIRMED" },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin/clientes");
}
