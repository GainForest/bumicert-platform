import { NextRequest } from "next/server";
import { z } from "zod";
import { allowedPDSDomains, type AllowedPDSDomain } from "@/config/gainforest-sdk";
import { InviteCodeEmail } from "@/components/email/InviteCodeEmail";
import {
  getOrCreateInviteCode,
  isInviteCodeError,
} from "@/lib/atproto/invites";
import { getInviteEmailConfig, resend } from "@/lib/email/resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const requestSchema = z.object({
  email: z.email(),
  pdsDomain: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (value) => allowedPDSDomains.includes(value as AllowedPDSDomain),
      { message: "Unsupported pdsDomain" }
    ),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return Response.json(
        {
          error: "BadRequest",
          message: "Invalid request body",
          issues: parsed.error,
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return Response.json(
        {
          error: "ServerMisconfigured",
          message: "Supabase admin client not configured",
        },
        { status: 500 }
      );
    }

    const email = parsed.data.email;
    const pdsDomain = parsed.data.pdsDomain as AllowedPDSDomain;

    // Rate limiting check
    const rateLimitMinutes = parseInt(
      process.env.INVITE_EMAIL_RATE_LIMIT_MINUTES || "5"
    );
    const endpoint = "/api/atproto/onboarding/send-invite-email";

    const { data: recentLimits } = await supabase
      .from("rate_limits")
      .select("created_at")
      .eq("identifier", email)
      .eq("endpoint", endpoint)
      .order("created_at", { ascending: false })
      .limit(1);

    const rateLimit = recentLimits?.[0];
    if (rateLimit) {
      const minutesAgo =
        (Date.now() - new Date(rateLimit.created_at).getTime()) / 60000;

      if (minutesAgo < rateLimitMinutes) {
        const retryAfter = Math.ceil((rateLimitMinutes - minutesAgo) * 60); // seconds
        const retryAt = new Date(
          Date.now() + retryAfter * 1000
        ).toISOString();

        return Response.json(
          {
            error: "RateLimitExceeded",
            message: `Please wait ${Math.ceil(rateLimitMinutes - minutesAgo)} minute(s) before requesting another invite code`,
            retryAfter: retryAt,
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfter.toString(),
            },
          }
        );
      }
    }

    const inviteCode = await getOrCreateInviteCode(
      supabase,
      email,
      pdsDomain
    );

    const { from, subject } = getInviteEmailConfig();
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject,
      react: InviteCodeEmail({ inviteCode, pdsDomain }),
    });

    if (error) {
      console.error("Failed to send invite email:", error);
      return Response.json(
        { error: "EmailError", message: "Failed to send invite email" },
        { status: 502 }
      );
    }

    // Update rate limit after successful email send
    await supabase
      .from("rate_limits")
      .delete()
      .eq("identifier", email)
      .eq("endpoint", endpoint);

    await supabase.from("rate_limits").insert({
      identifier: email,
      endpoint: endpoint,
      created_at: new Date().toISOString(),
    });

    return Response.json({ success: true });
  } catch (err: unknown) {
    if (isInviteCodeError(err)) {
      return Response.json(err.payload, { status: err.status });
    }

    console.error("Unexpected error in send-invite-email:", err);
    return Response.json(
      {
        error: "InternalServerError",
        message:
          (err as Record<string, string>)?.message ||
          "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
