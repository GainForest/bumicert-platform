---
"bumicerts": minor
---

## Improved Contributor Selector

### Search & Add Contributors
- **Dual search**: Queries both ClimateAI (authenticated) and Bluesky public API simultaneously
- **DID-based storage**: Selected users are stored by their DID for reliable identification
- **Tabbed interface**: Switch between "Search Users" and "Enter Name or ID" modes

### Smart Profile Resolution
- Contributors added via search display with resolved profile info (name, handle, avatar)
- DIDs and handles are automatically resolved to show display names
- Plain text entries are shown as-is

### UI Improvements
- Inline clear button (X) in input fields
- Cleaner layout with stable React keys (no more state jumping on delete)
- 5-minute profile cache for performance

![Contributor Selector](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/contributor-selector-ui)
