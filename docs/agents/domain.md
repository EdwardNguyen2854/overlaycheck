# Domain

Product terminology for consistent AI understanding.

## Core entities

### PDF A (Base Layer)
- Reference document, always immovable
- Rendered first, underneath PDF B

### PDF B (Overlay Layer)
- Comparison document, user-adjustable
- Aligned against PDF A via X/Y offset, scale, rotation

### Position Set
- Named alignment preset
- Fields: name, x, y, scale, rotation, scope (page | global), locked
- Scoped per-page or all-pages
- Locked sets cannot be accidentally modified

### Page Review
- Per-page metadata
- Fields: pageIndex, status (unreviewed | reviewed | flagged), note

### Compare Mode
- `overlay` — both PDFs with transparency
- `a-only` — PDF A only
- `b-only` — PDF B only
- `blink` — alternating between A and B

### Blink Rate
- `slow` — 1000ms interval
- `standard` — 500ms interval
- `fast` — 250ms interval

## User actions

| Action | Input |
|--------|-------|
| Zoom | Mouse wheel |
| Pan | Shift + drag |
| Move PDF B | Drag (when unlocked) |
| Nudge 1px | Arrow keys |
| Nudge 10px | Shift + arrow keys |
| Change page | Left / Right arrows |
| Lock position | L |
| Save alignment | S |
| Toggle review | R |
| Toggle flagged | F |

## Persistence

All state stored in `localStorage` under `overlaycheck:pair:<fingerprint>`:
- Position sets per file pair
- Active position set per file pair
- Page review status per file pair

No server. No telemetry. Files never leave the device.
