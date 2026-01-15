import { NextResponse, NextRequest } from "next/server";
import {
  getSessionFromRequest,
  resumeCredentialSession,
} from "climateai-sdk/session";

export async function proxy(request: NextRequest) {
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
        new URL(`/organization/${session.did}`, request.url)
      );
    }
  } catch {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/organization",
};
