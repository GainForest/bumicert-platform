import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { atprotoSDK } from "@/lib/atproto";
import { saveAppSession } from "gainforest-sdk/oauth";

/**
 * OAuth 2.0 Callback endpoint.
 *
 * This route handles the OAuth callback from the ATProto authorization server.
 * It exchanges the authorization code for access tokens, saves the OAuth session
 * to Supabase, and creates an encrypted cookie with the user's identity.
 *
 * Flow:
 * 1. ATProto auth server redirects here with ?code=...&state=...
 * 2. SDK exchanges code for tokens (with PKCE verification)
 * 3. OAuth session (tokens, DPoP keys) stored in Supabase
 * 4. App session (DID, handle) saved to encrypted cookie
 * 5. User redirected to home page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Exchange authorization code for OAuth session
    // This validates the state, verifies PKCE, and stores tokens in Supabase
    const session = await atprotoSDK.callback(searchParams);

    // The session has `did` property (DID of the authenticated user)
    // Handle is resolved from the DID when needed
    const did = session.did;

    // Save user identity to encrypted cookie for subsequent requests
    // Handle will be resolved later when displaying user info
    await saveAppSession({
      did,
      isLoggedIn: true,
    });

    // Redirect to home page after successful authentication
    redirect("/");
  } catch (error) {
    console.error("OAuth callback error:", error);
    // Redirect to home with error indicator
    // TODO: Add proper error handling UI
    redirect("/?error=auth_failed");
  }
}
