import { NextRequest, NextResponse } from "next/server";
import supabase from "../../client";
import {
  getSessionFromRequest,
  resumeCredentialSession,
} from "climateai-sdk/session";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import {
  draftBumicertDataSchemaV0,
  getDraftBumicertRequestSchema,
  createDraftBumicertRequestSchema,
  updateDraftBumicertRequestSchema,
  deleteDraftBumicertRequestSchema,
} from "./schema";
export async function GET(req: NextRequest) {
  let userDid: string;
  // Check user's authentication
  try {
    const session = await getSessionFromRequest();
    if (session && session.did) {
      try {
        const credentialSession = await resumeCredentialSession(
          allowedPDSDomains[0],
          session
        );
        if (!credentialSession.success) {
          throw new Error("Failed to resume credential session");
        }
        userDid = session.did;
      } catch (error) {
        console.error("Failed to resume credential session", error);
        throw new Error("Failed to resume credential session");
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to get session", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get query parameters
  const searchParams = req.nextUrl.searchParams;
  const queryParams: Record<string, unknown> = {};

  // Parse draftIds if present
  const draftIdsParam = searchParams.get("draftIds");
  if (draftIdsParam) {
    try {
      queryParams.draftIds = JSON.parse(draftIdsParam);
    } catch {
      // Invalid JSON, ignore
    }
  }

  // Parse orderBy and orderDirection
  const orderBy = searchParams.get("orderBy");
  if (orderBy) {
    queryParams.orderBy = orderBy;
  }

  const orderDirection = searchParams.get("orderDirection");
  if (orderDirection) {
    queryParams.orderDirection = orderDirection;
  }

  // Validate query parameters
  const requestBodyValidation =
    getDraftBumicertRequestSchema.safeParse(queryParams);
  if (!requestBodyValidation.success) {
    return NextResponse.json(
      { error: requestBodyValidation.error.message },
      { status: 400 }
    );
  }

  // Fetch drafts
  const validatedRequestBody = requestBodyValidation.data;
  let draftsFetchPromise;
  console.log("validatedRequestBody", validatedRequestBody, userDid);
  if (validatedRequestBody.draftIds) {
    draftsFetchPromise = supabase
      .from("drafts_bumicert")
      .select("*")
      .eq("ownerDid", userDid)
      .in("id", validatedRequestBody.draftIds)
      .order(validatedRequestBody.orderBy, {
        ascending: validatedRequestBody.orderDirection === "asc",
      });
  } else {
    draftsFetchPromise = supabase
      .from("drafts_bumicert")
      .select("*")
      .eq("ownerDid", userDid)
      .order(validatedRequestBody.orderBy, {
        ascending: validatedRequestBody.orderDirection === "asc",
      });
  }

  // Parse drafts
  try {
    const draftsResponse = await draftsFetchPromise;
    if (draftsResponse.error) {
      throw new Error("Failed to fetch drafts");
    }
    console.log("draftsResponse", draftsResponse);
    const typedDrafts = draftsResponse.data
      .map((draft) => {
        if (draft.version === 0) {
          const safeParseResult = draftBumicertDataSchemaV0.safeParse(
            draft.data
          );
          if (!safeParseResult.success) return;
          return {
            ...draft,
            data: safeParseResult.data,
          };
        }
        return null;
      })
      .filter((draft) => !!draft);
    return NextResponse.json(
      { drafts: typedDrafts, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch drafts", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let userDid: string;
  // Check user's authentication
  try {
    const session = await getSessionFromRequest();
    if (session && session.did) {
      try {
        const credentialSession = await resumeCredentialSession(
          allowedPDSDomains[0],
          session
        );
        if (!credentialSession.success) {
          throw new Error("Failed to resume credential session");
        }
        userDid = session.did;
      } catch (error) {
        console.error("Failed to resume credential session", error);
        throw new Error("Failed to resume credential session");
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to get session", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate request body
  const requestBody = await req.json();

  // Check if it's an update (has id) or create (no id)
  const isUpdate = requestBody.id !== undefined;

  try {
    if (isUpdate) {
      // Update existing draft
      const updateValidation =
        updateDraftBumicertRequestSchema.safeParse(requestBody);
      if (!updateValidation.success) {
        return NextResponse.json(
          { error: updateValidation.error.message },
          { status: 400 }
        );
      }

      const validatedRequestBody = updateValidation.data;
      const updateData = {
        data: validatedRequestBody.data,
        updated_at: new Date().toISOString(),
      };

      const updateResponse = await supabase
        .from("drafts_bumicert")
        .update(updateData)
        .eq("id", validatedRequestBody.id)
        .eq("ownerDid", userDid)
        .select()
        .single();

      if (updateResponse.error) {
        throw new Error("Failed to update draft");
      }

      // Validate the updated draft data
      const draft = updateResponse.data;
      if (draft.version === 0) {
        const safeParseResult = draftBumicertDataSchemaV0.safeParse(draft.data);
        if (!safeParseResult.success) {
          throw new Error("Invalid draft data format");
        }
        return NextResponse.json(
          {
            draft: {
              ...draft,
              data: safeParseResult.data,
            },
            success: true,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { draft: draft, success: true },
        { status: 200 }
      );
    } else {
      // Create new draft
      const createValidation =
        createDraftBumicertRequestSchema.safeParse(requestBody);
      if (!createValidation.success) {
        return NextResponse.json(
          { error: createValidation.error.message },
          { status: 400 }
        );
      }

      const validatedRequestBody = createValidation.data;
      const insertData = {
        ownerDid: userDid,
        data: validatedRequestBody.data,
        version: validatedRequestBody.version ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const insertResponse = await supabase
        .from("drafts_bumicert")
        .insert(insertData)
        .select()
        .single();

      if (insertResponse.error) {
        throw new Error("Failed to create draft");
      }

      // Validate the created draft data
      const draft = insertResponse.data;
      if (draft.version === 0) {
        const safeParseResult = draftBumicertDataSchemaV0.safeParse(draft.data);
        if (!safeParseResult.success) {
          throw new Error("Invalid draft data format");
        }
        return NextResponse.json(
          {
            draft: {
              ...draft,
              data: safeParseResult.data,
            },
            success: true,
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { draft: draft, success: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Failed to save draft", error);
    return NextResponse.json(
      { error: "Failed to save draft", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  let userDid: string;
  // Check user's authentication
  try {
    const session = await getSessionFromRequest();
    if (session && session.did) {
      try {
        const credentialSession = await resumeCredentialSession(
          allowedPDSDomains[0],
          session
        );
        if (!credentialSession.success) {
          throw new Error("Failed to resume credential session");
        }
        userDid = session.did;
      } catch (error) {
        console.error("Failed to resume credential session", error);
        throw new Error("Failed to resume credential session");
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to get session", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate request body
  const requestBody = await req.json();
  const requestBodyValidation =
    deleteDraftBumicertRequestSchema.safeParse(requestBody);
  if (!requestBodyValidation.success) {
    return NextResponse.json(
      { error: requestBodyValidation.error.message },
      { status: 400 }
    );
  }

  const validatedRequestBody = requestBodyValidation.data;

  try {
    // Delete drafts that belong to the user
    const deleteResponse = await supabase
      .from("drafts_bumicert")
      .delete()
      .eq("ownerDid", userDid)
      .in("id", validatedRequestBody.draftIds)
      .select();

    if (deleteResponse.error) {
      throw new Error("Failed to delete drafts");
    }

    return NextResponse.json(
      {
        deletedCount: deleteResponse.data?.length ?? 0,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete drafts", error);
    return NextResponse.json(
      { error: "Failed to delete drafts", success: false },
      { status: 500 }
    );
  }
}
