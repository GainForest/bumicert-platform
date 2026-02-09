---
"bumicerts": patch
---

Migrate authentication to ATProto OAuth 2.0 and replace climateai-sdk with gainforest-sdk

## Authentication

- Replaced password-based sign-in with ATProto OAuth 2.0 authorization code flow (PKCE + DPoP)
- Users are now redirected to ClimateAI to authenticate
- OAuth tokens stored in Supabase, session identity saved in encrypted cookies
- Added OAuth callback, client-metadata, and JWKS endpoints
- Added AtprotoProvider for client-side session initialization
- Added server actions for authorize, logout, session checking, and profile fetching
- Removed forgot-password modal and all credential-based login logic
- Added loopback OAuth configuration for local development (RFC 8252 compliant)
- Local development now works without ngrok using 127.0.0.1:3000
- OAuth automatically switches between loopback (dev) and web client (production) modes

## SDK Migration

- Replaced `climateai-sdk` (GitHub) with `gainforest-sdk` (vendored .tgz)
- Updated all imports across ~50 files
- Renamed types: `AppGainforestCommonDefs` to `OrgHypercertsDefs`
- Renamed tRPC routes: `site` to `location`
- Mutations now require explicit `did` parameter
- Flattened response shapes for bumicert creation

## Other Changes

- Organization visibility renamed from "Hidden" to "Unlisted"
- Expanded `.env.example` with OAuth and Supabase configuration
- Simplified session checking across all API routes
- Profile modal now displays avatar and displayName from ATProto profile
