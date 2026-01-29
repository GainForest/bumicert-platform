"use server";

import { atprotoSDK } from "@/lib/atproto";
import {
  getAppSession,
  clearAppSession,
  AppSessionData,
} from "climateai-sdk/oauth";

/**
 * Initiates the OAuth authorization flow.
 *
 * This server action generates an authorization URL for the given handle.
 * The client should redirect to this URL to start the OAuth flow.
 *
 * @param handle - The user's ATProto handle (e.g., "alice.climateai.org" or just "alice")
 * @returns The authorization URL to redirect the user to
 *
 * @example
 * ```tsx
 * const { authorizationUrl } = await authorize("alice");
 * window.location.href = authorizationUrl;
 * ```
 */
export async function authorize(handle: string): Promise<{ authorizationUrl: string }> {
  // Normalize the handle - add domain if not present
  const normalizedHandle = handle.includes(".")
    ? handle
    : `${handle}.climateai.org`;

  const authUrl = await atprotoSDK.authorize(normalizedHandle);

  return { authorizationUrl: authUrl.toString() };
}

/**
 * Logs out the current user.
 *
 * This server action clears the app session cookie, effectively logging
 * the user out. Note that this only clears the local session - the OAuth
 * tokens in Supabase may still be valid.
 *
 * @returns Success indicator
 *
 * @example
 * ```tsx
 * await logout();
 * // User is now logged out
 * ```
 */
export async function logout(): Promise<{ success: boolean }> {
  await clearAppSession();
  return { success: true };
}

/**
 * Checks the current session status.
 *
 * This server action reads the app session cookie and optionally verifies
 * that the OAuth session is still valid in Supabase.
 *
 * @returns Session status with user info if authenticated
 *
 * @example
 * ```tsx
 * const session = await checkSession();
 * if (session.authenticated) {
 *   console.log(`Logged in as ${session.did}`);
 * }
 * ```
 */
export async function checkSession(): Promise<
  | { authenticated: false }
  | { authenticated: true; did: string; handle?: string }
> {
  const session: AppSessionData = await getAppSession();

  if (!session.isLoggedIn || !session.did) {
    return { authenticated: false };
  }

  // Optionally verify the OAuth session is still valid
  // This is commented out to avoid unnecessary Supabase calls on every check
  // Uncomment if you need strict session validation
  // const oauthSession = await atprotoSDK.restoreSession(session.did);
  // if (!oauthSession) {
  //   return { authenticated: false };
  // }

  return {
    authenticated: true,
    did: session.did,
    handle: session.handle,
  };
}
