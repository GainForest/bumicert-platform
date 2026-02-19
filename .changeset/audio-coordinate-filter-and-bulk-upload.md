---
"bumicerts": minor
---

Added coordinate-based location filter and batch audio upload to the audio recordings page

## Location Filter

- Added a "Location" filter button to the audio recordings toolbar, between the search input and the view toggle
- Clicking the button opens an expandable panel with latitude and longitude inputs and a precision selector
- Precision levels: Exact, Nearby, Area, and Region — letting users control how close a recording must be to the entered coordinates
- Active filter is indicated by a badge showing the current precision level
- Filter state persists in the URL so it can be shared or bookmarked
- A clear button resets all location filter state at once

## Batch Audio Upload

- Upgraded the audio upload form to accept up to 10 audio files at once
- Recording names and dates are automatically detected from each file's metadata, saving manual entry
- Files are uploaded one at a time with a progress indicator showing which file is currently uploading
- A cancel button lets users stop the upload after the current file finishes
- After cancellation, a summary shows how many recordings were uploaded and how many were skipped
- If an error occurs mid-upload, the form reports how many recordings were successfully saved before the error
