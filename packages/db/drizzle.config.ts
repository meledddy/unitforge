import path from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

import { normalizeDatabaseConnectionString } from "./src/connection-string";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(configDir, "../..");

loadEnv({ path: path.join(rootDir, ".env") });
loadEnv({ path: path.join(rootDir, ".env.local"), override: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: normalizeDatabaseConnectionString(
      process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/unitforge",
    ),
  },
});
