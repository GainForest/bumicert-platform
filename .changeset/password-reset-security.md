---
"bumicerts": patch
---

Add rate-limiting security to password reset endpoints

## Security Enhancements
- Add IP-based rate limiting to password reset request (10 requests per hour)
- Add email-based rate limiting to password reset request (3 requests per 15 minutes)
- Add IP-based rate limiting to password reset confirmation (5 attempts per 15 minutes)
- Return generic success messages to prevent user enumeration attacks
- Record all rate limit attempts for monitoring

## Endpoints Updated
- `POST /api/atproto/request-password-reset` - Now rate limited by IP and email
- `POST /api/atproto/reset-password` - Now rate limited by IP

## Dependencies
- Requires shared rate-limiting utility `lib/rate-limit.ts` (introduced in this PR)
