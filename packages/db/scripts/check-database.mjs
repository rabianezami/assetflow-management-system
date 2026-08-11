import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");

// Load .env if present; exported DATABASE_URL still wins when already set.
loadEnv({ path: resolve(repoRoot, ".env") });
loadEnv({ path: resolve(packageRoot, ".env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "[@repo/db] DATABASE_URL is missing. Copy .env.example to the repo root .env, or export DATABASE_URL.",
  );
  process.exit(1);
}

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

function connectionErrorCode(err) {
  return err.code ?? err.cause?.code ?? null;
}

function connectionErrorMessage(err) {
  return err.message || err.cause?.message || String(err);
}

async function probeOnce(url) {
  const sql = postgres(url, { connect_timeout: 3, max: 1 });
  try {
    await sql`select 1`;
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      code: connectionErrorCode(err),
      message: connectionErrorMessage(err),
    };
  } finally {
    await sql.end({ timeout: 1 });
  }
}

const meta = describeUrl(databaseUrl);
const maxAttempts = 15;
const delayMs = 1000;
let lastFailure = null;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const result = await probeOnce(databaseUrl);
  if (result.ok) {
    process.exit(0);
  }

  lastFailure = result;
  const retryable =
    result.code === "ECONNREFUSED" ||
    result.code === "ECONNRESET" ||
    result.code === "57P03" ||
    /the database system is starting up/i.test(result.message);

  if (!retryable || attempt === maxAttempts) {
    break;
  }

  await new Promise((resolvePromise) => setTimeout(resolvePromise, delayMs));
}

const code = lastFailure?.code ?? null;
const message = lastFailure?.message ?? "unknown error";

if (code === "ECONNREFUSED") {
  console.error(
    `[@repo/db] Cannot connect to PostgreSQL at ${meta?.hostname}:${meta?.port} (ECONNREFUSED).`,
  );
  console.error(
    "[@repo/db] Start PostgreSQL first, then retry: pnpm db:up && pnpm db:migrate",
  );
} else if (code === "3D000") {
  console.error(
    `[@repo/db] Database "${meta?.database}" does not exist. Create it or run: pnpm db:up`,
  );
} else if (code === "28P01") {
  console.error(
    `[@repo/db] Password authentication failed for user "${meta?.username}". Check DATABASE_URL.`,
  );
} else {
  console.error(
    `[@repo/db] Database connection failed (${code ?? "unknown"}): ${message}`,
  );
}

process.exit(1);
