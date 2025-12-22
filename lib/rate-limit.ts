/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis or a similar solution
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanupExpired(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  // Maximum number of requests allowed
  limit: number;
  // Time window in milliseconds
  windowMs: number;
  // Identifier prefix for different endpoints
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key (usually IP address or user ID)
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const identifier = config.identifier ? `${config.identifier}:${key}` : key;

  const entry = rateLimitStore.get(identifier);

  // If no entry or expired, create new one
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Increment count
  entry.count += 1;

  // Check if over limit
  if (entry.count > config.limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request
 * Handles various proxy headers
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP in the list (original client)
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback for Vercel
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  // Default fallback
  return "unknown";
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  // General API: 100 requests per minute
  api: {
    limit: 100,
    windowMs: 60 * 1000,
    identifier: "api",
  },

  // Strict: 10 requests per minute (for sensitive operations)
  strict: {
    limit: 10,
    windowMs: 60 * 1000,
    identifier: "strict",
  },

  // Auth: 5 login attempts per 15 minutes
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000,
    identifier: "auth",
  },

  // Order: 10 orders per hour (prevent abuse)
  order: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
    identifier: "order",
  },

  // Webhook: 100 webhooks per minute (from payment provider)
  webhook: {
    limit: 100,
    windowMs: 60 * 1000,
    identifier: "webhook",
  },
};

/**
 * Helper function to create rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.remaining + (result.success ? 1 : 0)),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
    ...(result.retryAfter && { "Retry-After": String(result.retryAfter) }),
  };
}

/**
 * Apply rate limiting to a request
 * Returns a Response if rate limited, null otherwise
 */
export function applyRateLimit(
  request: Request,
  config: RateLimitConfig = rateLimiters.api
): Response | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, config);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        message: "Trop de requêtes. Veuillez réessayer plus tard.",
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...getRateLimitHeaders(result),
        },
      }
    );
  }

  return null;
}
