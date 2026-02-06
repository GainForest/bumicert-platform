import { createHmac } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const RATE_LIMIT_HMAC_KEY = process.env.RATE_LIMIT_HMAC_KEY ?? "";

/**
 * Hash an identifier (email/IP) with HMAC-SHA256 to avoid storing PII in the rate_limits table.
 * Lookups remain deterministic because the same key + identifier always produce the same hash.
 */
function hashIdentifier(identifier: string): string {
  return createHmac("sha256", RATE_LIMIT_HMAC_KEY)
    .update(identifier)
    .digest("hex");
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Max attempts allowed in window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check if a request is within rate limits
 * Uses Supabase to track attempts in a sliding window
 *
 * In production, fails closed (blocks requests) when Supabase is unavailable.
 * In development or when RATE_LIMIT_FAIL_OPEN=true, fails open (allows requests).
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabase = getSupabaseAdmin();
  const failOpen =
    process.env.RATE_LIMIT_FAIL_OPEN === "true" ||
    process.env.NODE_ENV !== "production";

  if (!supabase) {
    if (!failOpen) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + config.windowMs),
      };
    }
    console.warn(
      "[RateLimit] Supabase not configured, skipping rate limit check"
    );
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetAt: new Date(),
    };
  }

  const windowStart = new Date(Date.now() - config.windowMs);
  const hashedIdentifier = hashIdentifier(identifier);

  // Count attempts within the window
  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", hashedIdentifier)
    .eq("endpoint", endpoint)
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("[RateLimit] Error checking rate limit:", error);
    if (!failOpen) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + config.windowMs),
      };
    }
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetAt: new Date(),
    };
  }

  const attempts = count ?? 0;
  const remaining = Math.max(0, config.maxAttempts - attempts);
  const resetAt = new Date(Date.now() + config.windowMs);

  return {
    allowed: attempts < config.maxAttempts,
    remaining,
    resetAt,
  };
}

/**
 * Record an attempt for rate limiting
 */
export async function recordRateLimitAttempt(
  identifier: string,
  endpoint: string
): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (!supabase) return;

  const hashedIdentifier = hashIdentifier(identifier);
  const { error } = await supabase
    .from("rate_limits")
    .insert({ identifier: hashedIdentifier, endpoint });

  if (error) {
    console.error("[RateLimit] Error recording attempt:", error);
  }
}

/**
 * Extract client IP from Next.js request headers
 */
export function getClientIp(headers: Headers): string {
  // Check common headers set by proxies/load balancers
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Vercel-specific header
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  return "unknown";
}

// Pre-configured rate limit settings
export const RATE_LIMITS = {
  passwordResetRequest: {
    byIp: { windowMs: 60 * 60 * 1000, maxAttempts: 10 }, // 10 per hour per IP
    byEmail: { windowMs: 15 * 60 * 1000, maxAttempts: 3 }, // 3 per 15 min per email
  },
  passwordReset: {
    byIp: { windowMs: 15 * 60 * 1000, maxAttempts: 10 }, // 10 per 15 min per IP
  },
  otpRequest: {
    byIp: { windowMs: 60 * 60 * 1000, maxAttempts: 10 }, // 10 per hour per IP
    byEmail: { windowMs: 15 * 60 * 1000, maxAttempts: 3 }, // 3 per 15 min per email
  },
  otpVerify: {
    byIp: { windowMs: 15 * 60 * 1000, maxAttempts: 10 }, // 10 per 15 min per IP
    byEmail: { windowMs: 15 * 60 * 1000, maxAttempts: 5 }, // 5 per 15 min per email
  },
} as const;
