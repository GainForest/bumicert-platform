import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { verifyOtpSchema } from "../_lib/schema";
import { verifyOtpHash, OTP_MAX_ATTEMPTS } from "../_lib/otp";

/**
 * POST /api/otp/verify
 *
 * Verify an OTP code against the specified email address.
 *
 * Security measures:
 * - Rate limited by IP (10 attempts per 15 minutes)
 * - Max 5 attempts per OTP before lockout
 * - Generic error messages prevent code enumeration
 * - Single-use: OTP marked as verified after success
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Check IP-based rate limit
    const ipLimit = await checkRateLimit(
      `ip:${clientIp}`,
      "otp-verify",
      RATE_LIMITS.otpVerify.byIp
    );

    if (!ipLimit.allowed) {
      return Response.json(
        {
          error: "TooManyRequests",
          message: "Too many attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (ipLimit.resetAt.getTime() - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // 2. Record rate limit attempt
    await recordRateLimitAttempt(`ip:${clientIp}`, "otp-verify");

    // 3. Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        {
          error: "BadRequest",
          message: "Invalid request",
        },
        { status: 400 }
      );
    }
    const parseResult = verifyOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json(
        {
          error: "BadRequest",
          message: "Invalid request",
        },
        { status: 400 }
      );
    }

    const { email, code, purpose } = parseResult.data;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("[OTP Verify] Supabase not configured");
      return Response.json(
        {
          error: "InternalServerError",
          message: "Service temporarily unavailable",
        },
        { status: 500 }
      );
    }

    // 4. Find the most recent unverified OTP for this email+purpose
    const { data: otpRecord, error: fetchError } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("purpose", purpose)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("[OTP Verify] Database error:", fetchError);
      return Response.json(
        {
          error: "InternalServerError",
          message: "Service temporarily unavailable",
        },
        { status: 500 }
      );
    }

    if (!otpRecord) {
      // No valid OTP found - return generic error
      return Response.json(
        {
          error: "InvalidOTP",
          message: "Invalid or expired code. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // 5. Check if max attempts exceeded
    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      return Response.json(
        {
          error: "TooManyAttempts",
          message: "Too many failed attempts. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // 6. Verify the code using constant-time comparison
    const isValid = verifyOtpHash(code, otpRecord.code);

    if (!isValid) {
      // Increment attempt counter with optimistic locking to avoid lost updates
      const { data: updatedAttempt, error: updateError } = await supabase
        .from("email_otps")
        .update({ attempts: otpRecord.attempts + 1 })
        .eq("id", otpRecord.id)
        .eq("attempts", otpRecord.attempts)
        .select("attempts")
        .maybeSingle();

      if (updateError) {
        console.error(
          "[OTP Verify] Failed to increment attempts:",
          updateError
        );
        return Response.json(
          {
            error: "InternalServerError",
            message: "Service temporarily unavailable",
          },
          { status: 500 }
        );
      }

      if (!updatedAttempt) {
        // Another request updated attempts first; treat as invalid attempt without leaking state
        return Response.json(
          {
            error: "InvalidOTP",
            message: "Invalid or expired code. Please request a new one.",
          },
          { status: 400 }
        );
      }

      return Response.json(
        {
          error: "InvalidOTP",
          message: "Invalid or expired code. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // 7. Mark OTP as verified (single-use)
    const { error: verifyError } = await supabase
      .from("email_otps")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", otpRecord.id);

    if (verifyError) {
      console.error(
        "[OTP Verify] Failed to mark OTP as verified:",
        verifyError
      );
      return Response.json(
        {
          error: "InternalServerError",
          message: "Verification failed. Please try again.",
        },
        { status: 500 }
      );
    }

    // 8. Return success
    return Response.json({
      success: true,
      verified: true,
    });
  } catch (err) {
    console.error("[OTP Verify] Unexpected error:", err);
    return Response.json(
      {
        error: "InternalServerError",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
