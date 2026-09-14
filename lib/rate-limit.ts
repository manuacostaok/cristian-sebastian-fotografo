/**
 * Best-effort in-memory rate limiter (per server instance). No Redis/KV in
 * this project — good enough to deter basic bots on a low-traffic site;
 * resets on cold start / deploy. Not a substitute for a real rate limiter
 * if traffic grows.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
