import { NextResponse, NextRequest } from "next/server";
import { getAppSession } from "gainforest-sdk/oauth";

export async function proxy(request: NextRequest) {
  try {
    console.log("Proxying request: ", request.url);
    const session = await getAppSession();
    if (session.isLoggedIn && session.did) {
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
