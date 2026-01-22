"use server";

import { revalidatePath } from "next/cache";
import { hypercertsSdk } from "../hypercerts/sdk.server";
import {
  getSessionIdFromCookie,
  lookupDidBySessionId,
  deleteSessionCookie,
} from "./session-helpers";

export type AuthUser = {
  did: string;
  handle: string;
};
export type AuthState =
  | { status: "AUTHENTICATED"; user: AuthUser }
  | { status: "UNAUTHENTICATED"; user: null };

export async function getLoginUrl(handle: string) {
  const pdsUrl = process.env.NEXT_PUBLIC_PDS_URL || "https://climateai.org";
  const hostname = new URL(pdsUrl).hostname;

  let finalHandle = handle.trim();
  if (!finalHandle.includes(".")) {
    finalHandle = `${finalHandle}.${hostname}`;
  }

  const redirectUrl = await hypercertsSdk.authorize(finalHandle);
  return redirectUrl;
} /**
 * Get current auth state from hypercerts session
 * Called on app init and after login callback
 */

export async function getAuthState(): Promise<AuthState> {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) {
    return { status: "UNAUTHENTICATED", user: null };
  }

  const did = await lookupDidBySessionId(sessionId);
  if (!did) {
    await deleteSessionCookie();
    return { status: "UNAUTHENTICATED", user: null };
  }

  try {
    const session = await hypercertsSdk.restoreSession(did);
    if (!session) {
      await deleteSessionCookie();
      return { status: "UNAUTHENTICATED", user: null };
    }

    // Extract handle from session
    // The session.did property contains the full DID
    // We need to resolve the handle from the DID document or stored session data
    // For now, use the DID as identifier and try to resolve handle separately
    // TODO: Add handle resolution from DID document
    console.log("SESSION", session);
    const handle = did;

    return {
      status: "AUTHENTICATED",
      user: { did, handle },
    };
  } catch (error) {
    console.error("Failed to restore session:", error);
    await deleteSessionCookie();
    return { status: "UNAUTHENTICATED", user: null };
  }
} /**
 * Logout - clear hypercerts session and related storage
 */

export async function logout(): Promise<void> {
  const sessionId = await getSessionIdFromCookie();
  if (sessionId) {
    const did = await lookupDidBySessionId(sessionId);
    if (did) {
      // TODO: Optionally revoke session in hypercerts SDK if available
      // await hypercertsSdk.revokeSession(did)
    }
  }
  await deleteSessionCookie();
  revalidatePath("/");
}
