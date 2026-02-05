import { NextRequest } from "next/server";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";

/**
 * POST /api/atproto/reset-password
 *
 * Resets a user's password using the token received via email.
 * Proxies to: com.atproto.server.resetPassword
 *
 * Security measures:
 * - Rate limited by IP (10 attempts per 15 minutes)
 * - Returns generic error message for all token-related errors
 *
 * Request body: { token: string, password: string }
 * Response: 200 OK on success
 * Errors: 400 (generic), 429 (rate limited)
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Check IP-based rate limit
    const ipLimit = await checkRateLimit(
      `ip:${clientIp}`,
      "reset-password",
      RATE_LIMITS.passwordReset.byIp
    );

    if (!ipLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "TooManyRequests",
          message: "Too many attempts. Please try again later.",
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

    // 2. Record the attempt
    await recordRateLimitAttempt(`ip:${clientIp}`, "reset-password");

    const body = (await req.json()) as { token?: string; password?: string };
    let { token, password } = body;
    token = (token ?? "").trim();
    password = (password ?? "").trim();

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Reset token is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!password) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "New password is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Basic password validation (minimum 8 characters)
    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Password must be at least 8 characters long",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const service = allowedPDSDomains[0];

    const response = await fetch(
      `https://${service}/xrpc/com.atproto.server.resetPassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Password reset failed:", error);

      // Return generic error message for all token-related errors
      // This prevents enumeration of valid tokens
      return new Response(
        JSON.stringify({
          error: "InvalidToken",
          message:
            "Invalid or expired reset code. Please request a new password reset.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Unexpected error in reset-password:", err);
    return new Response(
      JSON.stringify({
        error: "InternalServerError",
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
