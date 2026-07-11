# Issue Tracker

How to use GitHub Issues for this project.

## Issue Tracker Settings

| Setting | Value |
|---|---|
| GitHub Issues | enabled |
| GitHub Project | enabled |
| Project owner | EdwardNguyen2854 |
| Project number | 4 |
| Project title | OverlayCheck Delivery |
| Project status field | Status |
| GitHub Milestones | disabled |
| Current milestone |  |
| Workflow status fallback | issue comments |

Agents may use `gh project` commands only for the project documented above. If `GitHub Milestones` is disabled, agents must not create, assign, or require milestones. Do not use `status:*` labels unless `Workflow status fallback` is changed to `status labels`.

## Issue states

| Status | Meaning |
|--------|---------|
| Inbox | Triaged, awaiting decision |
| Needs Plan | Approved in principle but no implementation plan yet |
| Planning | Actively writing the plan/spec |
| Ready for Build | Plan approved, waiting to start |
| Building | Implementation in progress |
| Review | Implementation complete, under review |
| Fixing | Review found issues, fixing |
| Ready to Ship | Approved for merge |
| Shipped | Merged and closed |
| Parked | Won't fix in current scope |

## Project status mapping

The `OverlayCheck Delivery` project uses these existing `Status` options:

| Project status | Workflow states |
|---|---|
| Backlog | Inbox, Needs Plan, Parked |
| Ready | Ready for Build |
| In progress | Planning, Building, Fixing |
| In review | Review, Ready to Ship |
| Done | Shipped |

## Issue structure

Every issue should have:
- **Title**: clear, concise, specific
- **Description**: what, why, and acceptance criteria
- **Labels**: type, area, priority
- **Milestone**: only when GitHub Milestones are enabled in Issue Tracker Settings

## Milestones

Milestones are currently disabled. Use issue comments and labels to track active work unless Issue Tracker Settings are changed.

## Workflow

1. File issue → goes to Inbox
2. Triage assigns labels → still Inbox
3. Review and approve direction → Needs Plan
4. Write plan/spec → Planning
5. Approve plan → Ready for Build
6. Implement → Building
7. Open PR, review → Review
8. Fix issues → Fixing
9. Merge → Ready to Ship → Shipped

## Tracking work

Use milestones only when enabled in Issue Tracker Settings.
Use labels to categorize what kind of work an issue is.
Use the GitHub Project `Status` field for workflow status when the issue is in the project. Use issue comments as the fallback for work that is not in the project.
