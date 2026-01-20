# Testing Directory

This directory contains test pages for verifying integrations and functionality during development.

## Supabase Integration Tests

### Server Client Test
**Path:** `/testing/supabase-server-test`

Tests the Supabase server-side client (`lib/supabase/server.ts`) by:
- Querying the `oauth_sessions` table
- Verifying server component can access Supabase
- Displaying connection status and session count

### Client Component Test
**Path:** `/testing/supabase-client-test`

Tests the Supabase client-side client (`lib/supabase/client.ts`) by:
- Counting rows in the `oauth_sessions` table
- Verifying browser-based components can access Supabase
- Displaying connection status and session count

## Running Tests

1. Start the development server:
   ```bash
   bun dev
   ```

2. Navigate to test pages:
   - Server test: http://localhost:3000/testing/supabase-server-test
   - Client test: http://localhost:3000/testing/supabase-client-test

3. Verify both tests show successful connections

## Expected Results

Both test pages should show:
- ✓ Green success message
- Session count (0 if tables are empty, which is normal initially)
- No error messages

If tests fail, check:
1. `.env.local` has correct Supabase credentials
2. Supabase tables (`oauth_sessions`, `oauth_states`) exist
3. Network connectivity to Supabase

## Cleanup

After successful testing, these test pages can be:
- Kept for future reference
- Deleted if no longer needed
- Disabled in production builds via environment checks
