"use client";

import { useTransition } from "react";
import { updateQuoteStatus } from "@/app/admin/(dashboard)/presupuestos/actions";
import type { QuoteStatus } from "@prisma/client";

const OPTIONS: QuoteStatus[] = ["DRAFT", "SENT", "ACCEPTED", "DECLINED"];

const LABELS: Record<QuoteStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  ACCEPTED: "Aceptado",
  DECLINED: "Rechazado",
};

export function QuoteStatusSelect({ id, status }: { id: string; status: QuoteStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateQuoteStatus(id, e.target.value as QuoteStatus))}
      className="border border-paper-line bg-transparent px-2 py-1 text-xs uppercase tracking-[0.06em] disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {LABELS[opt]}
        </option>
      ))}
    </select>
  );
}
