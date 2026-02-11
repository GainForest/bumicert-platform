---
"bumicerts": patch
---

Added audio recordings management page for organizations

## New Route

- Added `/upload/organization/[did]/audio` route for managing audio recordings
- Integrated into upload platform navigation with Mic icon

## Features

- View all audio recordings in a 3-column grid layout
- Native HTML5 audio player with browser controls
- Display recording metadata (duration, sample rate, format, recorded date, coordinates)
- Create new audio recordings with file upload (supports WAV, MP3, M4A, AAC, FLAC, OGG, Opus, WebM, AIFF up to 100MB)
- Edit existing recordings (name, description, recorded date, coordinates, or replace audio file)
- Delete recordings with confirmation dialog to prevent accidental data loss
- Authorization: only organization owners can add/edit/delete recordings
- Empty state with call-to-action for owners

## Screenshots

![Audio Upload Dialog](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/audio-upload-modal-xSpjvyb2buLvWq0DNj2II6WpxwyeIt)
![Audio Upload Success](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/audio-added-3LemXMqYoY3qojhirRlT7ogjfj2HfM)