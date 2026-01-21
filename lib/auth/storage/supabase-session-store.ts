import type { SessionStore } from '@hypercerts-org/sdk-core'
import type { NodeSavedSession } from '@atproto/oauth-client-node'
import { createAdminClient } from '@/lib/supabase/admin'

export class SupabaseSessionStore implements SessionStore {
  async set(did: string, session: NodeSavedSession): Promise<void> {
    const supabase = createAdminClient()
    
    // session id to ensure that when we restore we do it through session id
    // for security purposes so that we can't restore a session that was created by another user
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const { error } = await supabase
      .from('oauth_sessions')
      .upsert({
        did,
        session_id: sessionId,
        session_data: session,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'did'
      })
      .select()
    
    if (error) {
      console.error('[SupabaseSessionStore.set] Failed to store session:', error)
      throw new Error(`Failed to store session: ${error.message}`)
    }
    
  }

  async get(did: string): Promise<NodeSavedSession | undefined> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('did, session_id, session_data, expires_at, created_at, updated_at')
      .eq('did', did)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error("Session not found for did: ", did)
        return undefined
      }
      console.error('[SupabaseSessionStore.get] Error retrieving session:', error)
      throw new Error(`Failed to retrieve session: ${error.message}`)
    }
    
    if (!data) {
      console.error('[SupabaseSessionStore.get] Query succeeded but no data returned')
      return undefined
    }
    
    return data.session_data as NodeSavedSession | undefined
  }

  async del(did: string): Promise<void> {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('oauth_sessions')
      .delete({ count: 'exact' })
      .eq('did', did)
    
    if (error) {
      console.error('[SupabaseSessionStore.del] Failed to delete session:', error)
      throw new Error(`Failed to delete session: ${error.message}`)
    }
  }
}
