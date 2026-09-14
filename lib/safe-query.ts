/**
 * Wraps a Prisma call so admin pages degrade to an empty state instead of
 * crashing when DATABASE_URL isn't configured yet (pre-launch) or the DB is
 * briefly unreachable — never swallows errors outside that boundary.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[db] query failed, falling back:", err);
    return fallback;
  }
}
