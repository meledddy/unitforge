import { createDb, type Database } from "@unitforge/db";

import { getRuntimeEnvValue, loadAppRuntimeEnv } from "./runtime-env";

const globalForDb = globalThis as typeof globalThis & {
  __unitforgeDb?: Database;
};

export function getServerDb() {
  loadAppRuntimeEnv();

  const connectionString = getRuntimeEnvValue("DATABASE_URL");

  if (!connectionString) {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    return createDb(connectionString);
  }

  if (!globalForDb.__unitforgeDb) {
    globalForDb.__unitforgeDb = createDb(connectionString);
  }

  return globalForDb.__unitforgeDb;
}

export function isServerDbConfigured() {
  return Boolean(getRuntimeEnvValue("DATABASE_URL"));
}
