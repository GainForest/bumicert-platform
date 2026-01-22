import { hypercertsSdk } from "@/lib/hypercerts/sdk.server";
import { setSessionCookie } from "@/lib/auth/session-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const session = await hypercertsSdk.callback(searchParams);
    await setSessionCookie(session.did);
    const protocol =
      req.headers.get("x-forwarded-proto") ||
      (req.headers.get("host")?.includes("localhost") ? "http" : "https");
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(new URL("/", baseUrl));
  } catch (error) {
    console.error("[OAuth Callback] Error:", error);
    const protocol =
      req.headers.get("x-forwarded-proto") ||
      (req.headers.get("host")?.includes("localhost") ? "http" : "https");
    const host = req.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.redirect(
      new URL("/" + encodeURIComponent(errorMessage), baseUrl)
    );
  }
}
