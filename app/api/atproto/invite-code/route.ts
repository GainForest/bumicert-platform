"use server";

import { NextRequest } from "next/server";
import {
  allowedPDSDomains,
  defaultPdsDomain,
  type AllowedPDSDomain,
} from "@/config/gainforest-sdk";
import {
  fetchExistingInvites,
  isInviteCodeError,
  mintInviteCodes,
} from "@/lib/atproto/invites";
import { getSupabaseAdmin } from "@/lib/supabase/server";

if (!process.env.INVITE_CODES_PASSWORD) {
  throw new Error("Missing INVITE_CODES_PASSWORD env var");
}
if (!process.env.PDS_ADMIN_IDENTIFIER || !process.env.PDS_ADMIN_PASSWORD) {
  throw new Error("Missing PDS_ADMIN_IDENTIFIER / PDS_ADMIN_PASSWORD env vars");
}

export async function POST(req: NextRequest) {
  try {
    // --- Parse & normalize body ---
    const body = (await req.json()) as {
      email?: string;
      emails?: string[];
      password?: string;
      pdsDomain?: string;
    };

    const emailsInput =
      Array.isArray(body.emails) && body.emails.length > 0
        ? body.emails
      : body.email ? [body.email]
      : [];

    const pdsDomain = (body.pdsDomain ?? defaultPdsDomain)
      .trim()
      .toLowerCase();

    let emails = emailsInput
      .map((e) => (e ?? "").trim().toLowerCase())
      .filter(Boolean);

      // hard code use count so that only one use per invite code
    const useCount = 1;

    if (emails.length === 0) {
      return new Response(JSON.stringify({ error: "BadRequest", message: "Missing required email(s)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!allowedPDSDomains.includes(pdsDomain as AllowedPDSDomain)) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Unsupported pdsDomain",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!Number.isInteger(useCount) || useCount <= 0) {
      return new Response(JSON.stringify({ error: "BadRequest", message: "`useCount` must be a positive integer" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Allow "insecure" password for onboarding flow (works in all environments for testing)
    const isInsecureMode = (body.password ?? "") === "insecure";
    const isAdmin =
      isInsecureMode ||
      process.env.INVITE_CODES_PASSWORD === (body.password ?? "");

    if (!isAdmin) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Invalid admin credentials",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
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

    let existingInvites: { email: string; inviteCode: string }[] = [];

    // When using "insecure" mode, check if invite codes already exist in the database
    if (isInsecureMode) {
      try {
        existingInvites = await fetchExistingInvites(
          supabase,
          emails,
          pdsDomain as AllowedPDSDomain
        );

        const existingEmails = new Set(
          existingInvites.map((invite) => invite.email)
        );
        const emailsNeedingNewCodes = emails.filter(
          (email) => !existingEmails.has(email)
        );

        // If all emails have existing invite codes, return them
        if (emailsNeedingNewCodes.length === 0) {
          return Response.json({ invites: existingInvites });
        }

        // Only create new codes for emails that don't have one
        emails = emailsNeedingNewCodes;
      } catch (dbErr) {
        console.error("Failed to check existing invites:", dbErr);
        // Continue with normal flow if DB check fails
      }
    }

    // so N codes for N emails  with use count being 1
    const codeCount = emails.length;

    // If all emails already had codes (codeCount is 0), we would have returned earlier
    if (codeCount === 0) {
      return Response.json({ invites: existingInvites });
    }

    const minted = await mintInviteCodes(
      pdsDomain as AllowedPDSDomain,
      codeCount
    );

    // Pair first N codes to N emails; insert each mapping
    const results: { email: string; inviteCode: string }[] = [];
    const insertRows = emails.map((email, index) => ({
      email,
      invite_token: minted[index],
      pds_domain: pdsDomain,
    }));

    const insertResult = await supabase.from("invites").insert(insertRows);
    if (insertResult.error) {
      console.error("Failed to insert invite(s):", insertResult.error);
      return Response.json(
        { error: "DatabaseError", message: "Failed to persist invite(s)" },
        { status: 500 }
      );
    }

    for (let i = 0; i < emails.length; i++) {
      results.push({ email: emails[i], inviteCode: minted[i] });
    }

    const allInvites = [...existingInvites, ...results];
    return Response.json({ invites: allInvites });
  } catch (err) {
    if (isInviteCodeError(err)) {
      return Response.json(err.payload, { status: err.status });
    }

    console.error("Unexpected error:", err);
    return Response.json(
      {
        error: "InternalServerError",
        message: (err as Record<string, string>)?.message ||
          "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
