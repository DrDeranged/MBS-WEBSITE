type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export function createFixedWindowRateLimiter(
  limit: number,
  windowMs: number,
) {
  const entries = new Map<string, RateLimitEntry>();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (now > entry.resetAt) entries.delete(key);
    }
  }, Math.max(windowMs, 60_000));
  cleanup.unref();

  return (key: string) => {
    const now = Date.now();
    const entry = entries.get(key);
    if (!entry || now > entry.resetAt) {
      entries.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count += 1;
    return true;
  };
}