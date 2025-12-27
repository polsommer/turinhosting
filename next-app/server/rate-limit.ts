import { redis } from "@/server/redis";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit({
  key,
  limit,
  windowMs
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();

  if (redis) {
    const redisKey = `rate:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, windowMs);
    }
    const ttl = await redis.pttl(redisKey);
    const resetAt = ttl > 0 ? now + ttl : now + windowMs;
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt
    };
  }

  const existing = memoryStore.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;
  memoryStore.set(key, existing);

  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt
  };
}
