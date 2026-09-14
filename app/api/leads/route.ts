import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { inferLeadSource } from "@/lib/analytics";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields humans never see. Pretend success so
  // scrapers can't tell they were caught, but never touch the database.
  if (parsed.data.website) {
    return NextResponse.json({ id: "ok" }, { status: 201 });
  }

  if (isRateLimited(`leads:${getClientIp(request)}`)) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    location,
    guestCount,
    message,
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
      guestCount: guestCount ? parseInt(guestCount, 10) : null,
      message,
      source: inferLeadSource(utmSource, referrer),
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      activities: { create: { type: "created", text: "Consulta recibida desde el sitio." } },
    },
  });

  await prisma.analyticsEvent
    .create({ data: { type: "lead_created", source: utmSource || null, meta: { leadId: lead.id } } })
    .catch(() => {});

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
