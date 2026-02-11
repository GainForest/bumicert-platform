import type { SupabaseClient } from "@supabase/supabase-js";
import type { AllowedPDSDomain } from "@/config/gainforest-sdk";

type InviteCodeError = Error & {
  status: number;
  payload: { error: string; message: string } | Record<string, unknown>;
};

const createInviteCodeError = (
  status: number,
  payload: InviteCodeError["payload"],
  message: string
): InviteCodeError => Object.assign(new Error(message), { status, payload });

const resolvePdsServiceUrl = (pdsDomain: AllowedPDSDomain) =>
  process.env.NEXT_PUBLIC_ATPROTO_SERVICE_URL || `https://${pdsDomain}`;

const getAdminBasicAuth = () => {
  if (!process.env.PDS_ADMIN_IDENTIFIER || !process.env.PDS_ADMIN_PASSWORD) {
    throw new Error("Missing PDS_ADMIN_IDENTIFIER / PDS_ADMIN_PASSWORD env vars");
  }

  const adminUsername = process.env.PDS_ADMIN_IDENTIFIER;
  const adminPassword = process.env.PDS_ADMIN_PASSWORD;
  return Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64");
};

type XrpcInviteResponse = {
  codes: Array<{ account: string; codes: string[] }>;
};

export const mintInviteCodes = async (
  pdsDomain: AllowedPDSDomain,
  codeCount: number
): Promise<string[]> => {
  if (!Number.isInteger(codeCount) || codeCount <= 0) {
    throw createInviteCodeError(
      400,
      { error: "BadRequest", message: "`codeCount` must be a positive integer" },
      "Invalid code count"
    );
  }

  const adminBasic = getAdminBasicAuth();
  const response = await fetch(
    `${resolvePdsServiceUrl(pdsDomain)}/xrpc/com.atproto.server.createInviteCodes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${adminBasic}`,
      },
      body: JSON.stringify({ codeCount, useCount: 1 }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw createInviteCodeError(
      response.status,
      error,
      "Failed to create invite codes"
    );
  }

  const data = (await response.json()) as XrpcInviteResponse;
  const minted = data?.codes?.[0]?.codes ?? [];

  if (!Array.isArray(minted) || minted.length < codeCount) {
    throw createInviteCodeError(
      502,
      {
        error: "UpstreamError",
        message: `PDS returned ${minted.length || 0} code(s) for ${codeCount} request(s)`,
      },
      "PDS did not return expected invite codes"
    );
  }

  return minted;
};

export const getOrCreateInviteCode = async (
  supabase: SupabaseClient,
  email: string,
  pdsDomain: AllowedPDSDomain
): Promise<string> => {
  const existing = await supabase
    .from("invites")
    .select("invite_token")
    .eq("email", email)
    .eq("pds_domain", pdsDomain)
    .maybeSingle();

  if (existing.error) {
    throw createInviteCodeError(
      500,
      { error: "DatabaseError", message: "Failed to check existing invites" },
      "Failed to check existing invites"
    );
  }

  if (existing.data?.invite_token) {
    return existing.data.invite_token;
  }

  const [inviteCode] = await mintInviteCodes(pdsDomain, 1);
  const insertResult = await supabase
    .from("invites")
    .insert({ email, invite_token: inviteCode, pds_domain: pdsDomain });

  if (insertResult.error) {
    if (insertResult.error.code === "23505") {
      const fallback = await supabase
        .from("invites")
        .select("invite_token")
        .eq("email", email)
        .eq("pds_domain", pdsDomain)
        .maybeSingle();

      if (fallback.data?.invite_token) {
        return fallback.data.invite_token;
      }
    }

    throw createInviteCodeError(
      500,
      { error: "DatabaseError", message: "Failed to persist invite" },
      "Failed to persist invite"
    );
  }

  return inviteCode;
};

export const fetchExistingInvites = async (
  supabase: SupabaseClient,
  emails: string[],
  pdsDomain: AllowedPDSDomain
): Promise<Array<{ email: string; inviteCode: string }>> => {
  if (emails.length === 0) {
    return [];
  }

  const existing = await supabase
    .from("invites")
    .select("email, invite_token")
    .in("email", emails)
    .eq("pds_domain", pdsDomain);

  if (existing.error) {
    throw createInviteCodeError(
      500,
      { error: "DatabaseError", message: "Failed to fetch existing invites" },
      "Failed to fetch existing invites"
    );
  }

  return (existing.data ?? []).map((row) => ({
    email: row.email,
    inviteCode: row.invite_token,
  }));
};

export const isInviteCodeError = (error: unknown): error is InviteCodeError =>
  Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      "payload" in error
  );
