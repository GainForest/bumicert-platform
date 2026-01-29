"use server";

import { NextRequest } from "next/server";
import postgres from "postgres";

if (!process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING) {
  throw new Error("Missing POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING env var");
}
if (!process.env.INVITE_CODES_PASSWORD) {
  throw new Error("Missing INVITE_CODES_PASSWORD env var");
}
if (!process.env.PDS_ADMIN_IDENTIFIER || !process.env.PDS_ADMIN_PASSWORD) {
  throw new Error("Missing PDS_ADMIN_IDENTIFIER / PDS_ADMIN_PASSWORD env vars");
}

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING, { ssl: "require" });

type XrpcInviteResponse = {
  codes: Array<{ account: string; codes: string[] }>;
};

export async function POST(req: NextRequest) {
  try {
    // --- Parse & normalize body ---
    const body = (await req.json()) as {
      email?: string;
      emails?: string[];
      password?: string; 
    };

    const emailsInput =
      Array.isArray(body.emails) && body.emails.length > 0 ? body.emails
      : body.email ? [body.email]
      : [];

    const emails = emailsInput
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

    // When using "insecure" mode, check if invite codes already exist in the database
    if (isInsecureMode) {
      try {
        const existingInvites: { email: string; inviteCode: string }[] = [];
        const emailsNeedingNewCodes: string[] = [];

        for (const email of emails) {
          const existing = await sql`
            SELECT invite_token FROM invites WHERE email = ${email} LIMIT 1
          `;

          if (existing.length > 0 && existing[0].invite_token) {
            existingInvites.push({ email, inviteCode: existing[0].invite_token });
          } else {
            emailsNeedingNewCodes.push(email);
          }
        }

        // If all emails have existing invite codes, return them
        if (emailsNeedingNewCodes.length === 0) {
          return new Response(JSON.stringify({ invites: existingInvites }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Otherwise, continue with creating new codes only for emails that don't have one
        // We'll merge the results at the end
        if (existingInvites.length > 0) {
          // Some emails have existing codes, only create for the rest
          // Update emails array to only include those needing new codes
          emails.length = 0;
          emails.push(...emailsNeedingNewCodes);
          // Store existing invites to merge later
          (req as unknown as { existingInvites: typeof existingInvites }).existingInvites = existingInvites;
        }
      } catch (dbErr) {
        console.error("Failed to check existing invites:", dbErr);
        // Continue with normal flow if DB check fails
      }
    }

    const service = process.env.NEXT_PUBLIC_ATPROTO_SERVICE_URL || "https://climateai.org";
    const adminUsername = process.env.PDS_ADMIN_IDENTIFIER!;
    const adminPassword = process.env.PDS_ADMIN_PASSWORD!;
    const adminBasic = Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64");

    // so N codes for N emails  with use count being 1
    const codeCount = emails.length;

    // If all emails already had codes (codeCount is 0), we would have returned earlier
    if (codeCount === 0) {
      const existingInvites = (req as unknown as { existingInvites: { email: string; inviteCode: string }[] }).existingInvites || [];
      return new Response(JSON.stringify({ invites: existingInvites }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${service}/xrpc/com.atproto.server.createInviteCodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${adminBasic}`,
      },
      body: JSON.stringify({ codeCount, useCount }),
      // If your PDS is strict about JSON ints, the cast above ensures numbers.
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        error,
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = (await response.json()) as XrpcInviteResponse;
    const minted = data?.codes?.[0]?.codes ?? [];

    if (!Array.isArray(minted) || minted.length < emails.length) {
      return new Response(
        JSON.stringify({
          error: "UpstreamError",
          message: `PDS returned ${minted.length || 0} code(s) for ${emails.length} email(s)`,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Pair first N codes to N emails; insert each mapping
    const results: { email: string; inviteCode: string }[] = [];
    try {
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const inviteCode = minted[i];

        await sql`
          INSERT INTO invites (email, invite_token)
          VALUES (${email}, ${inviteCode})
        `;

        results.push({ email, inviteCode });
      }
    } catch (dbErr) {
      console.error("Failed to insert invite(s):", dbErr);
      return new Response(
        JSON.stringify({ error: "DatabaseError", message: "Failed to persist invite(s)" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Merge with any existing invites (from insecure mode check)
    const existingInvites = (req as unknown as { existingInvites?: { email: string; inviteCode: string }[] }).existingInvites || [];
    const allInvites = [...existingInvites, ...results];

    return new Response(JSON.stringify({ invites: allInvites }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        error: "InternalServerError",
        message: (err as Record<string, string>)?.message || "Unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
