import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "../..");

function run(command, args, { shell = false, cwd, env } = {}) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell,
      cwd,
      env,
    });
    child.on("exit", (code) => resolvePromise(code ?? 1));
    child.on("error", () => resolvePromise(1));
  });
}

// Use a single shell command so Windows path quoting stays simple.
const dockerCode = await run(
  `docker compose -f "${resolve(repoRoot, "docker-compose.yml")}" up -d postgres`,
  [],
  { shell: true, cwd: repoRoot },
);

if (dockerCode === 0) {
  console.log("[@repo/db] PostgreSQL started with Docker Compose.");
  process.exit(0);
}

console.log(
  "[@repo/db] Docker not available. Starting embedded PostgreSQL instead...",
);

const embeddedCode = await run(
  process.execPath,
  [resolve(packageRoot, "scripts/start-embedded-postgres.mjs")],
  {
    shell: false,
    cwd: packageRoot,
    env: process.env,
  },
);

process.exit(embeddedCode);
