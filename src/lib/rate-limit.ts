type AttemptRecord = {
  attempts: number;
  resetAt: number;
};

const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 6;

const globalForRateLimit = globalThis as unknown as {
  studioRateLimit?: Map<string, AttemptRecord>;
};

const store = globalForRateLimit.studioRateLimit ?? new Map<string, AttemptRecord>();
globalForRateLimit.studioRateLimit = store;

export function checkStudioRateLimit(ip: string) {
  const now = Date.now();
  const current = store.get(ip);

  if (!current || current.resetAt < now) {
    const next = { attempts: 1, resetAt: now + WINDOW_MS };
    store.set(ip, next);
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  if (current.attempts >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, current.resetAt - now)
    };
  }

  current.attempts += 1;
  store.set(ip, current);

  return {
    allowed: true,
    remaining: Math.max(0, MAX_ATTEMPTS - current.attempts),
    retryAfterMs: 0
  };
}
