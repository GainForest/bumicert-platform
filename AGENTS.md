# AGENTS.md

Welcome, AI Agent! This file provides the context you need to work effectively on the **bumicert Platform**.

## Project Overview
bumicert is a platform for verifying and tracking environmental claims and certificates (Hypercerts). It leverages blockchain technology for transparency and trust.

## Tech Stack
-   **Runtime**: [Bun](https://bun.sh)
-   **Framework**: [Next.js 16](https://nextjs.org) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
-   **State Management**: Zustand, React Query
-   **GraphQL**: `gql.tada`
-   **Web3/Auth**: Privy, Wagmi, Viem
-   **Database**: Postgres

## Directory Structure
-   `/app`: Next.js App Router pages and layouts.
-   `/components`: Reusable UI components.
-   `/lib`: Utility functions and shared logic.
-   `/graphql`: GraphQL definitions and generated types.
-   `/hooks`: Custom React hooks.

## Git Worktrees
This project uses [Git Worktrees](https://git-scm.com/docs/git-worktree) to manage multiple branches simultaneously.
-   **Location**: Active worktrees are typically found in the `.worktrees/` directory.
-   **Usage**: When switching contexts or working on multiple features, check if a worktree already exists for your branch before creating a new one.
-   **Path**: Be mindful of your current working directory (`cwd`). Ensure you are running commands (like `bun run dev` or git operations) within the correct worktree directory for the task at hand.

## Workflows

### 1. Documenting Changes (Changesets)
- **Crucial**: Every PR must have **exactly one** changeset file documenting all significant changes.
- -   **Rule**: If you modify code, you must create/update a changeset. Do not create multiple changeset files for the same PR; consolidate them if needed.
- -   **Quality**: The summary must be human-readable and descriptive (e.g., "Added a new pricing page" instead of "feat: add page").
- -   **Screenshots**: If the change involves UI and you are editing the **CHANGELOG** (not the changeset), you MUST include a Vercel Blob URL to a screenshot. **Prompt the user to provide a screenshot if you cannot capture one yourself.**
-   See [changeset.md](./changeset.md) for detailed instructions on how to create a changeset.
-   **Command**: `bun run changeset`

### 2. Code Style
-   Use `eslint` for linting (`bun run lint`).
-   Format code according to project settings (Prettier is likely used via editor config).

### 3. Package Management
-   Use `bun` for installing dependencies: `bun add [package]`.

### 4. Media & Assets
-   **Do not commit images/videos to the repo.** This bloats the repository size.
-   **Use Vercel Blob**: Upload assets to Vercel Blob storage (or another external host) and link to them.
-   If you need to upload a file, write a script using `@vercel/blob` or ask the user for a token/assistance.

## Key Files for Context
-   `package.json`: Dependencies and scripts.
-   `README.md`: General human-facing documentation.
-   `changeset.md`: Specific instructions for versioning.
