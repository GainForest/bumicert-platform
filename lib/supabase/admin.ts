import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with SERVICE ROLE key.
 * 
 * IMPORTANT SECURITY NOTES:
 * - This bypasses Row Level Security (RLS) completely
 * - Only use for trusted server-side operations (session storage, admin tasks)
 * - Never expose this client to the browser
 * - The 'server-only' import prevents accidental client-side usage
 * 
 * USAGE:
 * - Session/state storage for OAuth flows
 * - Background jobs that need full database access
 * - Admin operations that should bypass RLS
 * 
 * DO NOT USE FOR:
 * - User data access (use RLS-protected client instead)
 * - Client Components (will throw build error)
 * - Operations that should respect user permissions
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
      'Get this from Supabase Dashboard → Settings → API → service_role key'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,  // Don't persist auth in server context
      autoRefreshToken: false, // No need to refresh tokens on server
      detectSessionInUrl: false, // Not needed for server-side
    },
  })
}
