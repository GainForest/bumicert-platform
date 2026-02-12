import {
  allowedPDSDomains,
  defaultPdsDomain,
  type AllowedPDSDomain,
} from "@/config/gainforest-sdk";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const requestSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().trim().min(1, "Password is required"),
  handle: z.string().trim().min(1, "Handle is required"),
  inviteCode: z.string().trim().min(1, "Invite code is required"),
  pdsDomain: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .default(defaultPdsDomain)
    .refine(
      (value) => allowedPDSDomains.includes(value as AllowedPDSDomain),
      { message: "Unsupported pdsDomain" }
    ),
  updateCookies: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return Response.json(
        {
          error: "BadRequest",
          message: "Invalid request body",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password, handle, inviteCode, pdsDomain } = parsed.data;

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

    const inviteResult = await supabase
      .from("invites")
      .select("*")
      .eq("invite_token", inviteCode)
      .eq("pds_domain", pdsDomain)
      .maybeSingle();

    if (inviteResult.error) {
      console.error("Database error checking invite:", inviteResult.error);
      return Response.json(
        { error: "DatabaseError", message: "Failed to check invite code" },
        { status: 500 }
      );
    }

    if (!inviteResult.data) {
      return Response.json(
        { error: "InvalidInvite", message: "Invite code not found" },
        { status: 400 }
      );
    }

    if (inviteResult.data.email !== email) {
      return Response.json(
        { error: "InvalidInvite", message: "Invite code does not match email" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://${pdsDomain}/xrpc/com.atproto.server.createAccount`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, handle, inviteCode }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Account creation failed:", error);
      return Response.json(error, { status: response.status });
    }

    const data = (await response.json()) as {
      handle: string;
      did: string;
    };

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
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
