import { NextRequest } from "next/server";
import postgres from "postgres";
import crypto from "crypto";

if (!process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING) {
  throw new Error(
    "Missing POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING env var"
  );
}

if (!process.env.ADMIN_INVITE_PASSWORD) {
  throw new Error("Missing ADMIN_INVITE_PASSWORD env var");
}

const sql = postgres(
  process.env.POSTGRES_URL_NON_POOLING_ATPROTO_AUTH_MAPPING,
  { ssl: "require" }
);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      emails?: string[];
      password?: string;
    };
    const password = (body.password ?? "").trim();

    const emailsInput =
      Array.isArray(body.emails) && body.emails.length > 0 ? body.emails
      : body.email ? [body.email]
      : [];

    const emails = emailsInput
      .map((e) => (e ?? "").trim().toLowerCase())
      .filter(Boolean);

    if (emails.length === 0 || !password) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Missing required fields",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password !== process.env.ADMIN_INVITE_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const results: { email: string; inviteCode: string }[] = [];
    try {
      for (const email of emails) {
        const inviteToken = crypto.randomBytes(16).toString("hex");
        await sql`
          INSERT INTO invites (email, invite_token)
          VALUES (${email}, ${inviteToken})
        `;
        results.push({ email, inviteCode: inviteToken });
      }
    } catch (dbErr) {
      console.error("Failed to insert invite(s):", dbErr);
      return new Response(
        JSON.stringify({
          error: "DatabaseError",
          message: "Failed to create invite(s)",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ invites: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message:
          (err as Record<string, string>).message ||
          "Unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
