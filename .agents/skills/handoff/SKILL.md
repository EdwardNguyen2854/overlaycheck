---
name: handoff
description: Capture the current issue, branch/worktree, progress, risks, and next step so another agent or future session can continue. Use when the user runs /handoff, wants to pause work, switch agents, preserve context, or leave an issue comment with current state.
---

# Handoff

Capture enough state for another agent or future session to continue safely.

## Process

### 1. Inspect Current State

Gather:

- Current issue, if known.
- Current branch or worktree.
- `docs/agents/issue-tracker.md`, if present.
- Goal of the work.
- What is done.
- What is not done.
- Important docs, ADRs, or decisions.
- Current validation status.
- Problems, blockers, or risks.
- The exact next step.

### 2. Write The Handoff

Use this structure:

```md
# Handoff

## Current Issue

## Current Branch / Worktree

## Tracker State

## Goal

## Done

## Not Done

## Important Context

## Problems / Risks

## Validation

## Next Step
```

### 3. Save Or Post It

Prefer posting the handoff as an issue comment when an issue exists.

Include Project status and milestone only when GitHub Project or GitHub Milestones are enabled in `docs/agents/issue-tracker.md`.

If there is no issue, save it as a temporary Markdown note only after telling the user where it will live.

## Rules

- Be factual. Do not make progress sound more complete than it is.
- Include unresolved problems.
- Include branch/worktree names exactly.
- Include commands already run and whether they passed or failed.
- Do not implement during handoff.
