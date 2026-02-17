import { NextRequest } from "next/server";
import { allowedPDSDomains } from "@/config/climateai-sdk";

/**
 * POST /api/atproto/request-password-reset
 *
 * Initiates a password reset by sending an email with a reset token to the user.
 * Proxies to: com.atproto.server.requestPasswordReset
 *
 * Request body: { email: string }
 * Response: 200 OK (empty body on success)
 */
export async function POST(req: NextRequest) {
  try {
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
      return new Response(JSON.stringify(error), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return success (PDS will send the email)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Unexpected error in request-password-reset:", err);
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
