import { PDS_DOMAIN, PDS_URL } from "@/config/atproto";
import { Agent, CredentialSession } from "@atproto/api";
import { getSessionFromRequest } from "./session";
import { TRPCError } from "@trpc/server";
import { XRPCError } from "@atproto/xrpc";

export type GetRecordResponse<T> = {
  value: T;
  uri: string;
  cid: string;
};

export type PutRecordResponse<T> = {
  success: true;
  data: {
    uri: string;
    cid: string;
    commit?: string;
    validationStatus: "unknown" | (string & {}) | undefined;
  };
  headers: Record<string, string>;
  value: T;
};

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

export type ClassifiedError = {
  success: false;
  humanMessage: string;
  code: "ORG_NOT_FOUND" | "RECORD_NOT_FOUND" | "UNKNOWN_ERROR" | "UNAUTHORIZED";
};

export type ClassifiedSuccess<T> = {
  success: true;
  data: T;
};

export const classifyXRPCError = (error: XRPCError): ClassifiedError => {
  if (error.error === "InvalidRequest") {
    return {
      success: false,
      humanMessage: "This organization does not exist.",
      code: "ORG_NOT_FOUND",
    };
  }
  if (error.error === "RecordNotFound") {
    return {
      success: false,
      humanMessage: "No organization found.",
      code: "RECORD_NOT_FOUND",
    };
  }
  return {
    success: false,
    humanMessage: "An unknown error occurred.",
    code: "UNKNOWN_ERROR",
  };
};
