/**
 * Preferred imports:
 * - `import { getDb, assets } from "@repo/db"` for app code
 * - `import { assets, type AssetRow } from "@repo/db/schema"` for schema-only use
 * - `import { getDb, closeDb } from "@repo/db/client"` for client-only use
 */
export { closeDb, createDb, getDb, type Database } from "./client";
export * from "./schema";
