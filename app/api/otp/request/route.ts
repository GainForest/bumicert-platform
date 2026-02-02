import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  checkRateLimit,
  recordRateLimitAttempt,
  getClientIp,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { requestOtpSchema } from "../_lib/schema";
import {
  generateOtp,
  hashOtp,
  getOtpExpiration,
  OTP_EXPIRY_MINUTES,
} from "../_lib/otp";
import { sendOtpEmail } from "../_lib/email";

/**
 * POST /api/otp/request
 *
 * Generate and send an OTP to the specified email address.
 *
 * Security measures:
 * - Rate limited by IP (10 requests per hour)
 * - Rate limited by email (3 requests per 15 minutes)
 * - Always returns generic success message to prevent email enumeration
 * - Invalidates previous pending OTPs for same email+purpose
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Check IP-based rate limit
    const ipLimit = await checkRateLimit(
      `ip:${clientIp}`,
      "otp-request",
      RATE_LIMITS.otpRequest.byIp
    );

    if (!ipLimit.allowed) {
      return Response.json(
        {
          error: "TooManyRequests",
          message: "Too many requests. Please try again later.",
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

    // 2. Parse and validate request body
    const body = await req.json();
    const parseResult = requestOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json(
        {
          error: "BadRequest",
          message: parseResult.error.message || "Invalid request",
        },
        { status: 400 }
      );
    }

    const { email, purpose, metadata } = parseResult.data;

    // 3. Check email-based rate limit
    const emailLimit = await checkRateLimit(
      `email:${email}`,
      "otp-request",
      RATE_LIMITS.otpRequest.byEmail
    );

    if (!emailLimit.allowed) {
      // Return generic success to prevent enumeration
      return Response.json({
        success: true,
        message: "If this email is valid, a verification code has been sent.",
      });
    }

    // 4. Record rate limit attempts
    await recordRateLimitAttempt(`ip:${clientIp}`, "otp-request");
    await recordRateLimitAttempt(`email:${email}`, "otp-request");

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("[OTP Request] Supabase not configured");
      return Response.json(
        {
          error: "InternalServerError",
          message: "Service temporarily unavailable",
        },
        { status: 500 }
      );
    }

    // 5. Invalidate previous pending OTPs for this email+purpose
    await supabase
      .from("email_otps")
      .update({ verified_at: new Date().toISOString() })
      .eq("email", email)
      .eq("purpose", purpose)
      .is("verified_at", null);

    // 6. Generate and store new OTP
    const code = generateOtp();
    const hashedCode = hashOtp(code);
    const expiresAt = getOtpExpiration();

    const { error: insertError } = await supabase.from("email_otps").insert({
      email,
      code: hashedCode,
      purpose,
      expires_at: expiresAt.toISOString(),
      metadata: metadata || null,
    });

    if (insertError) {
      console.error("[OTP Request] Failed to store OTP:", insertError);
      return Response.json(
        {
          error: "InternalServerError",
          message: "Failed to generate verification code",
        },
        { status: 500 }
      );
    }

    // 7. Send OTP email
    const emailResult = await sendOtpEmail({
      to: email,
      code,
      purpose,
      expiryMinutes: OTP_EXPIRY_MINUTES,
    });

    if (!emailResult.success) {
      console.error("[OTP Request] Failed to send email:", emailResult.error);
      // Still return success to prevent enumeration
    }

    // 8. Return generic success
    return Response.json({
      success: true,
      message: "If this email is valid, a verification code has been sent.",
    });
  } catch (err) {
    console.error("[OTP Request] Unexpected error:", err);
    return Response.json(
      {
        error: "InternalServerError",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
