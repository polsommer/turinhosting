import { redis } from "@/server/redis";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowSec: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  reset: number;
  retryAfter: number;
};

type MemoryEntry = {
  count: number;
  expiresAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitStore?: Map<string, MemoryEntry>;
};

const memoryStore = globalForRateLimit.rateLimitStore ?? new Map<string, MemoryEntry>();

if (!globalForRateLimit.rateLimitStore) {
  globalForRateLimit.rateLimitStore = memoryStore;
}

export async function rateLimit({
  key,
  limit,
  windowSec
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    const ttl = await redis.ttl(key);
    const retryAfter = ttl > 0 ? ttl : windowSec;
    const reset = now + retryAfter;

    return {
      ok: count <= limit,
      remaining: Math.max(0, limit - count),
      reset,
      retryAfter
    };
  }

  const entry = memoryStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowSec });
    return {
      ok: true,
      remaining: limit - 1,
      reset: now + windowSec,
      retryAfter: windowSec
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);

  return {
    ok: entry.count <= limit,
    remaining,
    reset: entry.expiresAt,
    retryAfter: Math.max(0, entry.expiresAt - now)
  };
}
