import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuoteDocument, type QuotePdfData } from "@/lib/pdf/QuoteDocument";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { lead: true, client: true },
  });
  if (!quote) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  const items = Array.isArray(quote.items) ? (quote.items as { name: string; price: number }[]) : [];

  const data: QuotePdfData = {
    id: quote.id,
    clientName: quote.lead?.name ?? quote.client?.name ?? "Cliente",
    clientPhone: quote.lead?.phone ?? quote.client?.phone ?? "",
    clientEmail: quote.lead?.email ?? quote.client?.email,
    eventType: quote.lead?.eventType,
    eventDate: quote.lead?.eventDate ?? null,
    location: quote.lead?.location,
    items,
    total: Number(quote.total),
    validUntil: quote.validUntil,
    createdAt: quote.createdAt,
    whatsappNumber: settings?.whatsappNumber || undefined,
  };

  const buffer = await renderToBuffer(QuoteDocument({ data }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="presupuesto-${quote.id.slice(-8)}.pdf"`,
    },
  });
}
