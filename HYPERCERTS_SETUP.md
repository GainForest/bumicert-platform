# Hypercerts SDK Setup Guide

## ✅ What's Been Implemented

The Hypercerts SDK integration has been successfully configured with:

1. ✅ **Packages Installed**:
   - `@hypercerts-org/sdk-core@0.10.0-beta.4`
   - `@atproto/oauth-client-node@0.3.15`
   - `@hypercerts-org/lexicon@0.10.0-beta.4`
   - `jose@6.1.3` (for JWK handling)

2. ✅ **Supabase Storage Layer**:
   - `lib/hypercerts/storage/supabase-session-store.ts` - OAuth session storage
   - `lib/hypercerts/storage/supabase-state-store.ts` - OAuth state storage

3. ✅ **SDK Configuration**:
   - `lib/hypercerts/sdk.server.ts` - Hypercerts SDK initialization

4. ✅ **OAuth Endpoints**:
   - `/client-metadata.json` - OAuth client metadata
   - `/jwks.json` - JSON Web Key Set (public keys)

5. ✅ **Environment Variables**: Added to `.env.local`

6. ✅ **JWK Generation Script**: `scripts/generate-jwk.ts`

---

## 🔧 Required Setup Steps

### Step 1: Generate ATProto OAuth Private Key

You need to generate a private key for ATProto OAuth authentication.

**Run the generation script:**

```bash
bun run scripts/generate-jwk.ts
```

**Expected Output:**

```
🔑 Generating ATProto OAuth JWK (ES256)...

✅ JWK generated successfully!

Add this to your .env.local file:

ATPROTO_JWK_PRIVATE='{"kty":"EC","crv":"P-256","x":"...","y":"...","d":"...","kid":"key-1","use":"sig","alg":"ES256"}'

⚠️  IMPORTANT: Keep this key private and never commit it to git!
```

**Copy the output** and replace the placeholder in `.env.local`:

```bash
# Before (placeholder):
ATPROTO_JWK_PRIVATE="your-jwk-private-key-placeholder"

# After (actual key from script):
ATPROTO_JWK_PRIVATE='{"kty":"EC","crv":"P-256","x":"...","y":"...","d":"...","kid":"key-1","use":"sig","alg":"ES256"}'
```

---

### Step 2: Update Application URL (if needed)

The `.env.local` file has `NEXT_PUBLIC_APP_URL` set to `http://localhost:3000` for development.

**For production**, update it to your actual domain:

```bash
# Development (already set):
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Production:
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

---

### Step 3: Get Supabase Service Role Key (if needed)

The service role key is needed for admin operations. Get it from:

**Supabase Dashboard → Settings → API → service_role**

Then replace the placeholder:

```bash
# Before:
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-placeholder"

# After:
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Environment Variables Summary

All required environment variables in `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://wgdcmbgbfcaplqeavijz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Get from Supabase dashboard

# Hypercerts SDK Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Update for production
NEXT_PUBLIC_PDS_URL="https://climateai.org"
NEXT_PUBLIC_SDS_URL="https://sds.hypercerts.org"
ATPROTO_JWK_PRIVATE='{"kty":"EC",...}' # Generate using script
```

---

## 🧪 Testing the Setup

### 1. Test OAuth Metadata Endpoints

Start the dev server:

```bash
bun dev
```

Test the endpoints:

```bash
# Test client metadata
curl http://localhost:3000/client-metadata.json

# Expected output:
{
  "client_id": "http://localhost:3000/client-metadata.json",
  "client_name": "Bumicert Platform",
  ...
}

# Test JWKS endpoint
curl http://localhost:3000/jwks.json

# Expected output:
{
  "keys": [
    {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "...",
      "kid": "key-1",
      "use": "sig",
      "alg": "ES256"
    }
  ]
}
```

### 2. Test SDK Initialization

The SDK will automatically initialize when you import it:

```typescript
import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'

// The SDK is now ready to use
```

If there are missing environment variables, you'll see clear error messages.

---

## 📁 File Structure

```
bumicert-platform/
├── lib/
│   └── hypercerts/
│       ├── storage/
│       │   ├── index.ts                      ✨ Exports
│       │   ├── supabase-session-store.ts     ✨ Session storage
│       │   └── supabase-state-store.ts       ✨ State storage
│       └── sdk.server.ts                     ✨ SDK configuration
├── app/
│   ├── client-metadata.json/
│   │   └── route.ts                          ✨ OAuth client metadata
│   └── jwks.json/
│       └── route.ts                          ✨ Public keys endpoint
├── scripts/
│   └── generate-jwk.ts                       ✨ JWK generation utility
└── .env.local                                🔧 Environment variables
```

---

## 🔒 Security Notes

### Private Key Security

- ⚠️ **NEVER commit** `ATPROTO_JWK_PRIVATE` to git
- ✅ `.env.local` is already in `.gitignore`
- ✅ For production, use secure environment variable storage (Vercel Secrets, etc.)

### Key Rotation

To rotate your OAuth key:

1. Generate a new key: `bun run scripts/generate-jwk.ts`
2. Update `ATPROTO_JWK_PRIVATE` in production environment
3. Restart your application
4. Old sessions will be invalidated

---

## 🎯 Usage Examples

### Initialize SDK (Server-Side Only)

```typescript
// lib/hypercerts/sdk.server.ts
import { hypercertsSdk } from '@/lib/hypercerts/sdk.server'

// Start OAuth flow
const authUrl = await hypercertsSdk.authorize('user.bsky.social')

// Handle callback
const session = await hypercertsSdk.callback(callbackParams)

// Get repository
const repo = hypercertsSdk.repository(session, { server: 'sds' })

// Create organization
const org = await repo.organizations.create({
  name: 'My Organization',
  handlePrefix: 'my-org',
  description: 'Organization description',
})
```

### Storage Layer (Automatic)

The SDK automatically uses Supabase for storage:

- **Sessions** → Stored in `oauth_sessions` table
- **States** → Stored in `oauth_states` table (auto-expire after 10 minutes)

---

## 🚀 Next Steps

With the SDK configured, you can now:

1. **Create Auth Routes**:
   - `/api/hypercerts/auth/login` - Initiate OAuth flow
   - `/api/hypercerts/auth/callback` - Handle OAuth callback
   - `/api/hypercerts/auth/logout` - Revoke session

2. **Build Organization Features**:
   - Create organizations (UI already exists)
   - Add collaborators (need to build UI)
   - Manage permissions

3. **Repository Operations**:
   - Create hypercerts (future phase)
   - Add measurements and evaluations
   - Blob uploads

---

## ❓ Troubleshooting

### Error: "Missing ATPROTO_JWK_PRIVATE environment variable"

- Run: `bun run scripts/generate-jwk.ts`
- Copy the output to `.env.local`
- Restart the dev server

### Error: "Failed to generate JWKS"

- Verify `ATPROTO_JWK_PRIVATE` is valid JSON
- Check that it has all required fields: `kty`, `crv`, `x`, `y`, `d`, `kid`, `use`, `alg`

### OAuth Endpoints Return 500

- Check all environment variables are set
- Restart the dev server after changing `.env.local`
- Verify no syntax errors in the `.env.local` file

### Supabase Storage Errors

- Verify `oauth_sessions` and `oauth_states` tables exist
- Check RLS policies allow access
- Verify Supabase credentials are correct

---

## 📚 Additional Resources

- [Hypercerts SDK Documentation](https://github.com/hypercerts-org/hypercerts-sdk)
- [ATProto OAuth Spec](https://atproto.com/specs/oauth)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✨ Summary

The Hypercerts SDK is now fully configured and ready to use! The implementation:

- ✅ Uses Supabase for session/state storage
- ✅ Provides OAuth metadata endpoints
- ✅ Includes JWK generation utility
- ✅ Follows ATProto OAuth standards
- ✅ Ready for organization and collaborator features

Complete the setup steps above, and you'll be ready to start building organization features! 🎉
