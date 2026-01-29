import { createClient } from "@supabase/supabase-js";
import {
  createATProtoSDK,
  createSupabaseSessionStore,
  createSupabaseStateStore,
} from "climateai-sdk/oauth";

export const OAUTH_SCOPE = "atproto repo:app.gainforest.organization.info?action=create"

// Create Supabase client with service role key (server-side only!)
// Cast to work around version mismatch between SDK's bundled supabase and ours
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) as unknown as Parameters<typeof createSupabaseSessionStore>[0];

// Unique identifier for this app in the shared Supabase tables
const APP_ID = "bumicerts";

// Public URL of the app (ngrok for dev, production URL for prod)
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL!;

/**
 * ATProto SDK instance configured for OAuth authentication.
 *
 * This SDK handles:
 * - OAuth authorization flow initiation
 * - OAuth callback processing and token exchange
 * - Session restoration for authenticated API calls
 *
 * Sessions are stored in Supabase (atproto_oauth_session table).
 * Auth flow state is stored temporarily in Supabase (atproto_oauth_state table).
 */
export const atprotoSDK = createATProtoSDK({
  oauth: {
    clientId: `${PUBLIC_URL}/client-metadata.json`,
    redirectUri: `${PUBLIC_URL}/api/oauth/callback`,
    jwksUri: `${PUBLIC_URL}/.well-known/jwks.json`,
    jwkPrivate: process.env.ATPROTO_JWK_PRIVATE!,
    scope: "atproto transition:generic",
  },
  servers: {
    pds: "https://climateai.org",
  },
  storage: {
    sessionStore: createSupabaseSessionStore(supabase, APP_ID),
    stateStore: createSupabaseStateStore(supabase, APP_ID),
  },
});
