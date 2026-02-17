---
"bumicerts": patch
---

Fixed authentication UI to display environment-specific wording and handle invalid profile handles

## Changes

- Sign-in modal now displays "GainforestId" in production and "ClimateAI" in other environments
- Profile modal properly handles cases where user handle is `'handle.invalid'`
- AtprotoProvider falls back to session cookie handle when profile returns invalid handle
