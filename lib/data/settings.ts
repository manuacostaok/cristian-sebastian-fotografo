import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

export async function getWhatsAppNumber(): Promise<string> {
  const settings = await safeQuery(() => prisma.settings.findUnique({ where: { id: "settings" } }), null);
  return settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export async function getInstagramUrl(): Promise<string> {
  const settings = await safeQuery(() => prisma.settings.findUnique({ where: { id: "settings" } }), null);
  return settings?.instagramUrl || process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
}
