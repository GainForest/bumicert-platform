import type { StateStore } from '@hypercerts-org/sdk-core'
import type { NodeSavedState } from '@atproto/oauth-client-node'
import { createAdminClient } from '@/lib/supabase/admin'

export class SupabaseStateStore implements StateStore {
  async set(state: string, data: NodeSavedState): Promise<void> {
    const supabase = createAdminClient()
    
    // OAuth states expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    const { error } = await supabase
      .from('oauth_states')
      .upsert({
        state,
        state_data: data,
        expires_at: expiresAt.toISOString(),
      })
    
    if (error) {
      throw new Error(`Failed to store state: ${error.message}`)
    }
  }

  async get(state: string): Promise<NodeSavedState | undefined> {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('oauth_states')
      .select('state_data, expires_at')
      .eq('state', state)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return undefined
      }
      throw new Error(`Failed to retrieve state: ${error.message}`)
    }
    
    if (data && new Date(data.expires_at) < new Date()) {
      await this.del(state)
      return undefined
    }
    
    return data?.state_data as NodeSavedState | undefined
  }

  async del(state: string): Promise<void> {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state)
    
    if (error) {
      throw new Error(`Failed to delete state: ${error.message}`)
    }
  }
}
