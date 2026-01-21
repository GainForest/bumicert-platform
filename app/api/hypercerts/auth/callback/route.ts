import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'
import { setSessionCookie } from '@/lib/hypercerts/session-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  
  try {
    // Complete OAuth flow (SDK internally stores session with session ID)
    const session = await hypercertsSdk.callback(searchParams)
    
    // Set session cookie with random UUID session ID
    await setSessionCookie(session.did)
    
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
