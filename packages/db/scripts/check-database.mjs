import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");

loadEnv({ path: resolve(repoRoot, ".env") });
loadEnv({ path: resolve(packageRoot, ".env") });

const databaseUrl = process.env.DATABASE_URL;

function describeUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      hostname: parsed.hostname,
      port: parsed.port || "5432",
      database: parsed.pathname.replace(/^\//, "") || null,
      username: parsed.username || null,
    };
  } catch {
    return null;
  }
}

if (!databaseUrl) {
  console.error(
    "[@repo/db] DATABASE_URL is missing. Copy .env.example to the repo root .env.",
  );
  process.exit(1);
}

if (!existsSync(resolve(repoRoot, ".env")) && !existsSync(resolve(packageRoot, ".env"))) {
  console.error(
    "[@repo/db] No .env file found. Copy .env.example to the repo root .env.",
  );
  process.exit(1);
}

const meta = describeUrl(databaseUrl);
const sql = postgres(databaseUrl, { connect_timeout: 5, max: 1 });
let exitCode = 0;

try {
  await sql`select 1`;
} catch (probeErr) {
  const code = probeErr.code ?? probeErr.cause?.code ?? null;
  const message =
    probeErr.message || probeErr.cause?.message || String(probeErr);

  if (code === "ECONNREFUSED") {
    console.error(
      `[@repo/db] Cannot connect to PostgreSQL at ${meta?.hostname}:${meta?.port} (ECONNREFUSED).`,
    );
    console.error(
      "[@repo/db] Start PostgreSQL first, then retry: pnpm db:up && pnpm db:migrate",
    );
  } else if (code === "3D000" || /database .* does not exist/i.test(message)) {
    console.error(
      `[@repo/db] Database "${meta?.database}" does not exist. Create it or run: pnpm db:up`,
    );
  } else if (
    code === "28P01" ||
    /password authentication failed/i.test(message)
  ) {
    console.error(
      `[@repo/db] Password authentication failed for user "${meta?.username}". Check DATABASE_URL in .env.`,
    );
  } else {
    console.error(
      `[@repo/db] Database connection failed (${code ?? "unknown"}): ${message}`,
    );
  }
  exitCode = 1;
} finally {
  await sql.end({ timeout: 1 });
}

if (exitCode !== 0) {
  process.exitCode = exitCode;
}
