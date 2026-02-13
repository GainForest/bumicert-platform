---
"bumicerts": patch
---

Added onboarding invite email endpoint with Resend plus PDS defaults and invite lookups keyed by pds_domain. Includes rate limiting (1 email per address per 5 minutes) to prevent abuse using the existing rate_limits table
