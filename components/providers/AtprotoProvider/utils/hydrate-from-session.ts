import { OAuthSession } from "@atproto/oauth-client-node";

export const verifySession = async (session: OAuthSession) => {
  if (!session?.sub) return false;
  const did = session.sub;
  if (!did.startsWith("did:")) return false;

  const authServerUrl = session.serverMetadata.issuer;
  const tokenInfo = await session.getTokenInfo();
  const sessionIss = tokenInfo.iss;
  if (sessionIss !== authServerUrl) return false;
  return true;
};
