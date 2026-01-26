import { NextRequest } from "next/server";
import { allowedPDSDomains } from "@/config/climateai-sdk";

/**
 * POST /api/atproto/reset-password
 *
 * Resets a user's password using the token received via email.
 * Proxies to: com.atproto.server.resetPassword
 *
 * Request body: { token: string, password: string }
 * Response: 200 OK on success
 * Errors: 400 (InvalidRequest | ExpiredToken | InvalidToken)
 */
export async function POST(req: NextRequest) {
  try {
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

      // Map PDS error codes to user-friendly messages
      let userMessage = error.message || "Failed to reset password";
      if (error.error === "ExpiredToken") {
        userMessage =
          "This reset link is invalid. Please request a new password reset.";
      } else if (error.error === "InvalidToken") {
        userMessage =
          "This reset link is invalid. Please request a new password reset.";
      }

      return new Response(
        JSON.stringify({
          ...error,
          message: userMessage,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
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
        message:
          (err as Record<string, string>)?.message ||
          "Unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
