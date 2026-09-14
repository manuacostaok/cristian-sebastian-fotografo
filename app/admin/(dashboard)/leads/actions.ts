"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeQuote } from "@/lib/pricing";
import type { LeadStatus } from "@prisma/client";

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUOTE_SENT: "Presupuesto enviado",
  CONFIRMED: "Confirmado",
  LOST: "Perdido",
};

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await prisma.lead.update({
    where: { id },
    data: {
      status,
      activities: { create: { type: "status_changed", text: `Estado cambiado a "${STATUS_LABELS[status]}".` } },
    },
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function convertLeadToClient(id: string) {
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });

  const client = await prisma.client.create({
    data: { name: lead.name, email: lead.email, phone: lead.phone },
  });

  await prisma.lead.update({
    where: { id },
    data: {
      clientId: client.id,
      status: "CONFIRMED",
      activities: { create: { type: "status_changed", text: "Convertido a cliente." } },
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/clientes");
}

export async function addLeadNote(formData: FormData) {
  const leadId = String(formData.get("leadId"));
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  await prisma.lead.update({
    where: { id: leadId },
    data: { activities: { create: { type: "note", text } } },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function setFollowUp(formData: FormData) {
  const leadId = String(formData.get("leadId"));
  const nextActionAt = String(formData.get("nextActionAt") ?? "");
  const nextActionNote = String(formData.get("nextActionNote") ?? "");

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      nextActionAt: nextActionAt ? new Date(nextActionAt) : null,
      nextActionNote: nextActionNote || null,
      activities: nextActionAt
        ? { create: { type: "follow_up", text: `Seguimiento fijado: ${nextActionNote || "sin nota"}.` } }
        : undefined,
    },
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function updateInternalNotes(formData: FormData) {
  const leadId = String(formData.get("leadId"));
  const internalNotes = String(formData.get("internalNotes") ?? "");

  await prisma.lead.update({ where: { id: leadId }, data: { internalNotes } });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function createQuoteFromLead(formData: FormData) {
  const leadId = String(formData.get("leadId"));
  const serviceId = String(formData.get("serviceId") ?? "");
  const extraIds = formData.getAll("extraIds").map(String);
  const validDays = Number(formData.get("validDays") ?? 15);

  const [service, extras] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.extra.findMany({ where: { id: { in: extraIds } } }),
  ]);
  if (!service) return;

  const quote = computeQuote(
    { id: service.id, name: service.name, basePrice: Number(service.basePrice), requiresCustomQuote: service.requiresCustomQuote },
    extras.map((e) => ({ id: e.id, name: e.name, price: Number(e.price) })),
  );

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);

  await prisma.quote.create({
    data: {
      leadId,
      items: quote.items,
      total: quote.total,
      status: "SENT",
      validUntil,
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "QUOTE_SENT",
      estimatedTotal: quote.total,
      activities: { create: { type: "quote_created", text: `Presupuesto creado manualmente: ${service.name}.` } },
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/presupuestos");
}

export async function createEventFromLead(formData: FormData) {
  const leadId = String(formData.get("leadId"));
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id: leadId } });

  let clientId = lead.clientId;
  if (!clientId) {
    const client = await prisma.client.create({
      data: { name: lead.name, email: lead.email, phone: lead.phone },
    });
    clientId = client.id;
  }

  const event = await prisma.event.create({
    data: {
      name: `${lead.eventType} — ${lead.name}`,
      date: lead.eventDate ?? new Date(),
      location: lead.location,
      clientId,
      status: "UPCOMING",
      visibility: "PRIVATE",
      totalPrice: lead.estimatedTotal,
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      clientId,
      status: "CONFIRMED",
      activities: { create: { type: "event_created", text: `Evento creado: ${event.name}.` } },
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/eventos");
  redirect(`/admin/eventos`);
}
