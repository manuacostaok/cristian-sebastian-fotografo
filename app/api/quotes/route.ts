import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { inferLeadSource } from "@/lib/analytics";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

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
  website: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

const QUOTE_VALIDITY_DAYS = 15;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ id: "ok" }, { status: 201 });
  }

  if (isRateLimited(`quotes:${getClientIp(request)}`)) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    location,
    requiresCustomQuote,
    items,
    total,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  } = parsed.data;

  const referrer = request.headers.get("referer");

  const lead = await prisma.lead.create({
    data: {
      name,
      email: email || null,
      phone,
      eventType,
      eventDate: new Date(eventDate),
      location,
      source: inferLeadSource(utmSource, referrer),
      status: requiresCustomQuote ? "NEW" : "QUOTE_SENT",
      estimatedTotal: requiresCustomQuote ? null : total,
      message: requiresCustomQuote
        ? "Solicitud de presupuesto personalizado vía wizard."
        : `Presupuesto vía wizard: ${items.map((i) => i.name).join(", ")}`,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      activities: {
        create: {
          type: "created",
          text: requiresCustomQuote
            ? "Solicitó presupuesto personalizado vía wizard."
            : "Completó el wizard de presupuesto.",
        },
      },
    },
  });

  if (!requiresCustomQuote && items.length > 0) {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + QUOTE_VALIDITY_DAYS);

    await prisma.quote.create({
      data: { leadId: lead.id, items, total, status: "SENT", validUntil },
    });
    await prisma.leadActivity.create({
      data: { leadId: lead.id, type: "quote_created", text: `Presupuesto automático generado.` },
    });
  }

  await prisma.analyticsEvent
    .create({ data: { type: "lead_created", source: utmSource || null, meta: { leadId: lead.id, viaWizard: true } } })
    .catch(() => {});

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
