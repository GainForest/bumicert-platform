---
"bumicertain": minor
---

Add Bumicerts metrics dashboard with dual analytics tracking

## Analytics Integration
- Integrate Hotjar/Contentsquare for session recording and heatmaps
- Add Supabase-backed event tracking for custom analytics
- Dual tracking: events sent to both Hotjar and Supabase simultaneously

## Metrics Dashboard
- Add internal analytics dashboard at `/internal/analytics`
- Track task completion rate, time to complete, and drop-off points
- Visualize conversion funnel and time distribution
- Real-time data fetched from `/api/analytics/stats`

## Draft Management
- Add draft save/resume functionality for Bumicert creation
- Track draft save and resume analytics
- Add delete draft modal with confirmation

## Additional Features
- Add feedback modal after successful Bumicert creation
- Add AWS S3 image upload for cover images
