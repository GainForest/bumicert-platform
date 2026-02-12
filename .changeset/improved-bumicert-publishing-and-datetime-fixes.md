---
"bumicertain": minor
---

## Improved Bumicert Publishing Display

### UI/UX Enhancements
- **Redesigned success state**: Added celebratory PartyPopper icon and animation when bumicert is successfully published
- **Better button placement**: Moved the "Publish Bumicert" button inline with the final step for better visual flow
- **Improved messaging**: Clearer instructions ("Please click the button below to publish your bumicert") during the publishing step
- **Smooth animations**: Added fade-in and scale animations to the success message for a more polished feel
- **Responsive layout**: Better flexbox layout for progress items ensuring proper alignment

### Technical Improvements
- Enhanced ProgressItem component to support children elements for flexible content placement
- Improved conditional rendering logic for cleaner component structure

## Fixed Organization StartDate Validation

### Bug Fixes
- **Fixed ISO datetime format error**: Resolved validation error when saving organization info with empty startDate
- **Proper null handling**: Changed empty string initialization to `undefined` for optional date fields
- **Smart validation**: Added trim check to ensure empty strings are converted to `undefined` before API submission
- **Consistent behavior**: Applied fix across both upload and marketplace organization pages

### Impact
- Organizations can now be saved without encountering "Invalid ISO datetime" errors
- Better handling of optional date fields throughout the application
- Fixed validation error: `{ "code": "invalid_format", "format": "datetime", "path": ["info", "startDate"] }`

## Screenshots

![Publish Button now in an appropriate place.](https://ihi2erbnrb7tmrfy.public.blob.vercel-storage.com/changelog/improved-bumicert-publishing-sdj6mMrV8h0keEj2mcquMweAFZdhjZ)
