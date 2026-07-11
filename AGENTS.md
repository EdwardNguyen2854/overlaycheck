# Agent instructions

Build OverlayCheck as a local-first PDF overlay compare app.

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
