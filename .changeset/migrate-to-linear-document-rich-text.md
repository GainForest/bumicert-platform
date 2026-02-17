---
"ecocertain-2": minor
---

Migrate rich text rendering and editing to use correct libraries for each content type.

**Richtext fields** (`app.bsky.richtext.facet` — text + mentions/links/hashtags):
- Bumicert description editor now uses `bsky-richtext-react` RichTextEditor (was incorrectly using `leaflet-parser`)
- Bumicert description display now uses `bsky-richtext-react` RichTextDisplay (was incorrectly using `leaflet-parser`)
- Organization short description now uses `bsky-richtext-react` for editing and display with full facet preservation (mentions, links, hashtags) via `toRichTextRecord()` converter
- Organization listing cards now display short descriptions with rich formatting
- Bumicert review step (Step4) now shows formatted description preview
- Fixed UploadLogoModal stripping short description facets on save

**Linear Document fields** (`pub.leaflet.pages.linearDocument` — block-based documents):
- Project cards now render descriptions using `leaflet-parser` LinearDocument component (was extracting lossy plaintext)
- Organization long description continues to use `leaflet-parser` correctly (no change)
