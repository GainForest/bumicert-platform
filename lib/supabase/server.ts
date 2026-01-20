import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase server environment variables");
}

/**
 * Supabase admin client for server-side usage.
 * Uses the service role key - bypasses RLS.
 * Only use in API routes/server components.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
