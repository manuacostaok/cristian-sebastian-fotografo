import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().optional(),
  phone: z.string().min(6),
  eventType: z.string().min(1),
  eventDate: z.string().min(1),
  location: z.string().optional(),
  requiresCustomQuote: z.boolean(),
  items: z.array(z.object({ id: z.string(), name: z.string(), price: z.number() })),
  total: z.number(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone, eventType, eventDate, location, requiresCustomQuote, items, total } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      email: email || null,
      phone,
      eventType,
      eventDate: new Date(eventDate),
      location,
      source: "WEB",
      status: requiresCustomQuote ? "NEW" : "QUOTE_SENT",
      estimatedTotal: requiresCustomQuote ? null : total,
      message: requiresCustomQuote
        ? "Solicitud de presupuesto personalizado vía wizard."
        : `Presupuesto vía wizard: ${items.map((i) => i.name).join(", ")}`,
    },
  });

  if (!requiresCustomQuote && items.length > 0) {
    await prisma.quote.create({
      data: {
        leadId: lead.id,
        items,
        total,
        status: "SENT",
      },
    });
  }

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
