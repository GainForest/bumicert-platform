import { NextResponse, NextRequest } from "next/server";
import {
  getSessionFromRequest,
  resumeCredentialSession,
} from "climateai-sdk/session";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  let response = await updateSession(request);
  
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
      
      return NextResponse.redirect(
        new URL(`/organization/${session.did}`, request.url),
        {
          headers: response.headers,
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
    "/organization",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
