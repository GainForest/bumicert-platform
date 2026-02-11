---
name: writing-changesets
description:
  Create changeset files to document user-facing changes in PRs. Use when adding features, fixing bugs, changing UI,
  adding pages/routes, modifying API endpoints, or any change that affects the application's behavior or appearance.
---

# Writing Changesets

Create a changeset file to document changes for the changelog before merging a PR.

## When to Use

Add a changeset for any PR that includes a meaningful change:

- Adding new pages or routes
- Adding or modifying UI components
- Adding or changing API routes (`/api/...`)
- Adding or modifying React hooks
- Changing application behavior or user flows
- Bug fixes that affect user-facing behavior
- Adding integrations (analytics, third-party services, etc.)
- Database schema changes
- Authentication or authorization changes
- Styling changes that meaningfully alter the UI

Skip changesets for internal-only changes that don't affect the app's behavior or appearance:

- Updating `AGENTS.md` or other developer documentation
- Refactoring with no behavior change
- Build/CI configuration changes
- Dependency bumps with no user-facing impact
- Adding or updating tests only

## Package

This is a single-package app. The package name is:

- `bumicerts`

**Important**: Always use `"bumicerts"` in the changeset frontmatter. Do not use any other name (e.g., `bumicertain` is
an old name that should not be used).

## Versioning Rules (Alpha 0.x.x)

The app is currently in alpha (`0.x.y`). Versioning rules during alpha:

- **`patch`** — Use for **all daily work**: features, bug fixes, refactors, UI changes. This is the default for nearly
  every PR.
- **`minor`** — Use **only** for completed milestones or release cycles (roughly monthly, e.g., `v0.1.x` -> `v0.2.0`).
  Only use when explicitly preparing a milestone release.
- **`major`** — Do **not** use. The major version stays at `0` during alpha.

**When in doubt, use `patch`.**

## Format

Create a Markdown file in `.changeset/` with a **descriptive kebab-case name** (e.g., `add-password-reset.md`,
`fix-login-redirect.md`, `add-metrics-dashboard.md`).

```markdown
---
"bumicerts": patch
---

Added password reset functionality for Atproto PDS accounts
```

### Frontmatter

The frontmatter must contain exactly one field:

- **Key**: `"bumicerts"` (quoted)
- **Value**: `patch` (or `minor` for milestone releases only)

### Description

Write a clear, human-readable summary after the frontmatter. Follow these guidelines:

- Use past tense ("Added...", "Fixed...", "Updated...")
- Be descriptive — prefer "Added new climate data visualization component" over "feat: add component"
- For small changes, a single line is sufficient
- For larger changes, use sections with headers to organize the description

## One Changeset Per PR

**Every PR must have exactly one changeset file.** If your PR touches multiple areas, consolidate everything into a
single changeset with a multi-section description. Do not create multiple changeset files for the same PR.

If a changeset file already exists for your PR branch, update it rather than creating a new one.

## Examples

**Simple feature (single line):**

```markdown
---
"bumicerts": patch
---

Display the actual app version from package.json in the navigation footer instead of a hardcoded value
```

**Simple bug fix:**

```markdown
---
"bumicerts": patch
---

Fixed login redirect failing when session token expires during page navigation
```

**New page or route:**

```markdown
---
"bumicerts": patch
---

Added internal directory page at `/internal/` for navigating admin tools
```

**Larger feature (multi-section):**

```markdown
---
"bumicerts": patch
---

Added password reset functionality for Atproto PDS accounts

## Password Reset Flow

- Users can now reset their password via email
- Added "Forgot Password?" link in the sign-in modal
- PDS sends a reset code via email that users enter in the app

## New API Endpoints

- `POST /api/atproto/request-password-reset` - Initiates password reset
- `POST /api/atproto/reset-password` - Completes password reset with code and new password

## New Components

- `/reset-password` - Standalone page for password reset
- New "Forgot Password" modal with multi-step flow
```

**Multi-area PR (consolidated):**

```markdown
---
"bumicerts": patch
---

Add analytics tracking and draft management for Bumicert creation

## Analytics Integration

- Integrate Hotjar for session recording and heatmaps
- Add Supabase-backed event tracking for custom analytics

## Draft Management

- Add draft save/resume functionality for Bumicert creation
- Track draft save and resume analytics

## Additional

- Add feedback modal after successful Bumicert creation
```

**Milestone release (rare):**

```markdown
---
"bumicerts": minor
---

Release v0.2.0 — Organization profiles, Bumicert application flow, and homepage redesign
```

## Creating the Changeset

You can either:

1. **Manually create the file** — Write the `.md` file directly in `.changeset/` following the format above.
2. **Use the CLI** — Run `bun run changeset`, select `bumicerts`, choose `patch`, and enter the summary.

Both approaches produce the same result. Manually creating the file is often faster for agents.

## Key Rules

1. **One changeset per PR** — consolidate, never duplicate.
2. **Use `patch`** for all daily work. Only use `minor` for milestone releases.
3. **Package name is `bumicerts`** — always quoted in frontmatter.
4. **Descriptive file names** — use kebab-case that reflects the change (e.g., `add-password-reset.md`).
5. **Human-readable summaries** — write for humans, not commit logs.
6. **No changeset for internal-only changes** — skip for docs, tests, CI, refactors with no behavior change.

## Key Files

- `.changeset/config.json` — Changeset configuration
- `.changeset/` — Existing changeset files for reference
- `changeset.md` — Legacy instructions (this skill supersedes it)
- `package.json` — App version (`"bumicerts"`)
- `CHANGELOG.md` — Generated changelog (do not edit manually except to add screenshot URLs)
