import { NextResponse, NextRequest } from "next/server";
import {
  getSessionFromRequest,
  resumeCredentialSession,
} from "climateai-sdk/session";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // First, refresh Supabase session and get the response
  let response = await updateSession(request);
  
  // Then handle existing climateai-sdk logic
  try {
    console.log("Proxying request: ", request.url);
    const session = await getSessionFromRequest("climateai.org");
    if (session && session.did) {
      const credentialSession = await resumeCredentialSession(
        "climateai.org",
        session
      );
      if (!credentialSession.success)
        throw new Error("Failed to resume credential session");
      console.log("Redirecting to organization page: ", session.did);
      
      // Use the supabase response as base and create redirect
      return NextResponse.redirect(
        new URL(`/organization/${session.did}`, request.url),
        {
          headers: response.headers, // Preserve Supabase session cookies
        }
      );
    }
  } catch {
    return response;
  }
  
  return response;
}

export const config = {
  matcher: [
    "/organization", // Existing matcher
    // Add additional paths that need Supabase session refresh
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
