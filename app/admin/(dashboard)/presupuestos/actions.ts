"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { QuoteStatus } from "@prisma/client";

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  await prisma.quote.update({ where: { id }, data: { status } });
  revalidatePath("/admin/presupuestos");
}
