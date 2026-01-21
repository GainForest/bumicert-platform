import { NextResponse } from 'next/server'

export async function GET() {
  const privateKeyJwk = process.env.ATPROTO_JWK_PRIVATE
  if (!privateKeyJwk) {
    return NextResponse.json(
      { error: 'ATPROTO_JWK_PRIVATE not configured' },
      { status: 500 }
    )
  }
  try {
    const parsed = JSON.parse(privateKeyJwk)
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to generate JWKS:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate JWKS',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
