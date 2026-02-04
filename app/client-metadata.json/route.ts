import { OAUTH_SCOPE, resolvePublicUrl } from "@/lib/atproto";
import { NextResponse } from "next/server";

/**
 * OAuth 2.0 Client Metadata endpoint.
 *
 * This endpoint serves the OAuth client metadata document required by
 * ATProto authorization servers. It describes this application's OAuth
 * configuration including redirect URIs, supported grant types, and
 * token endpoint authentication method.
 *
 * @see https://atproto.com/specs/oauth
 */
export async function GET() {
  const PUBLIC_URL = resolvePublicUrl();
  const metadata = {
    client_id: `${PUBLIC_URL}/client-metadata.json`,
    client_name: "Bumicerts",
    client_uri: PUBLIC_URL,
    logo_uri: `${PUBLIC_URL}/logo.png`,
    tos_uri: `${PUBLIC_URL}/terms`,
    policy_uri: `${PUBLIC_URL}/privacy`,
    redirect_uris: [`${PUBLIC_URL}/api/oauth/callback`],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    scope: "atproto transition:generic",
    token_endpoint_auth_method: "private_key_jwt",
    token_endpoint_auth_signing_alg: "ES256",
    application_type: "web",
    dpop_bound_access_tokens: true,
    jwks_uri: `${PUBLIC_URL}/.well-known/jwks.json`,
  };

  return NextResponse.json(metadata, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
