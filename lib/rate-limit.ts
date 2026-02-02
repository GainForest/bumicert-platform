import { getSupabaseAdmin } from "@/lib/supabase/server";

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
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    // If Supabase isn't configured, allow the request (fail open)
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

  // Count attempts within the window
  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("endpoint", endpoint)
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("[RateLimit] Error checking rate limit:", error);
    // Fail open on error
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

  const { error } = await supabase
    .from("rate_limits")
    .insert({ identifier, endpoint });

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
  },
} as const;
