# Organizations & Collaborators Feature Guide

This guide explains how to use the organization creation and collaborator management features powered by the Hypercerts SDK.

## Overview

The Hypercerts SDK integration enables:
- **Organization Creation**: Create decentralized organizations on the SDS (Shared Data Server)
- **Collaborator Management**: Add, remove, and manage collaborators with role-based permissions
- **ATProto Authentication**: Secure authentication using ATProto OAuth

## Architecture

### Data Flow

```
User → OAuth Login → Hypercerts SDK → SDS Server → Organization/Collaborator Data
                    ↓
              Supabase Storage (Sessions)
```

### Key Components

1. **Server Actions** (`lib/hypercerts/actions.ts`):
   - Organization CRUD operations
   - Collaborator management
   - Role-based access control

2. **UI Components** (`app/(marketplace)/organization/[did]/_components/`):
   - `CollaboratorsManager.tsx` - Main container component
   - `CollaboratorsSection.tsx` - Display collaborators list
   - `AddCollaboratorForm.tsx` - Add new collaborators

3. **Repository Context** (`lib/hypercerts/repo-context.ts`):
   - Manages authenticated repository access
   - Handles PDS vs SDS routing
   - Scopes operations to specific DIDs

---

## User Guide

### 1. Authentication

Before using organization features, you must authenticate:

1. Visit the testing page: `/testing/hypercerts-auth-test`
2. Enter your ATProto handle (e.g., `user.bsky.social`)
3. Complete the OAuth flow
4. Your session is stored in Supabase

### 2. Creating an Organization

```typescript
import { createOrganization } from '@/lib/hypercerts/actions'

const result = await createOrganization({
  handlePrefix: 'my-org',        // Organization handle (without domain)
  name: 'My Organization',        // Display name
  description: 'About my org',    // Optional description
})

// Result contains the new organization's DID and metadata
console.log(result.data.did)
```

**Organization Handle Format**:
- Input: `my-org`
- Full handle: `my-org.sds.hypercerts.org`
- DID: `did:plc:abc123...`

### 3. Viewing Organization Details

```typescript
import { getOrganization } from '@/lib/hypercerts/actions'

const result = await getOrganization('did:plc:abc123...')

console.log(result.data.name)
console.log(result.data.collaboratorCount)
```

### 4. Listing Your Organizations

```typescript
import { listMyOrganizations } from '@/lib/hypercerts/actions'

const result = await listMyOrganizations()

result.data.organizations.forEach(org => {
  console.log(`${org.name} - ${org.accessType}`)
})
```

### 5. Managing Collaborators

#### Adding a Collaborator

```typescript
import { grantCollaborator } from '@/lib/hypercerts/actions'

await grantCollaborator({
  orgDid: 'did:plc:org123...',
  userDid: 'did:plc:user456...',
  role: 'editor',  // 'viewer' | 'editor' | 'admin' | 'owner'
})
```

#### Listing Collaborators

```typescript
import { listCollaborators } from '@/lib/hypercerts/actions'

const result = await listCollaborators('did:plc:org123...')

result.data.collaborators.forEach(collab => {
  console.log(`${collab.userDid} - ${collab.role}`)
})
```

#### Removing a Collaborator

```typescript
import { revokeCollaborator } from '@/lib/hypercerts/actions'

await revokeCollaborator('did:plc:org123...', 'did:plc:user456...')
```

#### Changing a Collaborator's Role

```typescript
import { updateCollaboratorRole } from '@/lib/hypercerts/actions'

await updateCollaboratorRole(
  'did:plc:org123...',  // Organization DID
  'did:plc:user456...', // User DID
  'admin'               // New role
)
```

---

## Role-Based Permissions

### Roles

| Role | Permissions |
|------|------------|
| **owner** | Full control, can transfer ownership |
| **admin** | Manage collaborators, edit organization |
| **editor** | Edit organization data |
| **viewer** | Read-only access |

### Permission Matrix

| Action | Viewer | Editor | Admin | Owner |
|--------|--------|--------|-------|-------|
| View organization | ✅ | ✅ | ✅ | ✅ |
| Edit organization | ❌ | ✅ | ✅ | ✅ |
| Add collaborators | ❌ | ❌ | ✅ | ✅ |
| Remove collaborators | ❌ | ❌ | ✅ | ✅ |
| Change roles | ❌ | ❌ | ✅ | ✅ |
| Transfer ownership | ❌ | ❌ | ❌ | ✅ |

---

## UI Components Usage

### CollaboratorsManager

The main component that combines add and list functionality:

```tsx
import { CollaboratorsManager } from '@/app/(marketplace)/organization/[did]/_components/CollaboratorsManager'

export default function OrganizationPage({ did, isOwner }) {
  return (
    <div>
      <h1>Organization</h1>
      <CollaboratorsManager orgDid={did} isOwner={isOwner} />
    </div>
  )
}
```

**Props**:
- `orgDid` (string): Organization DID
- `isOwner` (boolean): Whether current user is owner (shows add form)

### CollaboratorsSection

Display-only collaborators list:

```tsx
import { CollaboratorsSection } from '@/app/(marketplace)/organization/[did]/_components/CollaboratorsSection'

<CollaboratorsSection orgDid={did} isOwner={isOwner} />
```

**Features**:
- Displays all collaborators with avatars
- Shows roles with color-coded badges
- Owner/admin can change roles via dropdown
- Owner/admin can remove collaborators
- Auto-refreshes after changes

### AddCollaboratorForm

Form to add new collaborators:

```tsx
import { AddCollaboratorForm } from '@/app/(marketplace)/organization/[did]/_components/AddCollaboratorForm'

<AddCollaboratorForm 
  orgDid={did} 
  onSuccess={() => console.log('Collaborator added!')} 
/>
```

**Features**:
- DID input with validation
- Role selector with descriptions
- Error handling
- Success callback for refresh

---

## Integration Example

Here's how the organization page integrates collaborators:

```tsx
// app/(marketplace)/organization/[did]/page.tsx
import { getHypercertsRepoContext } from "@/lib/hypercerts/repo-context"
import { CollaboratorsManager } from "./_components/CollaboratorsManager"

export default async function OrganizationPage({ params }) {
  const { did } = await params
  
  // Check authentication
  const hypercertsContext = await getHypercertsRepoContext()
  const isAuthenticated = hypercertsContext !== null
  const isOwner = hypercertsContext?.userDid === did

  return (
    <Container>
      <h1>Organization</h1>
      
      {/* Other organization content */}
      
      {isAuthenticated && (
        <CollaboratorsManager orgDid={did} isOwner={isOwner} />
      )}
    </Container>
  )
}
```

---

## Server Actions Reference

### createOrganization(params)

Creates a new organization on SDS.

**Parameters**:
```typescript
{
  handlePrefix: string  // Organization handle without domain
  name: string         // Display name
  description?: string // Optional description
}
```

**Returns**:
```typescript
{
  success: true,
  data: {
    did: string
    handle: string
    name: string
    description?: string
    createdAt: string
    accessType: 'owner'
    // ... more fields
  }
}
```

**Errors**:
- `Not authenticated` - User not logged in
- `Handle already exists` - Handle taken
- SDK errors (network, server, etc.)

---

### getOrganization(did)

Retrieves organization details.

**Parameters**:
- `did` (string): Organization DID

**Returns**: Organization info or null if not found

---

### listMyOrganizations()

Lists all organizations the user has access to.

**Returns**:
```typescript
{
  success: true,
  data: {
    organizations: OrganizationInfo[]
    cursor?: string  // For pagination
  }
}
```

---

### grantCollaborator(params)

Adds a collaborator with specified role.

**Parameters**:
```typescript
{
  orgDid: string
  userDid: string
  role: 'viewer' | 'editor' | 'admin' | 'owner'
}
```

**Errors**:
- `Not authenticated`
- `Insufficient permissions` - Only admin/owner can add
- `User already has access`

---

### revokeCollaborator(orgDid, userDid)

Removes a collaborator's access.

**Parameters**:
- `orgDid` (string): Organization DID
- `userDid` (string): User DID to revoke

**Errors**:
- `Not authenticated`
- `Insufficient permissions`
- `Cannot revoke owner` - Must transfer ownership first

---

### listCollaborators(orgDid)

Lists all collaborators for an organization.

**Parameters**:
- `orgDid` (string): Organization DID

**Returns**:
```typescript
{
  success: true,
  data: {
    collaborators: Array<{
      userDid: string
      role: CollaboratorRole
      grantedAt: string
      grantedBy: string
    }>
    cursor?: string
  }
}
```

---

### updateCollaboratorRole(orgDid, userDid, role)

Changes a collaborator's role.

**Parameters**:
- `orgDid` (string): Organization DID
- `userDid` (string): User DID
- `role` (CollaboratorRole): New role

**Implementation**: Revokes then re-grants with new role

**Errors**:
- `Not authenticated`
- `Insufficient permissions`
- `Cannot change owner role`

---

## Testing

### Test OAuth Flow

1. Start dev server:
   ```bash
   cd bumicert-platform
   bun dev
   ```

2. Visit: `http://localhost:3000/testing/hypercerts-auth-test`

3. Login with your ATProto handle

4. Session stored in Supabase `oauth_sessions` table

### Test Organization Creation

Use the testing page or create a custom test:

```typescript
// In a Server Component or Server Action
import { createOrganization } from '@/lib/hypercerts/actions'

const org = await createOrganization({
  handlePrefix: 'test-org',
  name: 'Test Organization',
})

console.log('Created:', org.data.did)
```

### Test Collaborator Management

1. Create an organization
2. Navigate to: `/organization/[your-org-did]`
3. Use the "Add Collaborator" form
4. Enter another user's DID
5. Verify collaborator appears in list

---

## Troubleshooting

### "Not authenticated" Error

**Cause**: No active session or expired session

**Fix**:
1. Visit `/testing/hypercerts-auth-test`
2. Login again
3. Check Supabase `oauth_sessions` table

### "Insufficient permissions" Error

**Cause**: User doesn't have required role

**Fix**:
- Ensure you're the owner/admin
- Check your role with `listCollaborators()`

### Collaborators not loading

**Cause**: Network error or wrong DID

**Fix**:
1. Check browser console for errors
2. Verify organization DID is correct
3. Check network tab for failed requests

### Cannot add collaborator

**Possible causes**:
1. Invalid DID format
2. User doesn't exist
3. User already has access
4. You don't have admin/owner role

**Fix**:
- Verify DID format: `did:plc:...`
- Check user exists on ATProto network
- Use `listCollaborators()` to check existing access

---

## Technical Notes

### PDS vs SDS Routing

The `getHypercertsRepoContext()` function automatically routes to the correct server:

- **PDS** (Personal Data Server): Individual user data
  - Used when `targetDid === userDid`
  - Server: `https://climateai.org`

- **SDS** (Shared Data Server): Organizations & collaboration
  - Used when `targetDid !== userDid` or `serverOverride: 'sds'`
  - Server: `https://sds.hypercerts.org`

### Session Storage

Sessions are stored in Supabase using the **admin client (service role key)** to bypass RLS.

**Database Schema:**
```sql
CREATE TABLE oauth_sessions (
  did TEXT PRIMARY KEY,
  session_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enabled but no policies (admin client bypasses)
ALTER TABLE oauth_sessions ENABLE ROW LEVEL SECURITY;
```

**Session Data includes**:
- Access tokens
- Refresh tokens
- DID document
- Expiration times

**Why Service Role Key?**
- Simpler than managing RLS policies
- Session storage is trusted server-side code only
- `server-only` import prevents client-side usage
- RLS enabled as safety net

### Security Considerations

1. **httpOnly Cookies**: DID stored in httpOnly cookie (XSS protection)
2. **Server-only Sessions**: Full session in Supabase (not exposed to client)
3. **Service Role Key**: Used only in `lib/supabase/admin.ts` with `server-only` protection
4. **RLS Bypass**: Session/state stores use admin client to bypass RLS
5. **Role Validation**: All actions validate permissions server-side
6. **HTTPS Only**: OAuth requires HTTPS in production

**Admin Client Protection:**
```typescript
// lib/supabase/admin.ts
import 'server-only'  // ← Prevents client-side bundling

export function createAdminClient() {
  // Uses SUPABASE_SERVICE_ROLE_KEY
  // Bypasses all RLS policies
}
```

**Testing Admin Client:**
Visit `/testing/supabase-admin-test` to verify service role key configuration and RLS bypass.

---

## Next Steps

### Planned Features

- [ ] Organization profile editing
- [ ] Transfer ownership UI
- [ ] Batch collaborator operations
- [ ] Activity logs
- [ ] Email notifications
- [ ] Search collaborators by handle (not just DID)

### API Improvements

- [ ] Pagination support for large lists
- [ ] Filtering collaborators by role
- [ ] Organization settings/metadata
- [ ] Webhooks for collaborator changes

---

## Related Documentation

- [HYPERCERTS_SETUP.md](./HYPERCERTS_SETUP.md) - SDK setup guide
- [OAUTH_TESTING_COMPLETE.md](./OAUTH_TESTING_COMPLETE.md) - OAuth testing
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Supabase setup
- [Hypercerts SDK Docs](https://github.com/hypercerts-org/hypercerts-sdk) - Official docs

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check Supabase logs
4. Verify environment variables in `.env.local`
5. Test OAuth flow at `/testing/hypercerts-auth-test`

## File Reference

**Server Actions**:
- `lib/hypercerts/actions.ts` - All server actions

**Components**:
- `app/(marketplace)/organization/[did]/_components/CollaboratorsManager.tsx` - Main container
- `app/(marketplace)/organization/[did]/_components/CollaboratorsSection.tsx` - List view
- `app/(marketplace)/organization/[did]/_components/AddCollaboratorForm.tsx` - Add form

**Utilities**:
- `lib/hypercerts/repo-context.ts` - Repository context helper
- `lib/hypercerts/sdk.server.ts` - SDK configuration

**OAuth Routes**:
- `app/api/hypercerts/auth/login/route.ts` - Login endpoint
- `app/api/hypercerts/auth/callback/route.ts` - OAuth callback
