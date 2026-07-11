---
name: discover
description: Map unclear or foggy work before it becomes a spec, issue, or implementation plan. Use when the user runs /discover, has an ambiguous feature idea, needs research/prototyping decisions, or is not ready for normal capture and plan yet.
---

# Discover

Map unclear work before planning or implementation.

Use this when the idea has too many unknowns for a normal issue.

## Good Use Cases

- Product direction is unclear.
- Several decisions block implementation.
- Research is needed.
- A prototype is needed.
- The feature may become multiple issues.
- The user knows the destination but not the path.

## Process

### 1. Gather Context

Read relevant docs if present:

- `VISION.md`
- `CONTEXT.md`
- `docs/agents/issue-tracker.md`
- Current release spec
- Relevant ADRs
- Related issues
- Relevant code areas, if the discovery depends on existing implementation

### 2. Map The Unknowns

Separate:

- Known facts.
- Unknowns.
- Decisions needed.
- Research needed.
- Prototype candidates.
- Work that can already become issues.

### 3. Produce A Discovery Map

Use this structure:

```md
# Discovery Map

## Goal

## Known Facts

## Unknowns

## Decisions Needed

## Research Needed

## Prototype Needed

## Proposed Issues
```

### 4. Recommend Next Step

Recommend one of:

- `/spec` if this should become release-level scope.
- `/capture` if it is ready to become one or more issues.
- A research issue if a factual answer is needed.
- An experiment issue if learning requires building something disposable.

## Rules

- Do not implement during discovery.
- Do not pretend unknowns are decisions.
- Keep proposed issues independently buildable where possible.
- Capture decisions as ADR candidates only after owner approval.
