import { NextResponse } from 'next/server'
import { importJWK, exportJWK } from 'jose'

export async function GET() {
  const privateKeyJwk = process.env.ATPROTO_JWK_PRIVATE

  if (!privateKeyJwk) {
    return NextResponse.json(
      { error: 'ATPROTO_JWK_PRIVATE not configured' },
      { status: 500 }
    )
  }

  try {
    // Parse the JWK (could be keyset or single key)
    const parsed = JSON.parse(privateKeyJwk)
    return NextResponse.json(parsed);
    
    // Handle both formats:
    // - Keyset: {"keys":[{...}]} → extract first key
    // - Single key: {...} → use directly
    const privateJwk = parsed.keys && Array.isArray(parsed.keys) && parsed.keys.length > 0
      ? parsed.keys[0]  // Extract first key from keyset
      : parsed          // Use directly if single key
    
    // Validate we have a proper JWK
    if (!privateJwk.kty) {
      throw new Error('Invalid JWK format: missing "kty" field')
    }

    // Import the private key (now privateJwk is a single key object)
    const privateKey = await importJWK(privateJwk, privateJwk.alg)

    // Export the public key
    const publicJwk = await exportJWK(privateKey)

    // Ensure the key has required fields
    const jwk = {
      ...publicJwk,
      kid: privateJwk.kid || 'key-1',
      use: 'sig',
      alg: privateJwk.alg || 'ES256',
    }

    // Remove private key fields (belt and suspenders)
    delete (jwk as any).d
    delete (jwk as any).p
    delete (jwk as any).q
    delete (jwk as any).dp
    delete (jwk as any).dq
    delete (jwk as any).qi

    const jwks = {
      keys: [jwk],
    }

    return NextResponse.json(jwks, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Failed to generate JWKS:', error)
    
    // Log diagnostic info without exposing private key
    try {
      const parsed = JSON.parse(privateKeyJwk)
      console.error('JWK structure diagnostic:', {
        isKeyset: !!parsed.keys,
        keyCount: parsed.keys?.length || 0,
        firstKeyType: parsed.keys?.[0]?.kty || parsed.kty || 'unknown',
        hasAlg: !!(parsed.keys?.[0]?.alg || parsed.alg),
        hasKid: !!(parsed.keys?.[0]?.kid || parsed.kid),
      })
    } catch (parseError) {
      console.error('JWK parsing failed:', parseError)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate JWKS',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
