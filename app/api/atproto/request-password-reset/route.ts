import { NextRequest } from "next/server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";

/**
 * POST /api/atproto/request-password-reset
 *
 * Initiates a password reset by sending an email with a reset token to the user.
 * Proxies to: com.atproto.server.requestPasswordReset
 *
 * Security measures:
 * - Rate limited by IP (10 requests per hour)
 * - Rate limited by email (3 requests per 15 minutes)
 * - Always returns generic success message to prevent user enumeration
 *
 * Request body: { email: string }
 * Response: 200 OK with generic success message
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Check IP-based rate limit first (fail fast)
    const ipLimit = await checkRateLimit(
      `ip:${clientIp}`,
      "request-password-reset",
      RATE_LIMITS.passwordResetRequest.byIp
    );

    if (!ipLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "TooManyRequests",
          message: "Too many requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (ipLimit.resetAt.getTime() - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const body = (await req.json()) as { email?: string };
    let { email } = body;
    email = (email ?? "").trim().toLowerCase();

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Email is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Invalid email format",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Record IP attempt early to count all requests (even invalid emails)
    await recordRateLimitAttempt(`ip:${clientIp}`, "request-password-reset");

    // 2. Check email-based rate limit
    const emailLimit = await checkRateLimit(
      `email:${email}`,
      "request-password-reset",
      RATE_LIMITS.passwordResetRequest.byEmail
    );

    // 3. Record email attempt for every request (even blocked ones)
    // so the cooldown window keeps sliding and IP limits still apply
    await recordRateLimitAttempt(`email:${email}`, "request-password-reset");

    if (!emailLimit.allowed) {
      // Still return generic message to avoid enumeration
      // but don't actually call the PDS
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "If an account exists with this email, a password reset code has been sent.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const service = allowedPDSDomains[0];

    const response = await fetch(
      `https://${service}/xrpc/com.atproto.server.requestPasswordReset`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Password reset request failed:", error);
      // DON'T expose the error - always return generic success
      // This prevents user enumeration attacks
    }

    // 4. Always return generic success (prevents user enumeration)
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "If an account exists with this email, a password reset code has been sent.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Unexpected error in request-password-reset:", err);
    return new Response(
      JSON.stringify({
        error: "InternalServerError",
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
