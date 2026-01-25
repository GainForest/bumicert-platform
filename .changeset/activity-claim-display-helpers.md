---
"bumicerts": patch
---

Added forward-compatible display helpers for activity claim schema migration. Created `getWorkScopeDisplayLabels()` utility that handles both current `workScope.withinAnyOf[]` format and upcoming union type format from hypercerts-lexicon develop branch. Updated `BumicertCard`, `Hero`, and `BumicertsClient` components to use the new helper.
