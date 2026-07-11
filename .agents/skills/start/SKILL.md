---
name: start
description: Create the isolated implementation workspace for an approved issue. Use when the user runs /start, asks to start work in a branch or worktree, or wants a branch/worktree created from an approved plan before building.
---

# Start

Create the branch or worktree for approved work.

## Required Gate

Before creating anything, confirm there is an approved implementation plan. If no plan is approved, send the user back to `/plan`.

## Process

### 1. Read The Issue

Read:

- Issue title, body, and comments.
- Approved implementation plan.
- `docs/agents/issue-tracker.md`.
- Any start preference from the user: `branch` or `worktree`.

### 2. Choose Branch Or Worktree

Use a branch when:

- The change is small or medium.
- Only one AI run is needed.
- The work is low risk.

Use a worktree when:

- The change is large.
- The work is experimental.
- Multiple AI runs may happen in parallel.
- The implementation may be messy before it stabilizes.
- The owner wants the main checkout clean.

If the user explicitly requested branch or worktree, follow that unless it is unsafe.

### 3. Name The Workspace

Use issue type, issue number, and a short slug:

```text
feature/24-run-history
fix/31-report-rendering
refactor/42-agent-version-model
experiment/55-local-run-layout
```

### 4. Create It Safely

Inspect the current git state before changing branches. Do not overwrite or discard uncommitted work.

If the worktree is dirty, stop and ask how to proceed unless the changes are clearly unrelated and the user already approved continuing.

### 5. Comment The Start Summary

Post or provide:

```md
# Start Summary

## Issue

## Branch / Worktree

## Approved Plan

## Next Step
```

## Rules

- Never start feature work directly on `main`.
- Never use destructive git commands to make the workspace clean.
- Do not build during `/start`.
- Do not run `gh project` commands unless GitHub Project is enabled in `docs/agents/issue-tracker.md`.
- Move project status to `Building` only when GitHub Project is enabled and implementation is actually beginning.
