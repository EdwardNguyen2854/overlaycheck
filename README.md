# OverlayCheck v0.2.0

OverlayCheck is a browser-only web app for comparing two PDF files by overlaying one PDF page on top of another. It is designed for CAD drawings, generated catalog pages, and document revision checks where visual position changes matter.

The new release adds **Position Sets** for repeatable alignment, page-by-page review status, and precision keyboard controls. Everything stays on this device — no uploads, no backend, no telemetry.

## Features in this build

- Local-first professional UI (light and dark themes, responsive below 1080px)
- Upload PDF A and PDF B from your device
- Overlay, A only, B only, and Blink compare modes
- Press-and-hold "Show A / Show B" momentary controls
- Configurable blink rate (Slow, Standard, Fast) with pause
- Mouse wheel zoom to cursor and drag pan
- Manual PDF B alignment:
  - X / Y offset in pixels
  - Scale
  - Rotation in degrees
  - Nudge buttons and keyboard nudges (1px, 10px)
- Drag PDF B directly in the viewer to adjust alignment
- **Position Sets**: save named alignment presets, lock them, and switch between them with one click
  - Per-page scope (default) or all-pages (global) scope
  - Locked / Modified / Active indicators
  - Inline rename, duplicate, delete, and scope switching
  - "Update" to overwrite the active set with the current alignment
- **Page review**: mark each page reviewed or flagged, with a short note
  - Progress summary (reviewed / flagged / remaining)
  - Quick jump to the next unreviewed or flagged page
- Per-file color selection with transparent ink overlay rendering
- Browser-local persistence of position sets and review status per file pair
- `prefers-reduced-motion` respected for transitions and blink
- Keyboard-accessible focus, labels, and live status announcements

## Mouse controls

```text
Wheel           Zoom in/out around cursor
Drag PDF B      Move PDF B when position is unlocked
Shift + drag    Pan workspace
Locked + drag   Pan workspace safely
```

## Keyboard shortcuts

These shortcuts are ignored while typing inside inputs or textareas.

```text
← / →          Previous / next page
[ / ]          Previous / next position set
L              Lock or unlock the active position set
S              Save current alignment to the active position set
R              Toggle reviewed on the current page
F              Toggle flagged on the current page
↑ / ↓          Nudge PDF B Y by 1 px (Shift = 10 px)
Shift + ← / →  (while editing) coarse X nudge, see position help
```

## How Position Sets work

- Open the **Position sets** card in the sidebar.
- Adjust PDF B (drag, nudge, or type values).
- Click **Save current alignment**, give it a name, and choose **Page N** or **All pages**.
- Saved sets appear in the list. Click one to apply it instantly — your zoom and pan are preserved.
- The active set shows a **Modified** chip whenever the live alignment has drifted from the saved values. Use **Update** to overwrite the set.
- A **Locked** set blocks drag, nudge, and number edits until you unlock it.

Each loaded pair of PDFs remembers its own position sets and review status, so reopening the same files restores your work.

## Persistence and privacy

PDF files are rendered in the browser using PDF.js and are never uploaded.

For each file pair, OverlayCheck stores the following **only in your browser's `localStorage`** under the key `overlaycheck:pair:<file-pair-fingerprint>`:

- Saved position sets
- Which position set was active
- Page review status (reviewed, flagged, note) for each page

Nothing leaves your device. Clearing your browser's site data removes all stored metadata.

## Tech

- React + TypeScript
- Vite
- PDF.js via `pdfjs-dist`
- HTML Canvas rendering
- `lucide-react` icons

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5178
```

For LAN access from another computer:

```bash
npm run dev
```

Then open from another device on the same network:

```text
http://YOUR_HOST_IP:5178
```

## Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── components/
│   ├── OverlayControls.tsx
│   ├── PageControls.tsx
│   ├── PdfCompareViewer.tsx
│   ├── PdfUploader.tsx
│   ├── PositionSets.tsx
│   └── ReviewControls.tsx
└── lib/
    ├── comparisonStorage.ts
    ├── pdf.ts
    └── types.ts
```

## Roadmap ideas

- Position preview thumbnails
- JSON export/import of review metadata
- Side-by-side mode
- Pixel diff mode
- Difference heatmap
- Export comparison image
- Export comparison PDF/report
- Auto-align by page edges or visual anchors
- Shared comments and assignees