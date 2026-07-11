# Changelog

All notable changes to OverlayCheck are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [0.2.0] — Position Sets and Page Review

### Added
- Position Sets: save, lock, rename, duplicate, and switch alignment presets
- Per-page scope (default) or all-pages scope for position sets
- Page review: mark reviewed or flagged with optional note
- Progress summary and quick-jump to unreviewed/flagged pages
- Inline update to overwrite active position set with current alignment
- Locked position set blocks drag, nudge, and number edits
- Per-file color selection with transparent ink overlay rendering
- Browser-local persistence of position sets and review status per file pair
- `prefers-reduced-motion` respected for transitions and blink
- Precision keyboard controls: nudge 1px and 10px

## [0.1.0] — Initial release

### Added
- Local-first professional UI (light and dark themes)
- Upload PDF A and PDF B from device
- Overlay, A only, B only, and Blink compare modes
- Press-and-hold "Show A / Show B" momentary controls
- Configurable blink rate (Slow, Standard, Fast) with pause
- Mouse wheel zoom to cursor and drag pan
- Manual PDF B alignment: X/Y offset, scale, rotation
- Drag PDF B directly in viewer
- Keyboard accessible focus, labels, and live status announcements
