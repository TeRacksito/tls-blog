const ipBucketState = new Map<string, { count: number; resetAt: number }>();

function getBucketKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

function getNow(): number {
  return Date.now();
}

export const rateLimiter = {
  consume(options: {
    namespace: string;
    key: string;
    limit: number;
    windowMs: number;
  }): { allowed: boolean; retryAfterSeconds: number } {
    const bucketKey = getBucketKey(options.namespace, options.key);
    const current = ipBucketState.get(bucketKey);
    const now = getNow();

    if (!current || now >= current.resetAt) {
      ipBucketState.set(bucketKey, {
        count: 1,
        resetAt: now + options.windowMs,
      });

      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= options.limit) {
      const retryAfterMs = Math.max(0, current.resetAt - now);
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      };
    }

    current.count += 1;
    ipBucketState.set(bucketKey, current);

    return { allowed: true, retryAfterSeconds: 0 };
  },
};
