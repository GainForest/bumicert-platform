---
"bumicertain": patch
---

Added password reset functionality for Atproto PDS accounts

## Password Reset Flow
- Users can now reset their password via email
- Added "Forgot Password?" link in the sign-in modal
- PDS sends a reset code via email that users enter in the app

## New API Endpoints
- `POST /api/atproto/request-password-reset` - Initiates password reset (sends email with code)
- `POST /api/atproto/reset-password` - Completes password reset with code and new password

## New Pages & Components
- `/reset-password` - Standalone page for password reset (supports both email entry and code entry)
- New "Forgot Password" modal with multi-step flow:
  1. Enter email to receive reset code
  2. Enter code from email + new password
  3. Success confirmation
