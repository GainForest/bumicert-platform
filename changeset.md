# Creating a Changeset

This file contains instructions for AI agents on how to create a changeset for the `bumicert-platform` repository.

## When to Create a Changeset

Create a changeset when you have made changes that should be documented in the changelog. This typically happens when you are preparing to merge a feature, fix, or other significant change into the `main` branch.

See also [AGENTS.md](./AGENTS.md) for broader project context.

## How to Create a Changeset

1.  **Run the Changeset Command**:
    Execute the following command in the terminal:
    ```bash
    npx changeset
    ```

2.  **Select Packages**:
    The CLI will ask you to select the packages that have changed. Since this is likely a single-package repo (Monorepo setup might vary), select `bumicertain` (or the relevant package name) by pressing `Space` to select and `Enter` to confirm.

3.  **Choose Semver Bump Type**:
    **IMPORTANT: We are in Alpha (0.x.x).**
    -   **Major**: Do NOT use. (Keep as 0).
    -   **Minor**: Represents a completed **Milestone** or **Release Cycle** (roughly monthly). Only use this when explicitly preparing a new milestone release (e.g., v0.1 -> v0.2).
    -   **Patch**: Use this for **ALL** ongoing development (features, bug fixes, refactors) within the current milestone context.

    *For almost all daily work (PRs), you will select `patch`.*

4.  **Enter Summary**:
    Provide a concise summary of the changes. This summary will appear in the changelog.
    -   For a feature: "Added [feature name] to [functionality]."
    -   For a fix: "Fixed [bug description] in [component]."
    -   Ensure the message is user-friendly and descriptive.

5.  **Review and Confirm**:
    The CLI will show you the changeset file that will be created. Confirm that it looks correct.

## Example Workflow

```bash
# 1. Run changeset
npx changeset

# 2. Select package 'bumicertain'
# 3. Select 'minor' for a new feature
# 4. Enter summary: "Added new climate data visualization component."
# 5. Confirm creation
```

## Maintenance

-   **Version Packages**:
    To update versions and changelogs based on changesets, run:
    ```bash
    npx changeset version
    ```
    (This is usually handled by CI/CD, but good to know).

-   **Publish**:
    To publish the packages:
    ```bash
    npx changeset publish
    ```
