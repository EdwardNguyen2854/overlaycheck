# Vision

OverlayCheck exists to give engineers and designers a fast, private way to verify that two PDFs are visually identical — or to precisely document where they diverge.

## Who it serves

- CAD technicians comparing revisioned drawings
- Engineers reviewing catalog page generation
- Anyone doing document QA where position drift matters more than pixel-perfect match

## The problem it solves

Existing tools either upload files to a server (privacy risk) or require manual pixel-diff algorithms that miss alignment drift. OverlayCheck keeps files local and lets users align PDFs manually with X/Y/scale/rotate controls.

## What it should feel like

- **Instant** — files load and render without perceptible delay
- **Precise** — alignment controls feel mechanical, nudges are exact
- **Unobtrusive** — the UI stays out of the way of the documents
- **Professional** — no playful colors or cartoon graphics; CAD drawing aesthetic

## Core concepts

- **PDF A** — the base/reference layer, immovable
- **PDF B** — the overlay layer, manually aligned against A
- **Position Set** — a saved alignment configuration (offset, scale, rotation) with optional lock
- **Page Review** — per-page status (unreviewed, reviewed, flagged) with optional note
- **Compare Mode** — how A and B are visually combined: overlay, A-only, B-only, blink
