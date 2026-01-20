import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  
  try {
    // Complete OAuth flow
    const session = await hypercertsSdk.callback(searchParams)
    
    // Store user DID in cookie
    const cookieStore = await cookies()
    cookieStore.set('hypercerts-user-did', session.did, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    })
    
    // Redirect back to testing page
    const protocol = req.headers.get('x-forwarded-proto') || 
                     (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
    const host = req.headers.get('host')
    const baseUrl = `${protocol}://${host}`
    
    return NextResponse.redirect(new URL('/testing/hypercerts-auth-test', baseUrl))
  } catch (error) {
    console.error('Authentication failed:', error)
    
    // Redirect to testing page with error
    const protocol = req.headers.get('x-forwarded-proto') || 
                     (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
    const host = req.headers.get('host')
    const baseUrl = `${protocol}://${host}`
    
    return NextResponse.redirect(
      new URL('/testing/hypercerts-auth-test?error=auth_failed', baseUrl)
    )
  }
}
