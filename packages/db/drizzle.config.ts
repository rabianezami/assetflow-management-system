import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(fileURLToPath(import.meta.url));

// Prefer repo-root .env so apps/web and @repo/db share DATABASE_URL.
loadEnv({ path: resolve(packageRoot, "../../.env") });
loadEnv({ path: resolve(packageRoot, ".env") });

const databaseUrl = process.env.DATABASE_URL;
const cliArgs = process.argv.slice(2).join(" ");
const needsLiveDatabase =
  cliArgs.includes("migrate") || cliArgs.includes("studio");

if (needsLiveDatabase && !databaseUrl) {
  throw new Error(
    "[@repo/db] DATABASE_URL is required for migrate/studio. Copy .env.example to the repo root .env.",
  );
}

if (!databaseUrl && !needsLiveDatabase) {
  console.warn(
    "[@repo/db] DATABASE_URL is not set. generate can continue; migrate/studio require it.",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Placeholder is only for generate when DATABASE_URL is unset.
    // migrate/studio fail fast above if DATABASE_URL is missing.
    url:
      databaseUrl ??
      "postgresql://127.0.0.1:0/drizzle_generate_placeholder",
  },
});
