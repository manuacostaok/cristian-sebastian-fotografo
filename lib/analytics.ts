import type { LeadSource } from "@prisma/client";

const UTM_STORAGE_KEY = "cs_utm";

export type StoredUtm = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

/**
 * Reads utm_* params from the current URL (if any) and persists them in
 * localStorage. Visitors usually land via an Instagram bio link with UTMs
 * but submit the form from a different page later, so this has to survive
 * navigation, not just be read from the current URL at submit time.
 */
export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: StoredUtm = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
  };
  const hasAny = Object.values(utm).some(Boolean);
  if (!hasAny) return;

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // localStorage unavailable (private mode, etc.) — non-critical, skip silently.
  }
}

export function getStoredUtm(): StoredUtm {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Best-effort mapping from UTM/referrer text to the Lead.source enum. */
export function inferLeadSource(utmSource?: string | null, referrer?: string | null): LeadSource {
  const s = (utmSource || referrer || "").toLowerCase();
  if (s.includes("instagram")) return "INSTAGRAM";
  if (s.includes("google")) return "GOOGLE";
  if (s.includes("whatsapp") || s.includes("wa.me")) return "WHATSAPP";
  if (!s) return "DIRECT";
  return "WEB";
}
