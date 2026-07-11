---
name: review
description: Review completed work before merge against the issue, approved plan, acceptance criteria, DOD.md, CONTEXT.md, ADRs, changed files, and validation results. Use when the user runs /review or asks whether an implementation is safe to merge.
---

# Review

Review the implementation before merge.

## Mindset

Prioritize bugs, behavioral regressions, missed acceptance criteria, scope creep, and missing validation. Findings come first.

## Process

### 1. Load Review Inputs

Read:

- Original issue.
- Approved implementation plan.
- Acceptance criteria.
- `docs/agents/issue-tracker.md`.
- `DOD.md`.
- `CONTEXT.md`.
- Relevant ADRs.
- Changed files and diff.
- Test and validation output from the build.

### 2. Check The Work

Check:

- Acceptance criteria are met.
- The approved plan was followed.
- Domain terminology is consistent.
- ADRs are respected.
- Error handling is reasonable.
- Edge cases are considered.
- Tests or manual validation cover the change.
- There is no obvious scope creep.
- The implementation is no more complex than needed.

### 3. Write The Review Report

Use this structure:

```md
# Review Report

## Result

Pass / Needs Changes

## Checked

- [ ] Acceptance criteria
- [ ] Approved plan
- [ ] Domain terminology
- [ ] ADR consistency
- [ ] Manual validation
- [ ] No obvious scope creep

## Issues Found

## Required Fixes

## Safe to Merge?

Yes / No
```

When there are findings, include file and line references where possible.

### 4. Update Workflow State

If GitHub Project is enabled in `docs/agents/issue-tracker.md`:

- Move issue to `Review` while reviewing.
- Move issue to `Fixing` if changes are required.
- Move issue to `Ready to Ship` only if review passes.

If GitHub Project is disabled, do not use `gh project` commands. Record the review result in the issue comment instead.

## Rules

- Do not fix issues during `/review` unless the user explicitly asks.
- Do not approve work with known blocking bugs.
- Do not ignore acceptance criteria because the implementation looks good.
- Keep review focused on the current issue and approved plan.
