import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

type GlobalDbCache = {
  __assetflowDb?: Database;
  __assetflowPg?: Sql;
};

const globalForDb = globalThis as typeof globalThis & GlobalDbCache;

function requireDatabaseUrl(connectionString?: string): string {
  const url = connectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to the repo root .env (see .env.example).",
    );
  }
  return url;
}

/**
 * Create a fresh Drizzle client (tests / one-off scripts).
 * Prefer `getDb()` in Next.js so connections are reused.
 */
export function createDb(connectionString?: string): Database {
  const client = postgres(requireDatabaseUrl(connectionString), { max: 10 });
  return drizzle(client, { schema });
}

/**
 * Process-scoped Drizzle client for Next.js / long-running processes.
 * Reuses one postgres.js pool across hot reloads in development.
 */
export function getDb(connectionString?: string): Database {
  if (!globalForDb.__assetflowDb) {
    const client = postgres(requireDatabaseUrl(connectionString), { max: 10 });
    globalForDb.__assetflowPg = client;
    globalForDb.__assetflowDb = drizzle(client, { schema });
  }
  return globalForDb.__assetflowDb;
}

/** Close the shared pool (scripts / tests). */
export async function closeDb(): Promise<void> {
  if (globalForDb.__assetflowPg) {
    await globalForDb.__assetflowPg.end({ timeout: 5 });
    globalForDb.__assetflowPg = undefined;
    globalForDb.__assetflowDb = undefined;
  }
}
