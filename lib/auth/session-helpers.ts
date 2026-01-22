import 'server-only'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const SESSION_COOKIE_NAME = 'hypercerts-session-id'

/**
 * Set session cookie after OAuth callback
 * 
 * Looks up the session by DID,
 * retrieves the session ID, and stores it in a cookie.
 * the session ID is used to retrieve a session
 * 
 */
export async function setSessionCookie(did: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('oauth_sessions')
    .select('session_id')
    .eq('did', did)
    .single()
  
  if (error) {
    throw new Error(`Session not found after OAuth callback: ${error.message}`)
  }
  
  if (!data?.session_id) {
    throw new Error('Session not found after OAuth callback - no session_id')
  }
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, data.session_id, {
    httpOnly: true,                                  
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'lax',                                 
    path: '/',
    maxAge: 60 * 60 * 24 * 7,                       
  })
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

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
