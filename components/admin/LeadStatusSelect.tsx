"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/admin/(dashboard)/leads/actions";
import type { LeadStatus } from "@prisma/client";

const OPTIONS: LeadStatus[] = ["NEW", "CONTACTED", "QUOTE_SENT", "CONFIRMED", "LOST"];

const LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  QUOTE_SENT: "Presupuesto enviado",
  CONFIRMED: "Confirmado",
  LOST: "Perdido",
};

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateLeadStatus(id, e.target.value as LeadStatus))}
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
