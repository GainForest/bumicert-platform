import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Dynamically detect base URL from request headers
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 
                   (host?.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${protocol}://${host}`

  const clientMetadata = {
    client_id: `${baseUrl}/client-metadata.json`,
    client_name: 'Bumicert Platform',
    client_uri: baseUrl,
    redirect_uris: [`${baseUrl}/api/auth/callback`],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    application_type: 'web',
    token_endpoint_auth_method: 'none',
    dpop_bound_access_tokens: true,
    jwks_uri: `${baseUrl}/jwks.json`,
  }

  return NextResponse.json(clientMetadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
