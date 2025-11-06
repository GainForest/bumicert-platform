import { env } from "process";
import { NodeOAuthClient } from "@atproto/oauth-client-node";

export const generateClientMetadata = () => {
  // General Info
  const appName = "Ecocertain";

  // URL computations
  const publicUrl =
    env.VERCEL_PROJECT_PRODUCTION_URL ?
      (`https://${env.VERCEL_PROJECT_PRODUCTION_URL}` as `https://${string}`)
    : undefined; // Injected by Vercel automatically
  const normalizedPublicUrl = publicUrl?.replace(/\/$/, "") as
    | `https://${string}`
    | undefined;
  const localhostUrl =
    `http://127.0.0.1:${env.PORT}` as `http://127.0.0.1:${number}`;
  const enc = encodeURIComponent;
  const url = normalizedPublicUrl ?? localhostUrl;
  const callbackUrl = `${url}/callback` as `${typeof url}/${string}`;

  // Scopes: Choose the permissions the app needs
  const scopes = [
    "atproto", // Core AT Protocol access - allows basic operations like reading/writing posts, follows, etc.
    "transition:generic", // A transitional scope for generic operations
    "transition:chat.bsky", // Access to Bluesky's chat functionality
  ];
  const scopeString = scopes.join(" ");

  // When running locally, we need to use a different client ID:
  const localhostClientId = `http://localhost?redirect_uri=${enc(
    callbackUrl
  )}&scope=${enc(scopeString)}` as `http://localhost?redirect_uri=${string}`;

  const metadata: NodeOAuthClient["clientMetadata"] = {
    client_name: appName,
    client_id:
      normalizedPublicUrl ?
        `${normalizedPublicUrl}/api/atproto/client-metadata.json`
      : localhostClientId,
    client_uri: url,
    redirect_uris: [callbackUrl],
    scope: scopeString,
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    application_type: normalizedPublicUrl ? "web" : "native",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true,
    subject_type: "public",
    authorization_signed_response_alg: "ES256",
  };

  return metadata;
};
