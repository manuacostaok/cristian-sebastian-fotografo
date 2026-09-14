import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set([
  "portfolio_view",
  "project_view",
  "whatsapp_click",
  "quote_started",
  "quote_completed",
  "contact_submitted",
  "lead_created",
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.type !== "string" || !VALID_TYPES.has(body.type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Fire-and-forget from the caller's perspective — never let analytics
  // failures surface to the visitor.
  await prisma.analyticsEvent
    .create({
      data: {
        type: body.type,
        source: typeof body.source === "string" ? body.source : null,
        meta: body.meta ?? undefined,
      },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
