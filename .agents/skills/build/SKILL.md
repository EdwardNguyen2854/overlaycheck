---
name: build
description: Implement only the approved plan for an issue. Use when the user runs /build, asks for Build Mode, or wants an approved issue implemented in the current branch or worktree while respecting scope, ADRs, tests, and validation.
---

# Build

Implement the approved plan and stay within scope.

## Required Gate

Before editing files, confirm:

- There is an approved implementation plan.
- Work is happening in a branch or worktree, not directly on `main`.
- The intended scope matches the issue acceptance criteria.

If any gate fails, stop and ask the user how to proceed.

## Process

### 1. Load Context

Read:

- Issue body and comments.
- Approved implementation plan.
- `docs/agents/issue-tracker.md`.
- `CONTEXT.md`.
- `DOD.md`.
- Relevant ADRs.
- Relevant code and tests.

### 2. Implement In Small Steps

If GitHub Project is enabled in `docs/agents/issue-tracker.md`, move the issue to `Building` when implementation actually begins. If Project is disabled, do not use `gh project` commands.

Follow the approved steps. Prefer the smallest correct change.

When tests are appropriate, add or update them close to the changed behavior. Run targeted validation regularly instead of waiting until the end.

### 3. Handle Discoveries

If you find extra work:

- Do it only if required to satisfy the current acceptance criteria.
- Otherwise capture it as follow-up work.

If you find a necessary scope change, stop and ask before changing direction.

### 4. Validate

Run the relevant checks available in the repo, such as:

- Typecheck.
- Lint.
- Unit tests.
- Focused integration tests.
- Manual validation steps from the issue or plan.

If a check cannot run, explain why and what risk remains.

### 5. Build Summary

Post or provide:

```md
# Build Summary

## Changed

## Verified

## Problems Found

## Follow-up Needed
```

## Rules

- Do not expand scope without approval.
- Do not mix unrelated refactors into the feature.
- Do not silently change domain terms.
- Do not bypass known decisions in ADRs.
- Do not merge during `/build`.
