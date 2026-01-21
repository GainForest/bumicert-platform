# Authentication Migration Summary

**Date:** January 21, 2026  
**Migration:** ClimateAI SDK Password Auth → Hypercerts SDK OAuth Auth

---

## Overview

Successfully migrated the authentication system from **ClimateAI SDK's password-based authentication** to **Hypercerts SDK's OAuth 2.0 authentication**, while keeping ClimateAI SDK available for data operations (organization profiles, uploads, etc.).

### Key Change
- **Before:** Users entered handle + password in a modal → tRPC call → ClimateAI SDK → PDS
- **After:** Users click login → Redirect to OAuth provider → Callback → Hypercerts SDK → Supabase session storage

---

## What Changed

### 1. Authentication Flow

| Aspect | Old (ClimateAI SDK) | New (Hypercerts SDK) |
|--------|-------------------|---------------------|
| **Method** | Password-based (`CredentialSession`) | OAuth 2.0 with PKCE |
| **User Flow** | Modal with password input | Redirect to PDS OAuth page |
| **Session Storage** | Encrypted cookie (`climateai.org_session`) | Supabase database (`oauth_sessions` table) |
| **Session Cookie** | Direct session data | Session ID only (`hypercerts-session-id`) |
| **Login API** | `trpcApi.auth.login.useMutation()` | `getLoginUrl()` server action |
| **Logout API** | `trpcApi.auth.logout.useMutation()` | `logout()` server action |
| **Session Resume** | `trpcApi.auth.resume.query()` | `getAuthState()` server action |

### 2. Session Storage Architecture

**Old Architecture:**
```
Browser Cookie (encrypted JWT)
  ├── accessJwt (ATProto access token)
  ├── refreshJwt (ATProto refresh token)
  ├── did (User DID)
  └── handle (User handle)
```

**New Architecture:**
```
Browser Cookie: hypercerts-session-id (UUID)
                      ↓
Supabase oauth_sessions table:
  ├── session_id (UUID from cookie)
  ├── did (User DID)
  ├── session_data (OAuth session - encrypted)
  └── expires_at (7 days from login)
```

---

## Files Modified

### New Files Created

| File | Purpose |
|------|---------|
| `lib/hypercerts/auth-actions.ts` | Server actions for auth (getAuthState, logout, getLoginUrl) |
| `components/hooks/useAuthCallback.ts` | Hook to handle OAuth callback detection |
| `components/providers/AuthCallbackHandler.tsx` | Client component that uses useAuthCallback |

### Files Modified

| File | Changes |
|------|---------|
| `components/stores/atproto.ts` | Replaced tRPC calls with server actions, added refreshAuth() and logout() methods |
| `components/global/modals/sign-in.tsx` | Removed password field, changed to OAuth redirect flow |
| `components/global/modals/profile.tsx` | Updated logout to use store's logout() method |
| `app/api/hypercerts/auth/callback/route.ts` | Updated redirect URL from `/testing/hypercerts-auth-test` to `/?auth=success` |
| `app/layout.tsx` | Added `<AuthCallbackHandler />` component |

---

## Implementation Details

### 1. Server Actions (lib/hypercerts/auth-actions.ts)

**Three main functions:**

```typescript
// Get current authentication state
export async function getAuthState(): Promise<AuthState>

// Logout and clear session
export async function logout(): Promise<void>

// Get OAuth URL for login redirect
export async function getLoginUrl(handle: string): Promise<string>
```

**How it works:**
1. Reads `hypercerts-session-id` cookie
2. Looks up DID from Supabase `oauth_sessions` table
3. Restores OAuth session using `hypercertsSdk.restoreSession(did)`
4. Returns user info (DID + handle)

### 2. Zustand Store (components/stores/atproto.ts)

**New store structure:**

```typescript
{
  isReady: boolean
  auth: {
    status: "RESUMING" | "AUTHENTICATED" | "UNAUTHENTICATED"
    authenticated: boolean
    user: { did: string; handle: string } | null
  }
  setAuth: (user: User | null) => void
  refreshAuth: () => Promise<void>  // NEW
  logout: () => Promise<void>        // NEW
}
```

**Key changes:**
- On init: calls `getAuthState()` instead of `trpcClient.auth.resume.query()`
- Removed `service` parameter from `setAuth()` (no longer needed)
- Added `refreshAuth()` - re-fetches auth state (used after OAuth callback)
- Added `logout()` - calls server action and updates store

### 3. Sign-In Modal (components/global/modals/sign-in.tsx)

**Removed:**
- Password input field
- "Remember me" switch
- tRPC `auth.login` mutation

**Added:**
- OAuth redirect logic using `getLoginUrl()`
- Stores handle in localStorage (`pending-login-handle`) for post-callback processing
- Redirects user to OAuth provider

**New flow:**
```typescript
const handleSignIn = async () => {
  const authUrl = await getLoginUrl(inputHandlePrefix);
  localStorage.setItem('pending-login-handle', `${inputHandlePrefix}.climateai.org`);
  window.location.href = authUrl; // Redirect to OAuth
}
```

### 4. OAuth Callback (app/api/hypercerts/auth/callback/route.ts)

**Changed redirect:**
- Before: `/testing/hypercerts-auth-test`
- After: `/?auth=success`

This allows any page to handle the callback via `useAuthCallback()` hook.

### 5. Auth Callback Handler (useAuthCallback + AuthCallbackHandler)

**Hook logic:**
```typescript
export function useAuthCallback() {
  const authStatus = searchParams.get('auth')
  
  if (authStatus === 'success') {
    refreshAuth()  // Update Zustand store
    // Add handle to previous-sessions localStorage
    // Clean up URL (?auth=success removed)
  }
}
```

**Integration:**
- `<AuthCallbackHandler />` added to `app/layout.tsx`
- Runs on every page, detects `?auth=success` or `?auth=failed`
- Automatically handles post-login flow

---

## User Experience Changes

### Before (Password-Based)
1. User clicks "Sign In"
2. Modal opens
3. User enters handle + password
4. Submit → Loading → Modal closes
5. User is authenticated

### After (OAuth Redirect)
1. User clicks "Sign In"
2. Modal opens
3. User enters handle (no password)
4. Submit → Redirected to PDS OAuth page
5. User enters password **at PDS** (not in app)
6. User approves permissions
7. Redirected back to app
8. `useAuthCallback()` detects success
9. Store updated → User is authenticated

**Key UX difference:** User leaves the app briefly for OAuth flow.

---

## ClimateAI SDK Compatibility

### Current Status: **TO BE TESTED**

The ClimateAI SDK's tRPC endpoints (organization profile, uploads, etc.) are still available and **should** work if:

1. **ATProto session compatibility:** Both SDKs authenticate against the same PDS (`climateai.org`) and both receive ATProto JWT tokens. If the Hypercerts OAuth tokens are valid ATProto tokens, ClimateAI SDK should accept them.

2. **Session format compatibility:** The ClimateAI SDK reads sessions from cookies. We may need to add a bridge that syncs the Hypercerts session to the ClimateAI cookie format.

### Testing Checklist (TODO)

- [ ] Test organization profile editing after OAuth login
- [ ] Test image/blob uploads after OAuth login
- [ ] Test projects/sites/layers operations
- [ ] Test bumicert creation flow
- [ ] Verify tRPC context receives valid session

### Potential Bridge Solution (if needed)

If ClimateAI SDK operations fail, we can create a session bridge:

```typescript
// In session-helpers.ts or new file
export async function syncToClimateAISession(did: string) {
  const session = await hypercertsSdk.restoreSession(did)
  
  // Convert OAuth session to ClimateAI cookie format
  const climateAISession = {
    accessJwt: session.accessToken,
    refreshJwt: session.refreshToken,
    did: did,
    handle: session.handle
  }
  
  // Write to climateai.org_session cookie
  await saveClimateAISessionCookie(climateAISession)
}
```

Call this in the OAuth callback after successful authentication.

---

## Breaking Changes

### For Users
- **Password no longer entered in app** - Users authenticate directly with their PDS
- **Redirect flow** - Brief redirect to OAuth provider (may feel slower)
- **No password storage** - App never sees user's password (more secure)

### For Developers
- **Import changes:**
  ```diff
  - import { trpcApi } from "@/components/providers/TrpcProvider"
  + import { getLoginUrl, logout } from "@/lib/hypercerts/auth-actions"
  ```

- **Login flow changes:**
  ```diff
  - signIn({ handlePrefix, service: "climateai.org", password })
  + const authUrl = await getLoginUrl(handlePrefix)
  + window.location.href = authUrl
  ```

- **Logout changes:**
  ```diff
  - trpcApi.auth.logout.useMutation()
  + const logout = useAtprotoStore((state) => state.logout)
  + await logout()
  ```

- **Session resume:**
  ```diff
  - trpcClient.auth.resume.query({ service: "climateai.org" })
  + const refreshAuth = useAtprotoStore((state) => state.refreshAuth)
  + await refreshAuth()
  ```

---

## Environment Variables

**Required (already configured):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."  # For OAuth storage

# Hypercerts SDK
NEXT_PUBLIC_APP_URL="..."
NEXT_PUBLIC_PDS_URL="https://climateai.org"
NEXT_PUBLIC_SDS_URL="https://sds.hypercerts.org"
ATPROTO_JWK_PRIVATE='{"keys":[...]}'  # OAuth signing key
```

**Optional (for ClimateAI SDK session sync - if needed):**
```bash
COOKIE_SECRET="..."  # For encrypting ClimateAI SDK cookies
```

---

## Testing Instructions

### Manual Testing

1. **Fresh Login:**
   ```
   1. Clear browser cookies/localStorage
   2. Click "Sign In" in navbar
   3. Enter handle (e.g., "test-user")
   4. Should redirect to climateai.org OAuth page
   5. Enter password at OAuth page
   6. Approve permissions
   7. Should redirect back to app with ?auth=success
   8. Should see authenticated state in navbar
   ```

2. **Session Persistence:**
   ```
   1. Login as above
   2. Close browser
   3. Reopen and visit app
   4. Should still be authenticated (session persists 7 days)
   ```

3. **Logout:**
   ```
   1. Click profile icon
   2. Click "Sign out"
   3. Should show unauthenticated state
   4. Refresh page - still unauthenticated
   ```

4. **ClimateAI SDK Operations (CRITICAL TEST):**
   ```
   1. Login via OAuth
   2. Go to /upload/organization/[your-did]
   3. Try editing organization profile
   4. Try uploading an image
   5. Verify operations work
   ```

### Automated Testing

**TODO: Add E2E tests**
- Cypress/Playwright tests for OAuth flow
- Unit tests for auth-actions
- Integration tests for session storage

---

## Rollback Plan

If the migration causes issues, you can rollback by:

1. **Revert files:**
   ```bash
   git revert <migration-commit-hash>
   ```

2. **Manual rollback (if needed):**
   - Restore old `components/stores/atproto.ts`
   - Restore old `components/global/modals/sign-in.tsx`
   - Restore old `components/global/modals/profile.tsx`
   - Remove `lib/hypercerts/auth-actions.ts`
   - Remove `components/hooks/useAuthCallback.ts`
   - Remove `components/providers/AuthCallbackHandler.tsx`
   - Remove `<AuthCallbackHandler />` from `app/layout.tsx`

3. **Clear user sessions:**
   - Users will need to re-login with old system
   - Clear Supabase `oauth_sessions` table if desired

---

## Next Steps

### Immediate (Before Production)
1. ✅ Complete migration implementation
2. ⏳ **Test ClimateAI SDK compatibility** (see checklist above)
3. ⏳ Implement session bridge if needed
4. ⏳ Add error handling for OAuth failures
5. ⏳ Add loading states during redirect
6. ⏳ Test on staging environment

### Short-term
- Add E2E tests for OAuth flow
- Improve handle resolution (get actual handle from DID document)
- Add "Sign in with different provider" support
- Implement token refresh logic

### Long-term
- Consider migrating ClimateAI SDK data operations to Hypercerts SDK
- Add organization creation/collaborators features (already implemented in Hypercerts SDK)
- Implement granular OAuth scopes (read-only, posting, etc.)
- Add session revocation UI

---

## Security Improvements

### Before (Password-Based)
- ❌ Password transmitted to app server
- ❌ App server must be trusted with credentials
- ✅ Simple, fast login
- ✅ No redirect flow

### After (OAuth)
- ✅ Password never leaves PDS
- ✅ App only gets delegated access tokens
- ✅ Granular permission scopes (future)
- ✅ Standard OAuth 2.0 security
- ❌ More complex flow
- ❌ Requires redirect

**Net Result:** More secure for production, especially for third-party integrations.

---

## Known Issues & Limitations

1. **Handle Resolution:**
   - Currently falls back to using DID if handle not available in session
   - TODO: Implement proper handle resolution from DID document

2. **Session Sync:**
   - ClimateAI SDK compatibility not yet tested
   - May need session bridge implementation

3. **Error Handling:**
   - OAuth failures currently just log to console
   - TODO: Add user-facing error messages/toast notifications

4. **Loading States:**
   - No loading indicator during OAuth redirect
   - TODO: Add intermediate loading page

5. **Previous Sessions:**
   - Still stores in localStorage (not centralized)
   - Consider moving to Supabase for cross-device sync

---

## Support & Documentation

**Related Documentation:**
- [`HYPERCERTS_IMPLEMENTATION_README.md`](./HYPERCERTS_IMPLEMENTATION_README.md) - Hypercerts SDK setup
- [`ORGANIZATIONS_COLLABORATORS_GUIDE.md`](./ORGANIZATIONS_COLLABORATORS_GUIDE.md) - Organization features
- [`SUPABASE_INTEGRATION.md`](./SUPABASE_INTEGRATION.md) - Supabase setup details

**For Questions:**
- Check Hypercerts SDK docs: https://docs.hypercerts.org
- ATProto OAuth spec: https://atproto.com/specs/oauth

---

**Migration Completed:** January 21, 2026  
**Status:** ✅ Implementation Complete | ⏳ Testing In Progress  
**Next:** Test ClimateAI SDK compatibility
