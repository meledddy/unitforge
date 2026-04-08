import "server-only";

import { createDb, type Database } from "@unitforge/db";

const globalForDb = globalThis as typeof globalThis & {
  __unitforgeDb?: Database;
};

export function getServerDb() {
  const connectionString = process.env.DATABASE_URL;

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
  return Boolean(process.env.DATABASE_URL);
}
