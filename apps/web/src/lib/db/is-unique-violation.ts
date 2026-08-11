/** Walk nested postgres.js / Drizzle errors for PostgreSQL unique_violation (23505). */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (typeof current !== "object" || current === null) {
      break;
    }
    if ("code" in current && String(current.code) === "23505") {
      return true;
    }
    if ("cause" in current) {
      current = current.cause;
      continue;
    }
    if ("errors" in current && Array.isArray(current.errors)) {
      current = current.errors[0];
      continue;
    }
    break;
  }
  return false;
}
