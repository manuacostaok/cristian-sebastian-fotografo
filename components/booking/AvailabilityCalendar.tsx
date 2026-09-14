import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toKey } from "@/lib/data/availability";
import type { AvailabilityStatus } from "@/lib/types";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const STATUS_STYLE: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-transparent text-ink hover:bg-paper-dim",
  CONSULT: "bg-gold/15 text-ink",
  BUSY: "bg-ink/6 text-paper-muted line-through decoration-paper-muted/40",
};

const STATUS_DOT: Record<AvailabilityStatus, string> = {
  AVAILABLE: "bg-emerald-600",
  CONSULT: "bg-gold",
  BUSY: "bg-paper-muted",
};

export function AvailabilityCalendar({
  year,
  month,
  availability,
}: {
  year: number;
  month: number;
  availability: Map<string, AvailabilityStatus>;
}) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const startOffset = (firstDay.getDay() + 6) % 7;

  const prev = month === 0 ? { y: year - 1, m: 11 } : { y: year, m: month - 1 };
  const next = month === 11 ? { y: year + 1, m: 0 } : { y: year, m: month + 1 };

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={`/disponibilidad?y=${prev.y}&m=${prev.m}`}
          aria-label="Mes anterior"
          className="p-2 hover:opacity-60"
        >
          <ChevronLeft size={20} />
        </Link>
        <h2 className="font-display text-2xl">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Link
          href={`/disponibilidad?y=${next.y}&m=${next.m}`}
          aria-label="Mes siguiente"
          className="p-2 hover:opacity-60"
        >
          <ChevronRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.1em] text-paper-muted">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="pb-3">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          // UTC-anchored so the key matches admin-set overrides (stored from
          // UTC-midnight "YYYY-MM-DD" input) regardless of the viewer's timezone.
          const date = new Date(Date.UTC(year, month, day));
          const key = toKey(date);
          const status = availability.get(key) ?? "AVAILABLE";
          const todayUTC = new Date(new Date().toISOString().slice(0, 10));
          const isPast = date < todayUTC;

          const content = (
            <div
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-sm text-sm transition-colors",
                STATUS_STYLE[status],
              )}
            >
              <span>{day}</span>
              {!isPast && <span className={cn("h-1 w-1 rounded-full", STATUS_DOT[status])} />}
            </div>
          );

          if (isPast || status === "BUSY") {
            return <div key={key}>{content}</div>;
          }

          return (
            <Link
              key={key}
              href={`/consultar?fecha=${key}`}
              aria-label={`Consultar disponibilidad para el ${day} de ${MONTH_NAMES[month]}`}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs text-paper-muted">
        <Legend color={STATUS_DOT.AVAILABLE} label="Disponible" />
        <Legend color={STATUS_DOT.CONSULT} label="Consultar" />
        <Legend color={STATUS_DOT.BUSY} label="Ocupado" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {label}
    </span>
  );
}
