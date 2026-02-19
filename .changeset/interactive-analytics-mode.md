---
"bumicertain": patch
---

Add interactive analytics dashboard mode

## Interactive Mode
- Add new interactive presentation mode for the analytics dashboard at `/internal/analytics/interactive`
- Animated card-based navigation with keyboard controls (arrow keys, spacebar)
- Visual transitions between different metric views
- Background music support with mute/unmute controls

## UI Components
- CardWelcome: Introduction screen with animated title
- CardSummary: Overview of key metrics with animated counters
- CardFlowStarts: Total flow starts visualization
- CardCompletionRate: Completion rate with progress indicator
- CardTimeMetrics: Average and median completion times
- CardTimeDistribution: Histogram of completion times
- CardFunnelAnalysis: Step-by-step funnel visualization
- CardDraftAnalytics: Draft save and resume metrics

## Navigation
- Add "Enter Interactive Mode" button on the main analytics page
- Keyboard navigation: Left/Right arrows, Spacebar for next
- Escape key to exit back to main dashboard

## Bug Fixes
- Fix layer editor build error: Temporarily disable layer creation/editing as the SDK doesn't support the `createOrUpdate` method yet
- Add "Coming soon" message in the layer editor modal
