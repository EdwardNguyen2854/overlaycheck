# Definition of Done

## When an issue is done

- All acceptance criteria in the issue are met
- No TypeScript errors (`npm run typecheck` passes)
- No new runtime errors in the browser console
- All new components/functions have basic smoke tests
- UI works at 1280×720 and 1920×1080

## When code is ready to merge

- Branch is up to date with base branch (or rebased)
- All checks pass (typecheck, build)
- Code follows existing conventions (React + TypeScript, CSS classes over inline styles unless brief)
- No debug logs or commented-out code left behind
- PR description explains what changed and why

## When a release is safe to ship

- `npm run build` succeeds without errors
- Dev server starts and pages render correctly
- Core compare workflow (load A, load B, align, review) works end-to-end
- No console errors on load
- Accessibility: keyboard navigation and focus indicators work
- `prefers-reduced-motion` is respected

## When to stop / hand off

- Stop when the issue description is fully addressed, even if other ideas exist
- Hand off when blocked on a decision that requires user input
- Hand off when the scope changes mid-implementation
- Always leave code compilable and runnable — never break the build
