---
"bumicerts": patch
---

Added audio recordings management page for organizations

## New Route

- Added `/upload/organization/[did]/audio` route for managing audio recordings
- Integrated into upload platform navigation with Mic icon

## Features

### Viewing & Navigation
- **Dual view modes**: Toggle between grid and list views
- **Grid view**: 3-column responsive layout with audio cards
- **List view**: Compact table-like layout for desktop, mobile-optimized with circular audio player
- **Search**: Filter recordings by name or description
- **Format filter**: Filter by audio format (MP3, WAV, FLAC, OGG, M4A, AAC)
- **URL state management**: View mode, search, filters, and edit state persist in URL for shareable links

### Audio Playback
- **Desktop**: Native HTML5 audio player with browser controls
- **Mobile**: Custom circular progress player with play/pause controls
- Display recording metadata (duration, sample rate, format, recorded date, coordinates)

### Management
- **Create**: Upload new audio recordings (supports WAV, MP3, M4A, AAC, FLAC, OGG, Opus, WebM, AIFF up to 100MB)
- **Edit**: Update name, description, recorded date, coordinates, or replace audio file
- **Delete**: Remove recordings with confirmation dialog to prevent accidental data loss
- **Authorization**: Only organization owners can add/edit/delete recordings
- **Empty states**: Contextual messages for no recordings or no search results

### UI Components
- Added `AlertDialog` component for delete confirmations
- Responsive design with mobile-first approach
- Page-based editing workflow (replaces modal-based approach)

## Screenshots

![Audio Upload Dialog](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/audio-upload-modal-xSpjvyb2buLvWq0DNj2II6WpxwyeIt)
![Audio Upload Success](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/audio-added-3LemXMqYoY3qojhirRlT7ogjfj2HfM)