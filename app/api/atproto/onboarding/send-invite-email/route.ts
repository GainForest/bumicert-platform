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
