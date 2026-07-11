# Feature Loop

The workflow for implementing features from issue to merge.

## Loop overview

1. **Capture** → file an issue with context
2. **Triage** → label, prioritize, assign milestone
3. **Plan** → write a plan or spec
4. **Start** → create branch or worktree
5. **Build** → implement the approved plan
6. **Review** → verify against issue and plan
7. **Ship** → merge and close

## When to use a branch vs worktree

- **Branch**: small changes, bug fixes, single-issue work
- **Worktree**: larger features that might take multiple sessions, or when you need to context-switch

## Step-by-step

### 1. Capture
Use `/capture` or file an issue directly. Include:
- What the feature is
- Why it matters (user problem it solves)
- Acceptance criteria (how we know it's done)

### 2. Triage
- Assign type, area, priority labels
- Set milestone
- Mark `needs:plan` if approach isn't obvious

### 3. Plan
- Write a plan in the issue or a separate spec doc
- Get explicit approval before coding
- Use `/plan` skill if needed

### 4. Start
- Use `/start` to create branch or worktree
- This creates an isolated workspace

### 5. Build
- Implement only what the plan describes
- Do not add extra scope
- Run `npm run typecheck` before停下来

### 6. Review
- Use `/review` to check against the issue
- Verify all acceptance criteria are met
- Run `npm run typecheck` and `npm run build`

### 7. Ship
- Use `/ship` to merge and close
- Update changelog if not already done

## When to stop

- The issue is fully addressed
- The plan is complete
- Acceptance criteria are met
- Do not add polish or extra features that weren't in the plan
