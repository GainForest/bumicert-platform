# 🚀 Quick Start Guide - Hypercerts SDK Integration

## ⚡ TL;DR - Get Started in 3 Steps

### Step 1: Generate OAuth Key (Required)

```bash
bun run scripts/generate-jwk.ts
```

Copy the output and add it to `.env.local`:

```bash
ATPROTO_JWK_PRIVATE='{"kty":"EC",...paste-here...}'
```

### Step 2: Start Dev Server

```bash
bun dev
```

### Step 3: Test Everything Works

Visit these URLs:

- **OAuth Metadata**: http://localhost:3000/client-metadata.json
- **JWKS Endpoint**: http://localhost:3000/jwks.json
- **Supabase Test (Server)**: http://localhost:3000/testing/supabase-server-test
- **Supabase Test (Client)**: http://localhost:3000/testing/supabase-client-test

**Expected Results**: All endpoints should return JSON without errors ✅

---

## 📋 What's Been Set Up

✅ **Supabase Integration**
- Client utilities for browser and server
- Session management via proxy
- OAuth storage tables configured

✅ **Hypercerts SDK**
- SDK initialized with Supabase storage
- OAuth endpoints configured
- Environment variables added

---

## 🔧 Environment Variables Checklist

Open `.env.local` and verify these are set:

```bash
# ✅ Already configured
NEXT_PUBLIC_SUPABASE_URL="https://wgdcmbgbfcaplqeavijz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_PDS_URL="https://climateai.org"
NEXT_PUBLIC_SDS_URL="https://sds.hypercerts.org"

# ⚠️ TODO: Generate and add (see Step 1 above)
ATPROTO_JWK_PRIVATE="your-jwk-private-key-placeholder"

# 🔒 Optional: Get from Supabase Dashboard if needed
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-placeholder"
```

---

## 🧪 Verify Installation

### 1. Check Packages Installed

```bash
grep -E "@hypercerts-org|@atproto|@supabase|jose" package.json
```

Should show:
```json
"@hypercerts-org/sdk-core": "^0.10.0-beta.4",
"@atproto/oauth-client-node": "^0.3.15",
"@supabase/supabase-js": "^2.90.1",
"@supabase/ssr": "^0.8.0",
"jose": "^6.1.3"
```

### 2. Check Files Created

```bash
# Hypercerts SDK files
ls lib/hypercerts/
# Should show: sdk.server.ts, storage/

# OAuth endpoints
ls app/client-metadata.json/ app/jwks.json/
# Should show: route.ts in each

# Supabase utilities
ls lib/supabase/
# Should show: client.ts, server.ts, proxy.ts
```

### 3. Test OAuth Endpoints

```bash
# Test client metadata (should work without JWK)
curl -s http://localhost:3000/client-metadata.json | jq .client_name
# Expected: "Bumicert Platform"

# Test JWKS (requires JWK to be generated)
curl -s http://localhost:3000/jwks.json | jq .keys[0].kid
# Expected: "key-1"
```

---

## 🎯 Using the SDK

### Import the SDK (Server-Side Only)

```typescript
import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'
```

### Use Supabase Client

```typescript
// In Server Components/Actions
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// In Client Components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

---

## 📚 Full Documentation

For detailed information, see:

- **[HYPERCERTS_SETUP.md](./HYPERCERTS_SETUP.md)** - Complete setup guide
- **[HYPERCERTS_INTEGRATION_SUMMARY.md](./HYPERCERTS_INTEGRATION_SUMMARY.md)** - Full implementation details
- **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - Supabase setup details

---

## ❓ Troubleshooting

### "Missing ATPROTO_JWK_PRIVATE environment variable"

→ Run `bun run scripts/generate-jwk.ts` and add output to `.env.local`

### OAuth endpoints return 500

→ Verify all environment variables are set correctly
→ Restart dev server: `bun dev`

### Supabase tests fail

→ Check `oauth_sessions` and `oauth_states` tables exist in Supabase
→ Verify RLS policies are configured

---

## 🚀 What's Next?

You're now ready to build:

1. **Auth Routes** - `/api/hypercerts/auth/login`, `/callback`, `/logout`
2. **Organization Features** - Create and manage organizations
3. **Collaborator Management** - Add/remove team members
4. **Repository Operations** - Hypercerts, measurements, evaluations

**Need help?** Check the full documentation linked above or review the integration summary.

---

## ✨ Summary

**Status**: 🎉 Ready to use!

**Action Required**: Generate JWK key (see Step 1 above)

**Next Phase**: Build authentication routes → organization features → collaborators

Happy coding! 🚀
