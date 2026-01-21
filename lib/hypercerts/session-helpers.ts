import 'server-only'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const SESSION_COOKIE_NAME = 'hypercerts-session-id'

/**
 * Set session cookie after OAuth callback
 * 
 * Looks up the session by DID,
 * retrieves the session ID, and stores it in a cookie.
 * 
 * Security: Cookie is httpOnly, secure in production, sameSite: lax
 */
export async function setSessionCookie(did: string): Promise<void> {
  console.log('[setSessionCookie] Looking up session for DID:', did)
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('oauth_sessions')
    .select('session_id')
    .eq('did', did)
    .single()
  
  if (error) {
    console.error('[setSessionCookie] Error fetching session:', error)
    throw new Error(`Session not found after OAuth callback: ${error.message}`)
  }
  
  if (!data?.session_id) {
    console.error('[setSessionCookie] No session_id in data:', data)
    throw new Error('Session not found after OAuth callback - no session_id')
  }
  
  console.log('[setSessionCookie] Found session_id:', data.session_id)
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, data.session_id, {
    httpOnly: true,                                  
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'lax',                                 
    path: '/',
    maxAge: 60 * 60 * 24 * 7,                       
  })
  
  console.log('[setSessionCookie] Cookie set successfully')
}

export async function getSessionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return sessionId || null
}

/**
 * Lookup DID by session ID
 * 
 * Validates the session exists, checks expiry, and returns the associated DID.
 * Returns null if session is invalid, expired, or doesn't exist.
 */
export async function lookupDidBySessionId(sessionId: string): Promise<string | null> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('oauth_sessions')
    .select('did, expires_at')
    .eq('session_id', sessionId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  if (new Date(data.expires_at) < new Date()) {
    await supabase
      .from('oauth_sessions')
      .delete()
      .eq('session_id', sessionId)
    
    return null
  }
  
  return data.did
}

/**
 * Delete session cookie
 * 
 * Clears the session cookie from the browser.
 * Used during logout or when session is invalid.
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
