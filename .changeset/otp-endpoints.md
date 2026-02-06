---
"bumicerts": patch
---

Add OTP verification endpoints with rate limiting

## OTP Endpoints
- Add `/api/otp/request` endpoint to generate and send OTP codes via email
- Add `/api/otp/verify` endpoint to verify OTP codes
- Uses Resend for sending transactional emails

## Security Features
- Rate limiting by IP address (10 requests per hour)
- Rate limiting by email address (3 requests per 15 minutes)
- OTP codes expire after 10 minutes (configurable)
- Maximum 5 verification attempts per OTP
- Previous pending OTPs are invalidated when new one is requested
- Generic success messages to prevent email enumeration

## Rate-Limiting Library
- Add reusable rate-limiting utility at `lib/rate-limit.ts`
- Uses Supabase to track attempts in a sliding window
- Fails open if Supabase is not configured (for local dev)

## Configuration
- `RESEND_API_KEY`: Required for sending OTP emails
- `OTP_EXPIRY_MINUTES`: Optional, defaults to 10 minutes
- `OTP_MAX_ATTEMPTS`: Optional, defaults to 5 attempts

## Bug Fixes
- Fix layer editor build error by temporarily disabling layer creation/editing (SDK doesn't support `createOrUpdate` method yet)
