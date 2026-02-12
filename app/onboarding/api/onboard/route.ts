/**
 * POST /onboarding/api/onboard
 *
 * Combined account creation and organization initialization endpoint.
 * This endpoint handles the entire onboarding process in a single server-side call
 * to ensure tokens are never sent to the client.
 *
 * Usage:
 *   POST /onboarding/api/onboard
 *   Body: FormData with:
 *     - email: string
 *     - password: string
 *     - handle: string (without domain suffix)
 *     - inviteCode: string
 *     - pdsDomain: string (optional)
 *     - displayName: string
 *     - shortDescription: string
 *     - longDescription: string
 *     - country: string (ISO code)
 *     - website: string (optional)
 *     - startDate: string (optional, ISO date)
 *     - logo: File (optional)
 *
 * Responses:
 *   200: { success: true, did: string, handle: string }
 *   400: Validation error
 *   500: Server error
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  allowedPDSDomains,
  defaultPdsDomain,
  type AllowedPDSDomain,
} from "@/config/gainforest-sdk";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { countries } from "@/lib/countries";

const organizationInfoSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  shortDescription: z.string().min(1, "Short description is required").max(300),
  longDescription: z.string().min(50, "Long description must be at least 50 characters").max(5000),
  country: z.string().length(2, "Country must be a 2-letter ISO code").refine(
    (code) => code in countries,
    "Invalid country code"
  ),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  startDate: z.string().optional(),
});

const requestSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  handle: z.string().min(3, "Handle must be at least 3 characters").max(30),
  inviteCode: z.string().min(1, "Invite code is required"),
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
  displayName: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(300),
  longDescription: z.string().min(50).max(5000),
  country: z.string().length(2),
  website: z.string().optional(),
  startDate: z.string().optional(),
});

type AccountCreationResponse = {
  handle: string;
  did: string;
  accessJwt: string;
  refreshJwt: string;
};

type UploadBlobResponse = {
  blob: {
    $type: "blob";
    ref: { $link: string };
    mimeType: string;
    size: number;
  };
};

async function uploadBlob(
  pdsDomain: string,
  accessJwt: string,
  file: File
): Promise<UploadBlobResponse["blob"] | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const response = await fetch(
      `https://${pdsDomain}/xrpc/com.atproto.repo.uploadBlob`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessJwt}`,
          "Content-Type": file.type,
        },
        body: arrayBuffer,
      }
    );

    if (!response.ok) {
      console.error("Failed to upload blob:", await response.text());
      return null;
    }

    const data = (await response.json()) as UploadBlobResponse;
    return data.blob;
  } catch (error) {
    console.error("Error uploading blob:", error);
    return null;
  }
}

async function createOrganizationRecord(
  pdsDomain: string,
  did: string,
  accessJwt: string,
  info: {
    displayName: string;
    shortDescription: string;
    longDescription: string;
    country: string;
    website?: string;
    startDate?: string;
    logo?: { $type: "blob"; ref: { $link: string }; mimeType: string; size: number } | null;
  }
): Promise<boolean> {
  try {
    const record = {
      $type: "app.gainforest.organization.info",
      displayName: info.displayName,
      shortDescription: {
        text: info.shortDescription,
        facets: [],
      },
      longDescription: {
        blocks: [
          {
            text: info.longDescription,
            facets: [],
          },
        ],
      },
      country: info.country,
      website: info.website || undefined,
      startDate: info.startDate || undefined,
      logo: info.logo || undefined,
      visibility: "Public",
      objectives: ["Other"],
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(
      `https://${pdsDomain}/xrpc/com.atproto.repo.putRecord`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessJwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: did,
          collection: "app.gainforest.organization.info",
          rkey: "self",
          record,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create organization record:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating organization record:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      handle: formData.get("handle") as string,
      inviteCode: formData.get("inviteCode") as string,
      pdsDomain: (formData.get("pdsDomain") as string) || defaultPdsDomain,
      displayName: formData.get("displayName") as string,
      shortDescription: formData.get("shortDescription") as string,
      longDescription: formData.get("longDescription") as string,
      country: formData.get("country") as string,
      website: formData.get("website") as string,
      startDate: formData.get("startDate") as string,
    };

    const logoFile = formData.get("logo") as File | null;

    // Step 1: Validate ALL inputs FIRST (before account creation)
    const parsed = requestSchema.safeParse(rawData);

    if (!parsed.success) {
      return Response.json(
        {
          error: "ValidationError",
          message: "Invalid request data",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    // Additional organization info validation
    const orgInfoParsed = organizationInfoSchema.safeParse({
      displayName: parsed.data.displayName,
      shortDescription: parsed.data.shortDescription,
      longDescription: parsed.data.longDescription,
      country: parsed.data.country,
      website: parsed.data.website,
      startDate: parsed.data.startDate,
    });

    if (!orgInfoParsed.success) {
      return Response.json(
        {
          error: "ValidationError",
          message: "Invalid organization information",
          issues: orgInfoParsed.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      handle,
      inviteCode,
      pdsDomain,
    } = parsed.data;

    const orgInfo = orgInfoParsed.data;

    // Step 2: Verify invite code exists and matches email
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return Response.json(
        {
          error: "ServerMisconfigured",
          message: "Database not configured",
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
        { error: "DatabaseError", message: "Failed to verify invite code" },
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

    // Step 3: Create account on PDS
    const fullHandle = `${handle}.${pdsDomain}`;
    const accountResponse = await fetch(
      `https://${pdsDomain}/xrpc/com.atproto.server.createAccount`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          handle: fullHandle,
          inviteCode,
        }),
      }
    );

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json().catch(() => ({}));
      console.error("Account creation failed:", errorData);
      return Response.json(
        {
          error: "AccountCreationFailed",
          message: errorData.message || "Failed to create account",
        },
        { status: accountResponse.status }
      );
    }

    const accountData = (await accountResponse.json()) as AccountCreationResponse;
    const { did, accessJwt } = accountData;

    // Step 4: Upload logo if provided
    let logoBlob: UploadBlobResponse["blob"] | null = null;
    if (logoFile && logoFile.size > 0) {
      logoBlob = await uploadBlob(pdsDomain, accessJwt, logoFile);
      // If logo upload fails, we continue without it (non-blocking)
      if (!logoBlob) {
        console.warn("Logo upload failed, continuing without logo");
      }
    }

    // Step 5: Initialize organization data on PDS
    const orgCreated = await createOrganizationRecord(
      pdsDomain,
      did,
      accessJwt,
      {
        displayName: orgInfo.displayName,
        shortDescription: orgInfo.shortDescription,
        longDescription: orgInfo.longDescription,
        country: orgInfo.country,
        website: orgInfo.website || undefined,
        startDate: orgInfo.startDate || undefined,
        logo: logoBlob,
      }
    );

    // If org creation fails, log it but don't fail the request
    // The account is created, user can edit profile later
    if (!orgCreated) {
      console.error(
        "Failed to initialize organization for DID:",
        did,
        "- user can complete profile later"
      );
    }

    return Response.json({
      success: true,
      did,
      handle: fullHandle,
      organizationInitialized: orgCreated,
    });
  } catch (err: unknown) {
    console.error("Unexpected error in onboard:", err);
    return Response.json(
      {
        error: "InternalServerError",
        message:
          (err as Error)?.message || "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
