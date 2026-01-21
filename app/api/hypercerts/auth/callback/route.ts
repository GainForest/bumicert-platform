import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'
import { setSessionCookie } from '@/lib/hypercerts/session-helpers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  
  try {
    console.log('[OAuth Callback] ====== STARTING OAUTH CALLBACK ======')
    console.log('[OAuth Callback] Params:', Object.fromEntries(searchParams.entries()))
    
    console.log('[OAuth Callback] Calling hypercertsSdk.callback()...')
    const session = await hypercertsSdk.callback(searchParams)
    console.log('[OAuth Callback] ✅ Session received from SDK')
    console.log('[OAuth Callback] Session DID:', session.did)
    console.log('[OAuth Callback] Session type:', typeof session)
    console.log('[OAuth Callback] Session keys:', Object.keys(session))
    
    console.log('[OAuth Callback] Setting session cookie...')
    await setSessionCookie(session.did)
    console.log('[OAuth Callback] ✅ Session cookie set successfully')
    
    const protocol = req.headers.get('x-forwarded-proto') || 
                     (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
    const host = req.headers.get('host')
    const baseUrl = `${protocol}://${host}`
    
    // Redirect to home page with success indicator
    // The frontend will detect auth and handle previous session storage
    console.log('[OAuth Callback] ====== OAUTH CALLBACK SUCCESS ======')
    return NextResponse.redirect(new URL('/testing/hypercerts-auth-test/?auth=success', baseUrl))
  } catch (error) {
    console.error('[OAuth Callback] ====== OAUTH CALLBACK FAILED ======')
    console.error('[OAuth Callback] Error:', error)
    if (error instanceof Error) {
      console.error('[OAuth Callback] Error name:', error.name)
      console.error('[OAuth Callback] Error message:', error.message)
      console.error('[OAuth Callback] Error stack:', error.stack)
    }
    
    const protocol = req.headers.get('x-forwarded-proto') || 
                     (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
    const host = req.headers.get('host')
    const baseUrl = `${protocol}://${host}`
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.redirect(
      new URL('/testing/hypercerts-auth-test/?auth=failed&error=' + encodeURIComponent(errorMessage), baseUrl)
    )
  }
}
