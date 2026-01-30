/**
 * In-memory rate limiter using a sliding window approach.
 *
 * Usage in API routes:
 *
 *   import { rateLimit } from "@/lib/rate-limit";
 *
 *   const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });
 *
 *   export async function POST(request: NextRequest) {
 *     const ip = request.headers.get("x-forwarded-for") || "unknown";
 *     const { success } = await limiter.check(10, ip); // 10 requests per interval
 *     if (!success) {
 *       return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
 *     }
 *     // ... handle request
 *   }
 */

interface RateLimitOptions {
  /** Time window in milliseconds (default: 60,000 = 1 minute) */
  interval?: number;
  /** Max unique tokens to track (default: 500) */
  uniqueTokenPerInterval?: number;
}

interface TokenBucket {
  count: number;
  expiresAt: number;
}

export function rateLimit(options: RateLimitOptions = {}) {
  const { interval = 60_000, uniqueTokenPerInterval = 500 } = options;
  const tokenCache = new Map<string, TokenBucket>();

  // Periodic cleanup to prevent memory leaks
  const cleanup = () => {
    const now = Date.now();
    const entries = Array.from(tokenCache.entries());
    for (const entry of entries) {
      if (entry[1].expiresAt <= now) {
        tokenCache.delete(entry[0]);
      }
    }
    // If still too many, delete oldest entries
    if (tokenCache.size > uniqueTokenPerInterval) {
      const remaining = Array.from(tokenCache.entries());
      remaining.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
      const toDelete = remaining.slice(0, remaining.length - uniqueTokenPerInterval);
      for (const entry of toDelete) {
        tokenCache.delete(entry[0]);
      }
    }
  };

  return {
    check: async (
      limit: number,
      token: string
    ): Promise<{
      success: boolean;
      remaining: number;
      reset: number;
    }> => {
      const now = Date.now();

      // Clean up expired entries periodically
      if (tokenCache.size > uniqueTokenPerInterval * 0.9) {
        cleanup();
      }

      const existing = tokenCache.get(token);

      if (!existing || existing.expiresAt <= now) {
        // Create new bucket
        const expiresAt = now + interval;
        tokenCache.set(token, { count: 1, expiresAt });
        return { success: true, remaining: limit - 1, reset: expiresAt };
      }

      // Increment existing bucket
      existing.count++;

      if (existing.count > limit) {
        return {
          success: false,
          remaining: 0,
          reset: existing.expiresAt,
        };
      }

      return {
        success: true,
        remaining: limit - existing.count,
        reset: existing.expiresAt,
      };
    },
  };
}

/**
 * Pre-configured rate limiters for common use cases.
 */

/** Strict rate limit for payment/financial endpoints: 5 requests per minute */
export const paymentLimiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
});

/** Standard rate limit for authenticated endpoints: 30 requests per minute */
export const standardLimiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
});

/** Lenient rate limit for read-heavy endpoints: 60 requests per minute */
export const readLimiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
});
