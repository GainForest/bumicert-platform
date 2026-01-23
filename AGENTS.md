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

## Workflows

### 1. Documenting Changes (Changesets)
**Crucial**: Every significant change (feature, fix, refactor) must be documented using a changeset.
-   See [changeset.md](./changeset.md) for detailed instructions on how to create a changeset.
-   **Command**: `bun run changeset`

### 2. Code Style
-   Use `eslint` for linting (`bun run lint`).
-   Format code according to project settings (Prettier is likely used via editor config).

### 3. Package Management
-   Use `bun` for installing dependencies: `bun add [package]`.

## Key Files for Context
-   `package.json`: Dependencies and scripts.
-   `README.md`: General human-facing documentation.
-   `changeset.md`: Specific instructions for versioning.
