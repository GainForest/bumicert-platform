# OAuth Session Schema Fix

**Date:** January 21, 2026  
**Issue:** OAuth callback failing with "The session was deleted by another process"  
**Root Cause:** Table had `session_id` as PK instead of `did`, causing duplicate sessions and query failures

---

## The Problem

The `oauth_sessions` table had `session_id` as the primary key, but the Hypercerts SDK's `SessionStore` interface operates on `did` as the unique key:

```typescript
interface SessionStore {
  set(did: string, session: NodeSavedSession): Promise<void>
  get(did: string): Promise<NodeSavedSession | undefined>
  del(did: string): Promise<void>
}
```

This caused:
1. Every `set(did, session)` generated a NEW `session_id` (UUID)
2. With `session_id` as PK, this created multiple rows for the same DID
3. `get(did)` with `.single()` failed when multiple rows existed
4. SDK received `undefined` → threw "session was deleted by another process"

---

## The Solution

**Architecture Decision:** 1:1 mapping between DID and session (last login wins)

This matches:
- How the Hypercerts SDK expects sessions to work
- Standard OAuth behavior (most services work this way)
- Simpler implementation and maintenance

**Trade-off:** No multi-device support (logging in on laptop logs out phone)

---

## Database Migration

### Step 1: Backup Existing Data (if needed)

```sql
-- Optional: Export existing sessions
CREATE TABLE oauth_sessions_backup AS 
SELECT * FROM oauth_sessions;
```

### Step 2: Drop and Recreate Table

Since we're changing the primary key, the easiest approach is to drop and recreate:

```sql
-- Drop the existing table
DROP TABLE IF EXISTS oauth_sessions CASCADE;

-- Recreate with did as primary key
CREATE TABLE oauth_sessions (
  did TEXT PRIMARY KEY,
  session_id TEXT,
  session_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_oauth_sessions_expires_at ON oauth_sessions(expires_at);

-- Enable Row Level Security (but no policies - service role only)
ALTER TABLE oauth_sessions ENABLE ROW LEVEL SECURITY;
```

**Note:** All users will need to log in again after this migration.

### Alternative: Migrate Data (if you want to preserve sessions)

If you want to keep existing sessions and only keep the most recent per DID:

```sql
-- Step 1: Add did as a new primary key candidate
ALTER TABLE oauth_sessions ADD COLUMN did_temp TEXT;

-- Step 2: Copy did data
UPDATE oauth_sessions SET did_temp = did;

-- Step 3: Keep only the most recent session per DID
DELETE FROM oauth_sessions a
USING oauth_sessions b
WHERE a.did = b.did 
  AND a.created_at < b.created_at;

-- Step 4: Drop old PK and create new one
ALTER TABLE oauth_sessions DROP CONSTRAINT oauth_sessions_pkey;
ALTER TABLE oauth_sessions ADD PRIMARY KEY (did);

-- Step 5: Clean up
ALTER TABLE oauth_sessions DROP COLUMN did_temp;
```

---

## Code Changes Made

### 1. SupabaseSessionStore - set() method

**Added:**
- Explicit `onConflict: 'did'` to upsert
- `.select()` to return inserted/updated row
- Verification query to ensure session was stored
- Comprehensive logging

**Result:** Upsert now properly replaces existing session for the same DID.

### 2. SupabaseSessionStore - get() method

**Added:**
- Row count check before query
- Extended select to fetch all columns for debugging
- Detailed logging of query results
- Better error messages

**Result:** Can now diagnose exactly what's happening when retrieving sessions.

### 3. SupabaseSessionStore - del() method

**Added:**
- Count of deleted rows
- Better logging

### 4. OAuth Callback Route

**Added:**
- Extensive logging at each step
- Session object inspection
- Clear success/failure markers

---

## Testing the Fix

### 1. Clear Existing Sessions

```sql
-- In Supabase SQL Editor
TRUNCATE TABLE oauth_sessions;
```

### 2. Test Login Flow

1. Go to your app
2. Click "Sign In"
3. Enter handle and complete OAuth
4. Watch the server logs

**Expected logs:**
```
[OAuth Callback] ====== STARTING OAUTH CALLBACK ======
[SupabaseSessionStore.set] Starting - DID: did:plc:...
[SupabaseSessionStore.set] Generated session_id: ...
[SupabaseSessionStore.set] Session stored successfully
[SupabaseSessionStore.set] Verification query result: { data: {...} }
[SupabaseSessionStore.set] ✅ Session stored and verified successfully
[OAuth Callback] ✅ Session received from SDK
[OAuth Callback] ✅ Session cookie set successfully
[OAuth Callback] ====== OAUTH CALLBACK SUCCESS ======
```

### 3. Verify in Database

```sql
-- Should show exactly 1 row per DID
SELECT did, session_id, expires_at, created_at 
FROM oauth_sessions 
ORDER BY created_at DESC;
```

### 4. Test Session Persistence

1. Refresh the page
2. Should still be logged in
3. Check logs for `getAuthState()` calls

### 5. Test Login Replacement

1. Log in as User A
2. Check database - 1 session for User A
3. Log in as User A again (simulate different device)
4. Check database - still 1 session for User A (replaced)
5. First session should be replaced with new one

---

## Rollback Plan

If issues arise:

### Option 1: Restore from Backup

```sql
DROP TABLE oauth_sessions;
CREATE TABLE oauth_sessions AS SELECT * FROM oauth_sessions_backup;
-- Re-add constraints as needed
```

### Option 2: Revert Code Changes

```bash
git revert <commit-hash>
```

**Files to revert:**
- `lib/hypercerts/storage/supabase-session-store.ts`
- `app/api/hypercerts/auth/callback/route.ts`

---

## Expected Behavior After Fix

### ✅ OAuth Login
- User enters handle → redirects to OAuth provider
- User authenticates → redirects back to app
- Session stored in Supabase with DID as key
- Cookie set with DID
- User sees authenticated state

### ✅ Session Persistence
- Close browser → reopen
- Still authenticated (session valid for 7 days)

### ✅ Re-Login (Same User)
- User logs in again
- Old session replaced with new one (upsert by DID)
- No duplicate sessions in database

### ❌ Multi-Device (Expected Limitation)
- User logs in on phone → Session A
- User logs in on laptop → Session A replaced with Session B
- Phone now logged out (expected behavior with 1:1 DID mapping)

---

## Future Enhancements

If multi-device support is needed in the future:

### Option 1: Move to Token-Based Auth
Instead of stateful sessions, use JWT tokens that can be validated independently on each device.

### Option 2: Extend SessionStore Interface
Create a custom session manager that tracks device IDs:

```typescript
interface MultiDeviceSessionStore {
  set(did: string, deviceId: string, session: Session): Promise<void>
  get(did: string, deviceId: string): Promise<Session | undefined>
  getAll(did: string): Promise<Session[]>
  del(did: string, deviceId: string): Promise<void>
}
```

### Option 3: Refresh Token Pattern
- Store long-lived refresh tokens per device
- Generate short-lived access tokens per request
- Multiple refresh tokens can exist per DID

---

## Monitoring

After deployment, monitor:

1. **Session creation rate:**
   ```sql
   SELECT COUNT(*), DATE_TRUNC('hour', created_at) 
   FROM oauth_sessions 
   GROUP BY DATE_TRUNC('hour', created_at)
   ORDER BY DATE_TRUNC('hour', created_at) DESC;
   ```

2. **Sessions per DID (should always be 1):**
   ```sql
   SELECT did, COUNT(*) 
   FROM oauth_sessions 
   GROUP BY did 
   HAVING COUNT(*) > 1;  -- Should return 0 rows
   ```

3. **Expired sessions (cleanup):**
   ```sql
   DELETE FROM oauth_sessions 
   WHERE expires_at < NOW();
   ```

---

## Summary

**What changed:**
- ✅ `did` is now the primary key on `oauth_sessions`
- ✅ `upsert()` properly uses `onConflict: 'did'`
- ✅ Added comprehensive logging throughout
- ✅ Added verification after session storage
- ✅ Matches Hypercerts SDK's expected behavior

**Impact:**
- ✅ OAuth login should now work reliably
- ✅ No more "session deleted by another process" errors
- ✅ Clean 1:1 DID-to-session mapping
- ⚠️ Users need to re-login after migration
- ⚠️ Multi-device not supported (last login wins)

**Next Steps:**
1. Apply database migration
2. Deploy code changes
3. Test OAuth flow
4. Monitor for any issues

---

**Status:** ✅ Ready for Testing  
**Migration Required:** Yes (database schema change)  
**Breaking Change:** Yes (all users must re-login)
