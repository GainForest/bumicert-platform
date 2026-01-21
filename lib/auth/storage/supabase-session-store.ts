import type { SessionStore } from '@hypercerts-org/sdk-core'
import type { NodeSavedSession } from '@atproto/oauth-client-node'
import { createAdminClient } from '@/lib/supabase/admin'

export class SupabaseSessionStore implements SessionStore {
  async set(did: string, session: NodeSavedSession): Promise<void> {
    console.log('[SupabaseSessionStore.set] Starting - DID:', did)
    const supabase = createAdminClient()
    
    // Generate a session ID for tracking purposes
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    console.log('[SupabaseSessionStore.set] Generated session_id:', sessionId)
    console.log('[SupabaseSessionStore.set] Session expires at:', expiresAt.toISOString())
    
    // Upsert with did as the unique key (primary key)
    // This will replace any existing session for this DID
    const { data, error } = await supabase
      .from('oauth_sessions')
      .upsert({
        did,  // Primary key - will update if exists, insert if not
        session_id: sessionId,
        session_data: session,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'did'  // Explicitly specify the conflict target
      })
      .select()  // Return the inserted/updated row
    
    if (error) {
      console.error('[SupabaseSessionStore.set] Failed to store session:', error)
      throw new Error(`Failed to store session: ${error.message}`)
    }
    
    console.log('[SupabaseSessionStore.set] Session stored successfully, returned data:', data)
    
    // Immediately verify the session was stored by reading it back
    const verification = await supabase
      .from('oauth_sessions')
      .select('did, session_id, expires_at')
      .eq('did', did)
      .single()
    
    console.log('[SupabaseSessionStore.set] Verification query result:', verification)
    
    if (verification.error) {
      console.error('[SupabaseSessionStore.set] Verification failed:', verification.error)
      throw new Error(`Session verification failed: ${verification.error.message}`)
    }
    
    if (!verification.data) {
      console.error('[SupabaseSessionStore.set] Verification returned no data')
      throw new Error('Session was not found after storage')
    }
    
    console.log('[SupabaseSessionStore.set] ✅ Session stored and verified successfully')
  }

  async get(did: string): Promise<NodeSavedSession | undefined> {
    console.log('[SupabaseSessionStore.get] Retrieving session for DID:', did)
    const supabase = createAdminClient()
    
    // Check if any rows exist for this DID first
    const { count } = await supabase
      .from('oauth_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('did', did)
    
    console.log('[SupabaseSessionStore.get] Row count for DID:', count)
    
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('did, session_id, session_data, expires_at, created_at, updated_at')
      .eq('did', did)
      .single()
    
    console.log('[SupabaseSessionStore.get] Query result - data:', data ? 'exists' : 'null', 'error:', error)
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - session doesn't exist
        console.log('[SupabaseSessionStore.get] No session found (PGRST116)')
        return undefined
      }
      console.error('[SupabaseSessionStore.get] Error retrieving session:', error)
      throw new Error(`Failed to retrieve session: ${error.message}`)
    }
    
    if (!data) {
      console.log('[SupabaseSessionStore.get] Query succeeded but no data returned')
      return undefined
    }
    
    console.log('[SupabaseSessionStore.get] ✅ Session retrieved successfully')
    console.log('[SupabaseSessionStore.get] Session details:', {
      did: data.did,
      session_id: data.session_id,
      expires_at: data.expires_at,
      has_session_data: !!data.session_data
    })
    
    return data.session_data as NodeSavedSession | undefined
  }

  async del(did: string): Promise<void> {
    console.log('[SupabaseSessionStore.del] Deleting session for DID:', did)
    const supabase = createAdminClient()
    
    const { error, count } = await supabase
      .from('oauth_sessions')
      .delete({ count: 'exact' })
      .eq('did', did)
    
    if (error) {
      console.error('[SupabaseSessionStore.del] Failed to delete session:', error)
      throw new Error(`Failed to delete session: ${error.message}`)
    }
    
    console.log('[SupabaseSessionStore.del] ✅ Deleted', count, 'session(s)')
  }
}
