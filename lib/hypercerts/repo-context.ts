import "server-only";
import { hypercertsSdk } from "./sdk.server";
import {
  getSessionIdFromCookie,
  lookupDidBySessionId,
  deleteSessionCookie,
} from "../auth/session-helpers";
import type { Repository } from "@hypercerts-org/sdk-core";

export type RepoServer = "pds" | "sds";

export interface RepoContext {
  userDid: string;
  activeDid: string;
  targetDid: string;
  server: RepoServer;
  repository: Repository;
  scopedRepo: ReturnType<Repository["repo"]>;
}

export async function getHypercertsRepoContext(options?: {
  targetDid?: string;
  serverOverride?: RepoServer;
}): Promise<RepoContext | null> {
  // Get session ID from cookie (random UUID)
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  // Lookup DID by session ID (validates session exists and not expired)
  const userDid = await lookupDidBySessionId(sessionId);
  if (!userDid) {
    // Session expired or invalid, cleanup cookie
    await deleteSessionCookie();
    return null;
  }

  const activeDid = userDid; // Could extend this later for org switching
  const targetDid = options?.targetDid || activeDid;
  const server: RepoServer =
    options?.serverOverride ?? (targetDid === userDid ? "pds" : "sds");

  try {
    // Restore session using DID (SDK looks it up from sessionStore)
    const session = await hypercertsSdk.restoreSession(userDid);
    if (!session) return null;

    const repository = hypercertsSdk.repository(session, { server });
    const scopedRepo = repository.repo(targetDid);

    return { userDid, activeDid, targetDid, server, repository, scopedRepo };
  } catch (error) {
    console.error("Failed to get repo context:", error);
    return null;
  }
}
