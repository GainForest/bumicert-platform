---
"bumicerts": patch
---

Preserve bumicert creation draft data with localStorage backup

## Draft Data Preservation
- Add localStorage persistence to the bumicert creation form store using Zustand `persist` middleware
- Form data is automatically backed up as users make changes, with a 30-day expiry
- On hydration, falls back to localStorage backup if no database draft is found
- Clear localStorage backup after successful bumicert publication

## Unsaved Changes Warning
- Add `useUnsavedChangesWarning` hook to show the browser's native "unsaved changes" dialog
- Track dirty state in the form store to detect when changes have been made since last save
- Mark form as saved after successful draft save to clear the warning

## Cover Image Resilience
- Gracefully handle cover image load failures during draft hydration
- Show a dismissible warning banner instead of failing the entire hydration process
- Users can re-upload their cover image while all other draft data is preserved

## Other
- Add `public/audio/` to `.gitignore`
