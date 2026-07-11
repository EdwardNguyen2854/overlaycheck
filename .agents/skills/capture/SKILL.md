---
name: capture
description: Turn a rough idea, bug report, task, experiment, or vague feature request into a GitHub Issue for the issue-first workflow. Use when the user runs /capture, wants to create an issue, improve an existing issue, or get work ready for planning without implementing it yet.
---

# Capture

Turn a rough idea into a GitHub Issue, or improve an existing issue so it is ready for planning.

## Process

### 1. Understand The Request

Identify whether the work is a feature, bug, task, experiment, research item, or AI run note.

If required context is missing, ask only the questions needed to create a useful issue. Prefer moving uncertainty into `Open Questions` instead of over-interviewing.

### 2. Read Project Context

When present, read:

- `VISION.md`
- `CONTEXT.md`
- `DOD.md`
- Current release spec under `docs/specs/`
- Relevant ADRs under `docs/adr/`
- `docs/agents/issue-tracker.md`
- Existing related issues via `gh issue view` or `gh issue list`

### 3. Draft The Issue

Use the right structure for the type of work.

Feature issue:

```md
# Goal

# User Value

# Scope

## In Scope

## Out of Scope

# Acceptance Criteria

# Notes

# Open Questions
```

Bug issue:

```md
# Expected Behavior

# Actual Behavior

# Steps To Reproduce

# Impact

# Acceptance Criteria

# Notes
```

Experiment issue:

```md
# Goal

# What We Need To Learn

# Proposed Approach

# Success Criteria

# Keep / Discard Decision

# Follow-up Possibilities
```

### 4. Create Or Update The Issue

Use `gh issue create` or `gh issue edit` when GitHub Issues are configured. If no tracker is configured, write the draft and ask where it should live.

Read `docs/agents/issue-tracker.md` before touching Project or milestone state.

Apply labels when obvious:

- Type: `type:feature`, `type:bug`, `type:task`, `type:experiment`, `type:research`, `type:docs`, `type:refactor`, `type:chore`.
- Needs: usually `needs:plan` for new feature/task work.
- Priority: only when the user or release spec makes priority clear.
- Area: only when the affected area is clear.

If GitHub Project is enabled, add the issue to the configured Project and set status to `Inbox` or `Needs Plan`.

If GitHub Milestones are enabled, assign a milestone only when the issue belongs to the current release. If milestones are enabled but no current milestone is documented, ask before assigning one.

### 5. Final Output

Return:

- Issue URL or issue number.
- Labels applied.
- Project status and milestone applied, if configured.
- Any open questions.
- Recommended next command, usually `/plan #<issue>`.

## Rules

- Do not implement during capture.
- Do not over-specify unknown work. Mark uncertainty clearly.
- Keep acceptance criteria observable.
- Use official domain terms from `CONTEXT.md` when present.
- Do not use labels as workflow status if a GitHub Project status field exists.
- Do not run `gh project` commands unless GitHub Project is enabled in `docs/agents/issue-tracker.md`.
- Do not create or assign milestones unless GitHub Milestones are enabled in `docs/agents/issue-tracker.md`.
