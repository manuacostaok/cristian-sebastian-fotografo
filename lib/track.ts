"use client";

import { getStoredUtm } from "@/lib/analytics";

export type TrackEventType =
  | "portfolio_view"
  | "project_view"
  | "whatsapp_click"
  | "quote_started"
  | "quote_completed"
  | "contact_submitted";

/**
 * Fire-and-forget client-side event tracking. Self-hosted (writes to
 * AnalyticsEvent via /api/track) — no third-party analytics provider
 * coupling, per the brief.
 */
export function track(type: TrackEventType, meta?: Record<string, unknown>) {
  const utm = getStoredUtm();
  const source = utm.utmSource || undefined;

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, source, meta }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never break the UX — ignore failures.
  });
}
