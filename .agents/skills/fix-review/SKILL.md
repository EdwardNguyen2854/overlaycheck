---
name: fix-review
description: Fix only the issues found during review. Use when the user runs /fix-review, asks to address review findings, or wants the implementation changed only enough to pass the previous review without adding new scope.
---

# Fix Review

Fix only the issues found during review.

## Required Gate

Read the review report first. If there is no review report or the requested fix is broader than the findings, ask the user to clarify.

## Process

### 1. Load Inputs

Read:

- The issue.
- Approved implementation plan.
- Review report.
- `docs/agents/issue-tracker.md`.
- Changed files.
- Validation failures, if any.

### 2. Fix Only Required Findings

If GitHub Project is enabled in `docs/agents/issue-tracker.md`, move or keep the issue in `Fixing` while addressing required fixes. If Project is disabled, do not use `gh project` commands.

For each required fix:

- Make the smallest change that resolves it.
- Avoid unrelated cleanup.
- Avoid design changes unless the review requires them.
- Preserve scope and terminology.

### 3. Re-run Validation

Run the checks relevant to the fix. Prefer targeted checks first, then broader checks if appropriate.

### 4. Write The Fix Summary

Post or provide:

```md
# Review Fix Summary

## Fixed

## Re-checked

## Remaining Issues

## Ready for Review?
```

## Rules

- Do not add new feature scope.
- Do not silently change the plan.
- Do not fix optional review suggestions unless the user approves.
- If a review finding is wrong or infeasible, explain why and ask before ignoring it.
