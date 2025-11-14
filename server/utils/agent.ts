import { PDS_DOMAIN, PDS_URL } from "@/config/atproto";
import { Agent, CredentialSession } from "@atproto/api";
import { getSessionFromRequest } from "../session";
import { TRPCError } from "@trpc/server";

export const getReadAgent = () => {
  return new Agent({
    service: PDS_URL,
  });
};

export const getWriteAgent = async () => {
  const pdsDomain = PDS_DOMAIN;
  const session = await getSessionFromRequest(pdsDomain);
  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized.",
    });
  const credentialSession = new CredentialSession(
    new URL(`https://${pdsDomain}`)
  );
  const result = await credentialSession.resumeSession({
    accessJwt: session.accessJwt,
    refreshJwt: session.refreshJwt,
    handle: session.handle,
    did: session.did,
    active: true,
  });
  if (!result.success)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Failed to resume session.",
    });
  return new Agent(credentialSession);
};
