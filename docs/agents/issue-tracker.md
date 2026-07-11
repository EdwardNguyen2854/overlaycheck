# Issue Tracker

How to use GitHub Issues for this project.

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
| Parked | Won't fix in current milestone |

## Issue structure

Every issue should have:
- **Title**: clear, concise, specific
- **Description**: what, why, and acceptance criteria
- **Labels**: type, area, priority
- **Milestone**: target release

## Milestones

- `v0.1.0` — Initial release (done)
- `v0.2.0` — Position Sets and Page Review (done)
- `v0.3.0` — Next planned release

## Workflow

1. File issue → goes to Inbox
2. Triage assigns labels and milestone → still Inbox
3. Review and approve direction → Needs Plan
4. Write plan/spec → Planning
5. Approve plan → Ready for Build
6. Implement → Building
7. Open PR, review → Review
8. Fix issues → Fixing
9. Merge → Ready to Ship → Shipped

## Tracking work

Use the milestone to track what should ship in each release.
Use labels to categorize what kind of work an issue is.
