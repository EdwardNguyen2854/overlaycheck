---
name: spec
description: Create or update a lightweight release spec for the issue-first workflow. Use when the user runs /spec, asks for a release spec, wants to define v0.1.0 scope, or needs current release intent connected to GitHub Issues and optional milestones.
---

# Spec

Create or update a lightweight release-level spec.

This is not a heavy PRD. It is the anchor for the current release.

## Process

### 1. Identify The Release

Use the release named by the user, such as `v0.1.0`. If none is provided, ask or use the current release convention if already documented.

### 2. Load Context

Read:

- `VISION.md`
- `CONTEXT.md`
- `DOD.md`
- `docs/agents/issue-tracker.md`
- Existing release specs under `docs/specs/`
- Relevant issues and milestones, when milestones are enabled
- Relevant ADRs

### 3. Draft Or Update The Spec

Create or update:

```text
docs/specs/<version>.md
```

Use this structure:

```md
# <version> Release Spec

## Release Goal

## Target User

## Core User Journey

## Must Ship

## Nice To Have

## Out Of Scope

## Key GitHub Issues

## Acceptance Criteria

## Risks

## Open Questions
```

### 4. Connect To GitHub

If GitHub Issues are configured:

- Link key issues.
- Do not use the spec as a task tracker. Tasks belong in issues.

If GitHub Milestones are enabled in `docs/agents/issue-tracker.md`, align the spec with the matching GitHub Milestone. If milestones are disabled, keep release intent in the spec and do not create or assign milestones.

## Rules

- Keep the spec release-level, not task-level.
- Do not replace GitHub Issues with a backlog file.
- Do not include fake certainty. Keep open questions visible.
- Use official domain terms from `CONTEXT.md`.
