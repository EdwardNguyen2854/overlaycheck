---
name: ship
description: Merge completed work and close the issue-first development loop. Use when the user runs /ship, asks to merge approved work, close an issue, update the changelog, or mark a reviewed branch/worktree as shipped.
---

# Ship

Merge completed work and close the loop.

## Required Gates

Before shipping, confirm:

- Review passed.
- Acceptance criteria are met.
- No known blocking bugs remain.
- Work is on the correct branch or worktree.
- The target branch is ready to receive the merge.
- `CHANGELOG.md` is updated if user-facing behavior changed.
- Follow-up work is captured as issues.

If any gate fails, stop and explain what is missing.

## Process

### 1. Inspect State

Inspect:

- Current branch/worktree.
- Git status.
- Diff against the target branch.
- Recent commits if commits already exist.
- Issue status and review result.
- `docs/agents/issue-tracker.md`.

Do not use destructive git commands.

### 2. Update Release Records

If the change affects users, update `CHANGELOG.md` under the current unreleased version.

Capture follow-up work as GitHub Issues before closing the current issue.

### 3. Merge Or Prepare To Merge

If the user explicitly asked you to merge locally, perform the merge using non-interactive git commands.

If the repo uses pull requests, create or update the PR when requested and include the review status and validation summary.

Do not push unless the user explicitly requested a push or PR creation.

### 4. Close The Loop

Post or provide:

```md
# Ship Summary

## Merged

## User-facing Changes

## Validation

## Changelog Updated

## Follow-up Issues

## Closed
```

If GitHub Project is enabled in `docs/agents/issue-tracker.md`, move project status to `Shipped` only when the work is truly complete. If GitHub Milestones are enabled, closing the issue should update milestone progress. Do not use Project or milestone commands when those settings are disabled.

## Rules

- Do not ship if review says `Safe to merge: No`.
- Do not hide failing checks.
- Do not merge unrelated changes.
- Do not force-push or rewrite history unless the user explicitly approves.
