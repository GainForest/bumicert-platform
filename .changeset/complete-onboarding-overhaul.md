---
"bumicerts": major
---

# Complete Overhaul of Organization Onboarding Flow

This release introduces a comprehensive redesign of the organization onboarding experience with improved UX, new integrations, and a streamlined account creation process.

## New Multi-Step Onboarding Flow

### Step 1: Introduction
- Organization name input (required)
- Optional website URL field with client-side validation
- Real-time URL validation with error messages

### Step 2: Email Verification
- Two-phase verification flow:
  1. Enter email address and request verification code
  2. Enter received code to verify
- "I already have a code" option for returning users who received codes via other channels
- Rate limiting awareness with countdown timer
- Resend code functionality
- Change email option to go back and modify

### Step 3: Organization Details
- **BrandFetch Integration**: Auto-fill organization details from website
  - Fetches logo, description, country, and founding year
  - Manual trigger via wand icon button
  - Auto-fetches on first render if website is provided
- **Logo Upload**: Image editor modal for uploading and cropping organization logo
- **Country Selector**: Modal-based country selection with search
- **Start Date Picker**: Calendar picker for organization founding date
- **AI-Powered Description Generation**:
  - Uses Google Gemini Flash for fast, contextual short description generation
  - Considers organization name, long description, and country
  - Auto-generates after BrandFetch completes
- Long description with 50+ character minimum requirement
- Short description with AI generate button
- **Shared Validation Schema**: Client-side validation uses the same Zod schema as the server

### Step 4: Account Credentials
- Handle input with real-time availability checking
  - Debounced API calls to prevent excessive requests
  - Visual indicators: loading, available (green check), taken (red X)
- Secure password input with show/hide toggle
- Password confirmation field
- Auto-generated handle suggestion based on organization name and country

### Step 5: Account Creation
- Code of Conduct acceptance with "Agree and Create Account" button
- Explicit user action triggers account creation (no useEffect side effects)
- Combined atomic operation using GainForest SDK's `miscellaneous.onboard()` method:
  1. Validates all inputs before account creation
  2. Creates PDS account with credentials
  3. Initializes organization profile with all details
  4. Uploads logo if provided
- Loading state with animated spinner
- Error handling with retry option
- Success state with Sign In button that opens the authentication modal

## New API Endpoints

All onboarding APIs moved from `/api/atproto/onboarding/` to `/onboarding/api/` for better organization:

- `POST /onboarding/api/send-invite-email` - Send verification code to email
- `POST /onboarding/api/verify-invite-code` - Verify the received code
- `POST /onboarding/api/fetch-brand-info` - Fetch organization info from BrandFetch API
- `POST /onboarding/api/generate-short-description` - AI-generate short description using Gemini
- `POST /onboarding/api/onboard` - Combined account creation and org initialization using SDK

## Technical Improvements

- **Shared Validation Schema**: `organizationInfoSchema` exported from `app/onboarding/api/onboard/schema.ts` is used by both client (StepOrgDetails) and server (onboard API) for consistent validation
- **SDK Integration**: Uses `gainforestSdk.getServerCaller().miscellaneous.onboard()` for organization initialization, ensuring compatibility with schema changes
- **Error State Management**: Errors clear when navigating between steps, preventing stale error messages
- **Consistent URL Validation**: Same validation logic across all steps (prepends https:// if missing, checks for valid domain with dot)
- **Form State Persistence**: All form data persisted in Zustand store across steps
- **Animated Transitions**: Framer Motion animations between steps and during loading states
- **Loading Animations**: Pulsing blur effect on form during BrandFetch fetch
- **Sign In Modal Integration**: Sign in link on onboarding page opens modal instead of navigating away

## Removed Features

- Deprecated Airtable-based onboarding flow (`/api/airtable/onboarding/`)
- "Get an Invite" modal (replaced with direct link to onboarding page)
- Old mock AI description generation (replaced with real Gemini integration)

## Environment Variables Required

- `BRANDFETCH_API_KEY` - For BrandFetch API integration
- `GEMINI_API_KEY` - For Google Gemini AI description generation

## Dependencies Added

- `@google/generative-ai` - Google Gemini SDK for AI text generation
