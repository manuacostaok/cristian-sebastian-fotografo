import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone, eventType, eventDate, location, guestCount, message } = parsed.data;

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
      source: "WEB",
    },
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
