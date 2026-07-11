# Context

Official product terminology and rejected synonyms.

## Terms

**PDF A**:
The base/reference PDF layer. Always rendered underneath. Cannot be moved by the user.
_Avoid_: Base PDF, Reference PDF, Source PDF, Left PDF

**PDF B**:
The overlay/movable PDF layer. User aligns it against PDF A.
_Avoid_: Overlay PDF, Target PDF, Comparison PDF, Right PDF

**Position Set**:
A named, persisted alignment configuration for PDF B (X offset, Y offset, scale, rotation) scoped to a specific page or all pages.
_Avoid_: Preset, Alignment Preset, Saved Position, Position Preset

**Active Position Set**:
The position set currently applied to the viewer. The live alignment may match it exactly or may have drifted (modified).
_Avoid_: Current Position, Active Preset

**Page Review**:
Per-page status recording whether the page has been reviewed, flagged for follow-up, or has a note.
_Avoid_: Page Status, Review Status, Page Note

**Compare Mode**:
The visual rendering mode: overlay (both visible with transparency), A-only, B-only, or blink.
_Avoid_: View Mode, Display Mode, Rendering Mode

**Blink Rate**:
The speed at which the view alternates between PDF A and PDF B in blink compare mode.
_Avoid_: Blink Speed, Toggle Rate

**Nudge**:
A 1px or 10px adjustment to PDF B's X or Y offset via keyboard or button.
_Avoid_: Shift, Move, Offset Adjustment

**Run**:
One execution attempt to complete a Task using a specific Agent Version and fixed inputs.
_Avoid_: Session, Conversation, Job

## Rejected concepts

- Pixel diff (out of scope for v0.1.0)
- Backend server / cloud storage / telemetry
- Accounts or user authentication
- Shared annotations or collaborative review
