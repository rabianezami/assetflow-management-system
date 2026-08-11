import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import EmbeddedPostgres from "embedded-postgres";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");
const databaseDir = resolve(packageRoot, ".data/postgres");

loadEnv({ path: resolve(repoRoot, ".env") });
loadEnv({ path: resolve(packageRoot, ".env") });

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/assetflow";
const parsed = new URL(databaseUrl);
const user = decodeURIComponent(parsed.username || "postgres");
const password = decodeURIComponent(parsed.password || "postgres");
const port = Number(parsed.port || 5432);

function run(command, args, { shell = false, cwd } = {}) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, { stdio: "inherit", shell, cwd });
    child.on("exit", (code) => resolvePromise(code ?? 1));
    child.on("error", () => resolvePromise(1));
  });
}

const dockerCode = await run(
  `docker compose -f "${resolve(repoRoot, "docker-compose.yml")}" down`,
  [],
  { shell: true, cwd: repoRoot },
);

if (dockerCode === 0) {
  console.log("[@repo/db] Docker Compose PostgreSQL stopped.");
}

if (!existsSync(resolve(databaseDir, "PG_VERSION"))) {
  if (dockerCode !== 0) {
    console.log("[@repo/db] No local embedded PostgreSQL data directory found.");
  }
  process.exit(0);
}

const pg = new EmbeddedPostgres({
  databaseDir,
  user,
  password,
  port,
  persistent: true,
  onLog: () => {},
  onError: () => {},
});

try {
  await pg.stop();
  console.log("[@repo/db] Embedded PostgreSQL stopped.");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(
    `[@repo/db] Could not stop embedded PostgreSQL cleanly: ${message || "unknown error"}`,
  );
  console.error(
    "[@repo/db] If postgres processes are stuck, end them in Task Manager, then retry.",
  );
  process.exit(1);
}
