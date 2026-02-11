---
"bumicerts": major
---

## OAuth Integration with gainforest-sdk

### Authentication
- Migrated from `climateai-sdk` to `gainforest-sdk` for OAuth authentication
- Implemented RFC 8252 compliant loopback client for local development
- Added Supabase-backed session and state storage
- New `AtprotoProvider` for client-side auth state management
- Simplified sign-in flow with OAuth authorization

### SDK Migration
- Replaced `climateai-sdk` with `gainforest-sdk` across the codebase
- Updated session handling to use `getAppSession()` and `atprotoSDK.restoreSession()`
- Configured OAuth with proper JWK for token signing
