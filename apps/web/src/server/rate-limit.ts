import { createHash } from "node:crypto";

import { headers } from "next/headers";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface ConsumeRateLimitInput {
  namespace: string;
  identityParts: Array<string | null | undefined>;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

type HeaderStore = {
  get(name: string): string | null;
};

const MAX_BUCKETS = 5_000;
const SWEEP_INTERVAL_MS = 60_000;

// Lightweight pilot guard: this is process-local memory, so multi-instance
// production deployments should replace it with a shared store.
const globalForRateLimit = globalThis as typeof globalThis & {
  __unitforgeRateLimitBuckets?: Map<string, RateLimitBucket>;
  __unitforgeRateLimitLastSweep?: number;
};

function getRateLimitBuckets() {
  if (!globalForRateLimit.__unitforgeRateLimitBuckets) {
    globalForRateLimit.__unitforgeRateLimitBuckets = new Map<
      string,
      RateLimitBucket
    >();
  }

  return globalForRateLimit.__unitforgeRateLimitBuckets;
}

export async function getRateLimitClientIp() {
  try {
    return getClientIpFromHeaders(await headers());
  } catch {
    return null;
  }
}

export function consumeRateLimit(
  input: ConsumeRateLimitInput,
): RateLimitResult {
  const now = Date.now();
  const buckets = getRateLimitBuckets();
  const key = getBucketKey(input.namespace, input.identityParts);
  let bucket = buckets.get(key);

  sweepExpiredBuckets(buckets, now);

  if (!bucket || bucket.resetAt <= now) {
    bucket = {
      count: 0,
      resetAt: now + input.windowMs,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((bucket.resetAt - now) / 1000),
  );
  const remaining = Math.max(0, input.limit - bucket.count);

  return {
    allowed: bucket.count <= input.limit,
    retryAfterSeconds,
    remaining,
  };
}

export function resetRateLimit(
  namespace: string,
  identityParts: Array<string | null | undefined>,
) {
  getRateLimitBuckets().delete(getBucketKey(namespace, identityParts));
}

function getClientIpFromHeaders(headerStore: HeaderStore) {
  if (!trustProxyHeaders()) {
    return null;
  }

  const forwardedFor = headerStore.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    headerStore.get("cf-connecting-ip")?.trim() ||
    headerStore.get("true-client-ip")?.trim() ||
    headerStore.get("x-real-ip")?.trim() ||
    forwardedIp ||
    null
  );
}

function trustProxyHeaders() {
  return (
    process.env.TRUST_PROXY_HEADERS === "true" ||
    process.env.VERCEL === "1" ||
    Boolean(process.env.CF_PAGES)
  );
}

function getBucketKey(
  namespace: string,
  identityParts: Array<string | null | undefined>,
) {
  return `${namespace}:${hashIdentity(identityParts)}`;
}

function hashIdentity(identityParts: Array<string | null | undefined>) {
  const normalizedIdentity = identityParts
    .map((part) => part?.trim().toLowerCase() || "unknown")
    .join("|")
    .slice(0, 1_000);

  return createHash("sha256").update(normalizedIdentity).digest("hex");
}

function sweepExpiredBuckets(
  buckets: Map<string, RateLimitBucket>,
  now: number,
) {
  const lastSweep = globalForRateLimit.__unitforgeRateLimitLastSweep ?? 0;

  if (now - lastSweep < SWEEP_INTERVAL_MS && buckets.size <= MAX_BUCKETS) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  while (buckets.size > MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;

    if (!oldestKey) {
      break;
    }

    buckets.delete(oldestKey);
  }

  globalForRateLimit.__unitforgeRateLimitLastSweep = now;
}
