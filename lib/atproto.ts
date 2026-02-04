import { createClient } from "@supabase/supabase-js";
import {
  createATProtoSDK,
  createSupabaseSessionStore,
  createSupabaseStateStore,
} from "gainforest-sdk/oauth";

export const OAUTH_SCOPE = "atproto transition:generic"

// Create Supabase client with service role key (server-side only!)
// Cast to work around version mismatch between SDK's bundled supabase and ours
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
) as unknown as Parameters<typeof createSupabaseSessionStore>[0];

// Unique identifier for this app in the shared Supabase tables
const APP_ID = "bumicerts";

/**
 * Resolves the public URL of the app from available environment variables.
 * 
 * We need to set the production url to NEXT_PUBLIC_BASE_URL and for the previews we just use VERCEL_BRANCH_URL
 *
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL — explicit override (local dev with ngrok, or custom config)
 * 2. VERCEL_BRANCH_URL — stable per-branch URL for preview deploys (auto-set by Vercel)
 * 
 * Disclaimer when testing previews only works with the branch name preview and not with the commit name preview
 */
export const resolvePublicUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  throw new Error(
    "Set NEXT_PUBLIC_BASE_URL, or deploy to Vercel (provides VERCEL_PROJECT_PRODUCTION_URL / VERCEL_BRANCH_URL automatically)"
  );
};

const PUBLIC_URL = resolvePublicUrl();

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
    scope: OAUTH_SCOPE,
  },
  servers: {
    pds: "https://climateai.org",
  },
  storage: {
    sessionStore: createSupabaseSessionStore(supabase, APP_ID),
    stateStore: createSupabaseStateStore(supabase, APP_ID),
  },
});
