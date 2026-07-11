---
name: plan
description: Create an implementation plan for an issue or proposed change without writing code. Use when the user runs /plan, says to plan before coding, asks for Plan Mode, or wants an approved implementation plan posted to an issue before work starts.
---

# Plan

Create an implementation plan without modifying code.

## Required Behavior

Read the issue, project docs, decisions, and relevant code. Then produce a focused implementation plan and wait for approval.

## Process

### 1. Load Context

Read:

- The GitHub Issue and comments.
- `VISION.md`.
- `CONTEXT.md`.
- `DOD.md`.
- `docs/agents/issue-tracker.md`.
- Current release spec under `docs/specs/`.
- Relevant ADRs under `docs/adr/`.
- Relevant source files and tests.

### 2. Check The Scope

Confirm:

- What problem the issue is solving.
- Which acceptance criteria must be met.
- Which domain terms apply.
- Whether any ADR constrains the solution.
- Whether there are blockers or decisions needed.

If scope is unclear, ask concise questions instead of guessing.

### 3. Write The Plan

Post or provide this structure:

```md
# Implementation Plan

## Understanding

## Affected Areas

## Proposed Steps

## Risks

## Open Questions

## Validation Plan
```

Keep proposed steps small enough that Build Mode can follow them without inventing major design decisions.

### 4. Update Workflow State

If GitHub Project is enabled in `docs/agents/issue-tracker.md`:

- Move the issue to `Planning` while planning.
- Move the issue to `Ready for Build` only after the owner approves the plan.

If GitHub Project is disabled, leave workflow state in issue comments. If Project is enabled but owner, number, or status field is missing, ask before trying to update Project state.

### 5. Stop

Stop after the plan. Do not create a branch, edit files, or implement until the user approves.

## Rules

- Do not modify code during `/plan`.
- Do not expand scope beyond the issue.
- Surface conflicts with ADRs instead of working around them.
- Capture follow-up work separately.
- Approval must be explicit before building.

Accepted approval examples:

```text
Plan approved. Start implementation.
Approved, but remove the settings screen from scope.
```
