import { NextRequest } from "next/server";
import postgres from "postgres";
import { allowedPDSDomains, type AllowedPDSDomain } from "@/config/gainforest-sdk";
import { getInviteEmailConfig, resend } from "@/lib/email/resend";

if (!process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING) {
  throw new Error("Missing POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING env var");
}
if (!process.env.PDS_ADMIN_IDENTIFIER || !process.env.PDS_ADMIN_PASSWORD) {
  throw new Error("Missing PDS_ADMIN_IDENTIFIER / PDS_ADMIN_PASSWORD env vars");
}

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING, {
  ssl: "require",
});

type XrpcInviteResponse = {
  codes: Array<{ account: string; codes: string[] }>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      pdsDomain?: string;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    const pdsDomain = (body.pdsDomain ?? "").trim().toLowerCase();

    if (!email || !pdsDomain) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Email and pdsDomain are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Invalid email format",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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

    let inviteCode = "";

    const existing = await sql`
      SELECT invite_token FROM invites WHERE email = ${email} AND pds_domain = ${pdsDomain} LIMIT 1
    `;

    if (existing.length > 0 && existing[0].invite_token) {
      inviteCode = existing[0].invite_token;
    } else {
      const adminUsername = process.env.PDS_ADMIN_IDENTIFIER!;
      const adminPassword = process.env.PDS_ADMIN_PASSWORD!;
      const adminBasic = Buffer.from(
        `${adminUsername}:${adminPassword}`
      ).toString("base64");

      const response = await fetch(
        `https://${pdsDomain}/xrpc/com.atproto.server.createInviteCodes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${adminBasic}`,
          },
          body: JSON.stringify({ codeCount: 1, useCount: 1 }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify(error), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = (await response.json()) as XrpcInviteResponse;
      const minted = data?.codes?.[0]?.codes ?? [];
      inviteCode = minted[0] ?? "";

      if (!inviteCode) {
        return new Response(
          JSON.stringify({
            error: "UpstreamError",
            message: "PDS did not return an invite code",
          }),
          { status: 502, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        await sql`
          INSERT INTO invites (email, invite_token, pds_domain)
          VALUES (${email}, ${inviteCode}, ${pdsDomain})
          ON CONFLICT (email, pds_domain)
          DO UPDATE SET invite_token = invites.invite_token
        `;
      } catch (dbErr) {
        console.error("Failed to insert invite:", dbErr);
        return new Response(
          JSON.stringify({
            error: "DatabaseError",
            message: "Failed to persist invite",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const { from, subject } = getInviteEmailConfig();
    const text = `Your Bumicerts invite code for ${pdsDomain}: ${inviteCode}`;
    const html = `
      <p>Your Bumicerts invite code for <strong>${pdsDomain}</strong>:</p>
      <p style="font-size: 20px; font-weight: 600; letter-spacing: 0.02em;">
        ${inviteCode}
      </p>
      <p>If you did not request this, you can ignore this email.</p>
    `;

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Failed to send invite email:", error);
      return new Response(
        JSON.stringify({
          error: "EmailError",
          message: "Failed to send invite email",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Unexpected error in send-invite-email:", err);
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
