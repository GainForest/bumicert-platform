import type { SessionStore } from '@hypercerts-org/sdk-core'
import type { NodeSavedSession } from '@atproto/oauth-client-node'
import { createAdminClient } from '@/lib/supabase/admin'

export class SupabaseSessionStore implements SessionStore {
  async set(did: string, session: NodeSavedSession): Promise<void> {
    const supabase = createAdminClient()
    
    // we generate a sessionId to make sure that users cant retrieve other session using just their did
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
      })
    
    if (error) {
      throw new Error(`Failed to store session: ${error.message}`)
    }
  }

  async get(did: string): Promise<NodeSavedSession | undefined> {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('session_data')
      .eq('did', did)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - session doesn't exist
        return undefined
      }
      throw new Error(`Failed to retrieve session: ${error.message}`)
    }
    
    return data?.session_data as NodeSavedSession | undefined
  }

  async del(did: string): Promise<void> {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('oauth_sessions')
      .delete()
      .eq('did', did)
    
    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`)
    }
  }
}
