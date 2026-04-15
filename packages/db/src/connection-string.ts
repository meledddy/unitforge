const legacySslModeAliases = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");
    const usesLibpqCompat = url.searchParams.get("uselibpqcompat") === "true";

    if (!sslMode || usesLibpqCompat || !legacySslModeAliases.has(sslMode)) {
      return connectionString;
    }

    // pg currently treats these legacy modes as verify-full. Make that explicit
    // so runtime behavior stays stable when pg/pg-connection-string tighten semantics.
    url.searchParams.set("sslmode", "verify-full");

    return url.toString();
  } catch {
    return connectionString;
  }
}
