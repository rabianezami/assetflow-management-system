import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync } from "node:fs";
import { createConnection } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import EmbeddedPostgres from "embedded-postgres";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");

loadEnv({ path: resolve(repoRoot, ".env") });
loadEnv({ path: resolve(packageRoot, ".env") });

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/assetflow";
const parsed = new URL(databaseUrl);
const user = decodeURIComponent(parsed.username || "postgres");
const password = decodeURIComponent(parsed.password || "postgres");
const port = Number(parsed.port || 5432);
const database = parsed.pathname.replace(/^\//, "") || "assetflow";
const databaseDir = resolve(packageRoot, ".data/postgres");

function isPortOpen(host, checkPort) {
  return new Promise((resolvePromise) => {
    const socket = createConnection({ host, port: checkPort });
    socket.setTimeout(1000);
    socket.once("connect", () => {
      socket.destroy();
      resolvePromise(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolvePromise(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolvePromise(false);
    });
  });
}

async function canConnect() {
  const sql = postgres(databaseUrl, { connect_timeout: 3, max: 1 });
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  } finally {
    await sql.end({ timeout: 1 });
  }
}

async function keepAlive(pg) {
  console.log(
    `[@repo/db] Embedded PostgreSQL is running on localhost:${port} (database: ${database}).`,
  );
  console.log("[@repo/db] Keep this process open, then run: pnpm db:migrate");
  console.log("[@repo/db] Press Ctrl+C to stop.");

  const shutdown = async () => {
    console.log("\n[@repo/db] Stopping embedded PostgreSQL...");
    try {
      await pg.stop();
    } catch {
      // ignore stop errors during shutdown
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  await new Promise(() => {});
}

mkdirSync(databaseDir, { recursive: true });

const alreadyInitialized = existsSync(resolve(databaseDir, "PG_VERSION"));
const portOpen = await isPortOpen("127.0.0.1", port);
const alreadyConnectable = portOpen ? await canConnect() : false;

if (alreadyConnectable) {
  console.log(
    `[@repo/db] PostgreSQL is already running on localhost:${port} (database: ${database}).`,
  );
  console.log("[@repo/db] You can run: pnpm db:migrate");
  process.exit(0);
}

if (portOpen && !alreadyConnectable) {
  console.error(
    `[@repo/db] Port ${port} is already in use, but DATABASE_URL could not connect.`,
  );
  console.error(
    "[@repo/db] Stop the other process (`pnpm db:down`) or fix DATABASE_URL, then retry `pnpm db:up`.",
  );
  process.exit(1);
}

const pg = new EmbeddedPostgres({
  databaseDir,
  user,
  password,
  port,
  persistent: true,
  onLog: (message) => {
    if (process.env.DEBUG_EMBEDDED_PG === "1") {
      console.log(message);
    }
  },
  onError: (message) => {
    console.error(message);
  },
});

try {
  if (!alreadyInitialized) {
    await pg.initialise();
  }
  await pg.start();

  try {
    await pg.createDatabase(database);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/already exists/i.test(message)) {
      throw err;
    }
  }

  await keepAlive(pg);
} catch (err) {
  const message =
    (err instanceof Error && err.message) ||
    (err && typeof err === "object"
      ? JSON.stringify(err)
      : String(err)) ||
    "unknown error";

  console.error(`[@repo/db] Failed to start embedded PostgreSQL: ${message}`);
  if (portOpen) {
    console.error(
      `[@repo/db] Port ${port} is already in use. If a previous db:up is still running, reuse it or run pnpm db:down, then retry.`,
    );
  }
  process.exit(1);
}
