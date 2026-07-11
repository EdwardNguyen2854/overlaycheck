# Agent instructions

Build OverlayCheck as a local-first PDF overlay compare app.

## Read first

- `README.md` for current product behavior and local commands.
- `VISION.md` for product intent.
- `CONTEXT.md` and `docs/agents/domain.md` for official terminology.
- `DOD.md` for completion, merge, and release checks.
- `docs/agents/issue-tracker.md` and `docs/agents/feature-loop.md` before changing scope.

## Scope

- Keep PDFs in browser; no upload server unless requested.
- PDF A = base layer, PDF B = movable overlay layer.
- Apply manual X/Y/scale/rotate alignment only to PDF B.
- Support mouse wheel zoom and drag pan.
- Support lock position to prevent accidental PDF B movement.
- Support per-file color selection for visual overlay review.
- Keep UI professional, fast, CAD drawing friendly.

## Do not

- Add backend by default.
- Add accounts, database, cloud storage, or telemetry.
- Commit to pixel diff unless implementing a later version.

## Issue-first workflow

- Prefer GitHub Issues for active work.
- Capture unclear work as an issue before planning or building.
- Plan Mode decides what to build and records acceptance criteria.
- Build Mode implements only the approved plan.
- Review Mode checks safety, scope, and readiness before merge.
- Treat GitHub Projects and milestones as opt-in. Read `docs/agents/issue-tracker.md` before running any `gh project` or milestone commands.
- If GitHub Project is disabled, record workflow status in issue comments.

## Branches and worktrees

- Use a branch for small, single-issue changes.
- Use a worktree for larger work, long-running work, or context switching.
- Keep each branch or worktree tied to one issue whenever possible.

## Stop conditions

- Stop when the approved issue scope is complete.
- Stop and ask when the implementation requires a product decision not covered by the issue or plan.
- Do not expand scope with polish, refactors, or adjacent features unless they are explicitly approved.

## Review before merge

- Run `npm run typecheck` for TypeScript validation.
- Run `npm run build` before release or merge when code changed.
- Verify the core local-first PDF flow still works when relevant: load PDF A, load PDF B, align PDF B, compare, and review.
- Confirm no files are uploaded, persisted remotely, or sent to telemetry.
