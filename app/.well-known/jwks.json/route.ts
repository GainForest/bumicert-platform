import { NextResponse } from "next/server";

/**
 * JSON Web Key Set (JWKS) endpoint.
 *
 * This endpoint serves the public keys used for OAuth token endpoint
 * authentication. ATProto authorization servers fetch this to verify
 * the signatures on our client assertion JWTs.
 *
 * Only the public key components are exposed - the private key is
 * kept secret in the OAUTH_PRIVATE_KEY environment variable.
 */
export async function GET() {
  const privateKey = JSON.parse(process.env.ATPROTO_JWK_PRIVATE!);

  // Remove private key component ("d"), expose only public key
  let keys = privateKey.keys;
  keys = keys.map((key: { d?: string; }) => {
    delete key.d;
    return key;
  });
  

  const jwks = {
    keys,
  };

  return NextResponse.json(jwks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
