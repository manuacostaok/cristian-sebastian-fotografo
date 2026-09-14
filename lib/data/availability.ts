import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import type { AvailabilityStatus } from "@/lib/types";

/**
 * Public availability for a month: explicit AvailabilityDay overrides take
 * priority; any day with a non-cancelled Event is BUSY; everything else
 * defaults to AVAILABLE. Falls back to an all-available month if the DB
 * isn't reachable yet, so the calendar page never crashes pre-launch.
 */
export async function getMonthAvailability(
  year: number,
  month: number, // 0-indexed
): Promise<Map<string, AvailabilityStatus>> {
  const rangeStart = new Date(year, month, 1);
  const rangeEnd = new Date(year, month + 1, 1);

  const [overrides, events] = await Promise.all([
    safeQuery(
      () => prisma.availabilityDay.findMany({ where: { date: { gte: rangeStart, lt: rangeEnd } } }),
      [] as { date: Date; status: AvailabilityStatus }[],
    ),
    safeQuery(
      () =>
        prisma.event.findMany({
          where: { date: { gte: rangeStart, lt: rangeEnd }, status: { not: "CANCELLED" } },
          select: { date: true },
        }),
      [] as { date: Date }[],
    ),
  ]);

  const map = new Map<string, AvailabilityStatus>();
  for (const e of events) map.set(toKey(e.date), "BUSY");
  for (const o of overrides) map.set(toKey(o.date), o.status);

  return map;
}

// Dates here are always UTC-midnight instants (parsed from "YYYY-MM-DD"
// strings) — UTC getters are required so the key reflects the intended
// calendar day regardless of the server/viewer's local timezone.
export function toKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}
