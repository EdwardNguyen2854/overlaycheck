import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Info, Layers3, Settings, ShieldCheck } from 'lucide-react';
import { OverlayControls } from './components/OverlayControls';
import { PageControls } from './components/PageControls';
import { PdfCompareViewer } from './components/PdfCompareViewer';
import { PdfUploader } from './components/PdfUploader';
import { PositionSets } from './components/PositionSets';
import { ReviewControls } from './components/ReviewControls';
import { loadPdfFromFile, type PdfDocument } from './lib/pdf';
import {
  buildFileRef,
  buildPairKey,
  createEmptyMetadata,
  findApplicablePosition,
  generatePositionId,
  loadMetadata,
  saveMetadata,
} from './lib/comparisonStorage';
import type {
  Alignment,
  CompareMode,
  LayerColors,
  PageReview,
  PdfFileRef,
  PdfSlot,
  PositionSet,
  ViewTransform,
} from './lib/types';
import './styles.css';

type PdfState = {
  file?: File;
  ref?: PdfFileRef;
  fileName?: string;
  pageCount?: number;
  document: PdfDocument | null;
  isLoading: boolean;
  error?: string;
};

const initialPdfState: PdfState = {
  document: null,
  isLoading: false,
};

const initialAlignment: Alignment = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  rotation: 0,
};

const initialView: ViewTransform = {
  panX: 56,
  panY: 46,
  zoom: 1,
};

const initialColors: LayerColors = {
  a: '#ef4444',
  b: '#2563eb',
};

const NUDGE_SMALL = 1;
const NUDGE_LARGE = 10;
const SCALE_NUDGE_SMALL = 0.005;
const SCALE_NUDGE_LARGE = 0.05;
const ROTATE_NUDGE_SMALL = 0.5;
const ROTATE_NUDGE_LARGE = 5;

export default function App() {
  const [pdfA, setPdfA] = useState<PdfState>(initialPdfState);
  const [pdfB, setPdfB] = useState<PdfState>(initialPdfState);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<CompareMode>('overlay');
  const [opacity, setOpacity] = useState(58);
  const [alignment, setAlignment] = useState<Alignment>(initialAlignment);
  const [activePositionId, setActivePositionId] = useState<string | null>(null);
  const [positions, setPositions] = useState<PositionSet[]>([]);
  const [reviews, setReviews] = useState<Record<number, PageReview>>({});
  const [pairKey, setPairKey] = useState('');
  const [metadataReadyPairKey, setMetadataReadyPairKey] = useState('');
  const [colors, setColors] = useState<LayerColors>(initialColors);
  const [view, setView] = useState<ViewTransform>(initialView);
  const [blinkRate, setBlinkRate] = useState(700);
  const [blinkPaused, setBlinkPaused] = useState(false);
  const [holdView, setHoldView] = useState<'a' | 'b' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const loadedPairRef = useRef<string>('');
  const statusTimeoutRef = useRef<number | null>(null);
  const fileLoadRef = useRef<Record<PdfSlot, number>>({ a: 0, b: 0 });

  const maxPages = useMemo(
    () => Math.max(pdfA.pageCount ?? 0, pdfB.pageCount ?? 0, 1),
    [pdfA.pageCount, pdfB.pageCount],
  );
  const hasAnyPdf = Boolean(pdfA.document || pdfB.document);
  const hasBothPdfs = Boolean(pdfA.document && pdfB.document);
  const reviewedCount = useMemo(
    () => Object.values(reviews).filter((review) => review.reviewed).length,
    [reviews],
  );

  const applicable = useMemo(
    () => findApplicablePosition(positions, page, activePositionId),
    [positions, page, activePositionId],
  );
  const activePosition = applicable.position;
  const isAlignmentLocked = activePosition ? activePosition.locked : false;

  const isDirty = useMemo(() => {
    if (!activePosition) return false;
    const a = activePosition.alignment;
    return (
      Math.abs(a.offsetX - alignment.offsetX) > 0.01 ||
      Math.abs(a.offsetY - alignment.offsetY) > 0.01 ||
      Math.abs(a.scale - alignment.scale) > 0.0005 ||
      Math.abs(a.rotation - alignment.rotation) > 0.01
    );
  }, [activePosition, alignment]);
  const currentReview = reviews[page];

  const setStatus = useCallback((message: string) => {
    setStatusMessage(message);
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setStatusMessage('');
      statusTimeoutRef.current = null;
    }, 2400);
  }, []);

  const handleFileSelect = useCallback(async (slot: PdfSlot, file: File) => {
    const setPdf = slot === 'a' ? setPdfA : setPdfB;
    const ref = buildFileRef(file);
    const requestId = fileLoadRef.current[slot] + 1;
    fileLoadRef.current[slot] = requestId;

    setPdf({
      file,
      ref,
      fileName: file.name,
      document: null,
      isLoading: true,
      error: undefined,
    });

    try {
      const document = await loadPdfFromFile(file);
      if (fileLoadRef.current[slot] !== requestId) return;
      setPdf({
        file,
        ref,
        fileName: file.name,
        pageCount: document.numPages,
        document,
        isLoading: false,
      });
      setPage((current) => (current >= 1 && current <= document.numPages ? current : 1));
    } catch (error) {
      if (fileLoadRef.current[slot] !== requestId) return;
      setPdf({
        file,
        ref,
        fileName: file.name,
        document: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Could not load this PDF.',
      });
    }
  }, []);

  useEffect(() => {
    const nextKey = buildPairKey(pdfA.ref ?? null, pdfB.ref ?? null);
    setPairKey((current) => (current === nextKey ? current : nextKey));
  }, [pdfA.ref, pdfB.ref]);

  useEffect(() => {
    if (!pairKey || !hasBothPdfs) {
      if (loadedPairRef.current) {
        loadedPairRef.current = '';
        setMetadataReadyPairKey('');
        setPositions([]);
        setReviews({});
        setActivePositionId(null);
        setAlignment(initialAlignment);
      }
      return;
    }
    if (loadedPairRef.current === pairKey) return;
    loadedPairRef.current = pairKey;

    const stored = loadMetadata(pairKey);
    if (stored) {
      setPositions(stored.positions);
      setReviews(stored.reviews ?? {});
      setActivePositionId(stored.activePositionId);
      const found = findApplicablePosition(stored.positions, page, stored.activePositionId);
      setAlignment(found.position ? found.position.alignment : initialAlignment);
    } else {
      const empty = createEmptyMetadata(pairKey);
      setPositions(empty.positions);
      setReviews(empty.reviews);
      setActivePositionId(empty.activePositionId);
      setAlignment(initialAlignment);
    }
    // page is intentionally read once on pair load via the ref guard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairKey, hasBothPdfs]);

  useEffect(() => {
    if (!hasBothPdfs || !pairKey || loadedPairRef.current !== pairKey) {
      setMetadataReadyPairKey('');
      return;
    }
    // Save only after the metadata values loaded for this pair have committed to state.
    setMetadataReadyPairKey(pairKey);
  }, [pairKey, hasBothPdfs, positions, reviews, activePositionId]);

  useEffect(() => {
    if (!hasBothPdfs || metadataReadyPairKey !== pairKey) return;
    saveMetadata({
      version: 1,
      pairKey,
      updatedAt: Date.now(),
      activePositionId,
      positions,
      reviews,
    });
  }, [pairKey, hasBothPdfs, metadataReadyPairKey, activePositionId, positions, reviews]);

  useEffect(() => {
    if (!hasBothPdfs) return;
    const found = findApplicablePosition(positions, page, activePositionId);
    if (!found.position) return;
    if (found.position.id === activePositionId) return;
    setActivePositionId(found.position.id);
    setAlignment(found.position.alignment);
  }, [page, positions, activePositionId, hasBothPdfs]);

  const applyPosition = useCallback(
    (position: PositionSet) => {
      setActivePositionId(position.id);
      setAlignment(position.alignment);
      setStatus(`Applied position “${position.name}”.`);
    },
    [setStatus],
  );

  const handleSavePosition = useCallback(
    (name: string, scope: PositionSet['scope']) => {
      const trimmed = name.trim() || `Position ${positions.length + 1}`;
      const now = Date.now();
      const newPosition: PositionSet = {
        id: generatePositionId(),
        name: trimmed,
        scope,
        page,
        alignment: { ...alignment },
        locked: isAlignmentLocked,
        createdAt: now,
        updatedAt: now,
      };
      setPositions((current) => [...current, newPosition]);
      setActivePositionId(newPosition.id);
      setStatus(`Saved position “${trimmed}”.`);
    },
    [alignment, page, positions.length, isAlignmentLocked, setStatus],
  );

  const handleUpdateActivePosition = useCallback(() => {
    if (!activePosition) return;
    const now = Date.now();
    setPositions((current) =>
      current.map((position) =>
        position.id === activePosition.id
          ? {
              ...position,
              alignment: { ...alignment },
              locked: isAlignmentLocked,
              updatedAt: now,
            }
          : position,
      ),
    );
    setStatus(`Updated position “${activePosition.name}”.`);
  }, [activePosition, alignment, isAlignmentLocked, setStatus]);

  const handleTogglePositionLock = useCallback(() => {
    if (!activePosition) return;
    setPositions((current) =>
      current.map((position) =>
        position.id === activePosition.id
          ? { ...position, locked: !position.locked, updatedAt: Date.now() }
          : position,
      ),
    );
  }, [activePosition]);

  const handleDuplicatePosition = useCallback(
    (position: PositionSet) => {
      const now = Date.now();
      const copy: PositionSet = {
        ...position,
        id: generatePositionId(),
        name: `${position.name} copy`,
        createdAt: now,
        updatedAt: now,
      };
      setPositions((current) => [...current, copy]);
      setActivePositionId(copy.id);
      setAlignment(copy.alignment);
      setStatus(`Duplicated position “${position.name}”.`);
    },
    [setStatus],
  );

  const handleRenamePosition = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPositions((current) =>
      current.map((position) =>
        position.id === id ? { ...position, name: trimmed, updatedAt: Date.now() } : position,
      ),
    );
  }, []);

  const handleDeletePosition = useCallback(
    (id: string) => {
      const target = positions.find((position) => position.id === id);
      setPositions((current) => current.filter((position) => position.id !== id));
      if (activePositionId === id) {
        setActivePositionId(null);
        setAlignment(initialAlignment);
      }
      if (target) setStatus(`Deleted position “${target.name}”.`);
    },
    [positions, activePositionId, setStatus],
  );

  const handleSetScope = useCallback((id: string, scope: PositionSet['scope']) => {
    setPositions((current) =>
      current.map((position) =>
        position.id === id ? { ...position, scope, updatedAt: Date.now() } : position,
      ),
    );
  }, []);

  const handleResetAlignment = useCallback(() => {
    setAlignment(initialAlignment);
  }, []);

  const handleResetView = useCallback(() => {
    setView(initialView);
  }, []);

  const handleNudge = useCallback(
    (axis: 'x' | 'y' | 'scale' | 'rotation', direction: -1 | 1, step: number) => {
      if (isAlignmentLocked) return;
      setAlignment((current) => {
        const next = { ...current };
        if (axis === 'x') next.offsetX = Math.round(current.offsetX + direction * step);
        if (axis === 'y') next.offsetY = Math.round(current.offsetY + direction * step);
        if (axis === 'scale') {
          const candidate = current.scale + direction * step;
          next.scale = Math.max(0.1, Math.min(4, Number(candidate.toFixed(4))));
        }
        if (axis === 'rotation') {
          next.rotation = Number((current.rotation + direction * step).toFixed(2));
        }
        return next;
      });
    },
    [isAlignmentLocked],
  );

  const handleUpdateReview = useCallback(
    (updates: Partial<PageReview>) => {
      setReviews((current) => {
        const previous: PageReview = current[page] ?? {
          reviewed: false,
          flagged: false,
          note: '',
          updatedAt: Date.now(),
        };
        const next: PageReview = {
          ...previous,
          ...updates,
          updatedAt: Date.now(),
        };
        return { ...current, [page]: next };
      });
    },
    [page],
  );

  const findNextReviewPage = useCallback(
    (predicate: (review: PageReview | undefined) => boolean) => {
      for (let candidate = page + 1; candidate <= maxPages; candidate += 1) {
        if (predicate(reviews[candidate])) return candidate;
      }
      for (let candidate = 1; candidate < page; candidate += 1) {
        if (predicate(reviews[candidate])) return candidate;
      }
      return page;
    },
    [page, maxPages, reviews],
  );

  const goToNextUnreviewed = useCallback(() => {
    const target = findNextReviewPage((review) => !review?.reviewed);
    if (target !== page) setPage(target);
  }, [findNextReviewPage, page]);

  const goToNextFlagged = useCallback(() => {
    const target = findNextReviewPage((review) => Boolean(review?.flagged));
    if (target !== page) setPage(target);
  }, [findNextReviewPage, page]);

  const goToNextPosition = useCallback(() => {
    if (positions.length === 0) return;
    const { index } = applicable;
    const nextIndex = index < 0 ? 0 : (index + 1) % positions.length;
    applyPosition(positions[nextIndex]);
  }, [positions, applicable, applyPosition]);

  const goToPreviousPosition = useCallback(() => {
    if (positions.length === 0) return;
    const { index } = applicable;
    const previousIndex = index < 0 ? positions.length - 1 : (index - 1 + positions.length) % positions.length;
    applyPosition(positions[previousIndex]);
  }, [positions, applicable, applyPosition]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
      if (editable) return;
      if (event.metaKey || event.ctrlKey) return;

      if (event.key === 'ArrowRight' && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        setPage((current) => Math.min(maxPages, current + 1));
        return;
      }
      if (event.key === 'ArrowLeft' && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        setPage((current) => Math.max(1, current - 1));
        return;
      }
      if (event.key === ']' && !event.shiftKey) {
        event.preventDefault();
        goToNextPosition();
        return;
      }
      if (event.key === '[' && !event.shiftKey) {
        event.preventDefault();
        goToPreviousPosition();
        return;
      }
      if (event.key.toLowerCase() === 'l' && !event.shiftKey) {
        if (!activePosition) return;
        event.preventDefault();
        handleTogglePositionLock();
        return;
      }
      if (event.key.toLowerCase() === 's' && !event.shiftKey) {
        if (!activePosition || !isDirty) return;
        event.preventDefault();
        handleUpdateActivePosition();
        return;
      }
      if (event.key.toLowerCase() === 'r' && !event.shiftKey) {
        event.preventDefault();
        handleUpdateReview({ reviewed: !(currentReview?.reviewed ?? false) });
        return;
      }
      if (event.key.toLowerCase() === 'f' && !event.shiftKey) {
        event.preventDefault();
        handleUpdateReview({ flagged: !(currentReview?.flagged ?? false) });
        return;
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (isAlignmentLocked) return;
        event.preventDefault();
        const direction: -1 | 1 = event.key === 'ArrowUp' ? -1 : 1;
        const step = event.shiftKey ? NUDGE_LARGE : NUDGE_SMALL;
        handleNudge('y', direction, step);
        return;
      }
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (event.shiftKey || event.altKey)) {
        if (isAlignmentLocked) return;
        event.preventDefault();
        const direction: -1 | 1 = event.key === 'ArrowRight' ? 1 : -1;
        handleNudge('x', direction, event.shiftKey ? NUDGE_LARGE : NUDGE_SMALL);
        return;
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    maxPages,
    activePosition,
    isDirty,
    handleTogglePositionLock,
    handleUpdateActivePosition,
    handleUpdateReview,
    currentReview,
    isAlignmentLocked,
    handleNudge,
    goToNextPosition,
    goToPreviousPosition,
  ]);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className={hasBothPdfs ? 'app-shell app-shell--workspace' : 'app-shell'}>
      {hasBothPdfs ? <a className="skip-link" href="#comparison-viewer">Skip to comparison viewer</a> : null}
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Layers3 size={22} />
          </div>
          <div>
            <h1>OverlayCheck</h1>
            <p className="topbar-subtitle">PDF alignment workspace</p>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="topbar-nav" role="group" aria-label="Application">
            <button
              type="button"
              className="topbar-nav__button"
              onClick={() => setStatus('Settings entry point selected.')}
            >
              <Settings size={15} aria-hidden="true" />
              Settings
            </button>
            <button
              type="button"
              className="topbar-nav__button"
              onClick={() => setStatus('About entry point selected.')}
            >
              <Info size={15} aria-hidden="true" />
              About
            </button>
          </div>
          {statusMessage ? <span className="topbar-nav-status" role="status">{statusMessage}</span> : null}
          <div className="topbar-meta">
            {hasAnyPdf ? <span className="review-progress">{reviewedCount} reviewed</span> : null}
            <div className="privacy-pill">
              <ShieldCheck size={16} />
              Local-only
            </div>
          </div>
        </div>
      </header>

      {!hasBothPdfs ? (
        <section className="onboarding" aria-labelledby="workspace-title">
          <div className="onboarding__intro">
            <p className="eyebrow">Local PDF comparison</p>
            <h2 id="workspace-title">Load two PDFs to begin.</h2>
            <p>PDF A is the base layer. PDF B is the movable overlay.</p>
          </div>
          <div className="upload-grid">
            <PdfUploader slot="a" title="PDF A" fileName={pdfA.fileName} pageCount={pdfA.pageCount} isLoading={pdfA.isLoading} error={pdfA.error} color={colors.a} onFileSelect={handleFileSelect} />
            <PdfUploader slot="b" title="PDF B" fileName={pdfB.fileName} pageCount={pdfB.pageCount} isLoading={pdfB.isLoading} error={pdfB.error} color={colors.b} onFileSelect={handleFileSelect} />
          </div>
        </section>
      ) : (
        <section className="file-strip" aria-label="Loaded PDFs">
          <PdfUploader compact slot="a" title="PDF A" fileName={pdfA.fileName} pageCount={pdfA.pageCount} isLoading={pdfA.isLoading} error={pdfA.error} color={colors.a} onFileSelect={handleFileSelect} />
          <PdfUploader compact slot="b" title="PDF B" fileName={pdfB.fileName} pageCount={pdfB.pageCount} isLoading={pdfB.isLoading} error={pdfB.error} color={colors.b} onFileSelect={handleFileSelect} />
        </section>
      )}

      {hasBothPdfs ? (
        <div className="workspace-grid">
          <PdfCompareViewer
            pdfA={pdfA.document}
            pdfB={pdfB.document}
            page={page}
            pageCountA={pdfA.pageCount}
            pageCountB={pdfB.pageCount}
            mode={mode}
            opacity={opacity}
            alignment={alignment}
            alignmentLocked={isAlignmentLocked}
            colors={colors}
            view={view}
            holdView={holdView}
            blinkPaused={blinkPaused}
            blinkRate={blinkRate}
            activePositionName={activePosition?.name ?? null}
            isDirty={isDirty}
            currentReview={currentReview}
            statusMessage={statusMessage}
            onAlignmentChange={setAlignment}
            onViewChange={setView}
          />

          <aside className="sidebar" aria-label="Comparison controls">
            <PageControls
              page={page}
              maxPages={maxPages}
              pageCountA={pdfA.pageCount}
              pageCountB={pdfB.pageCount}
              disabled={!hasAnyPdf}
              currentReview={currentReview}
              onPageChange={setPage}
              onJumpToNextUnreviewed={goToNextUnreviewed}
              onJumpToNextFlagged={goToNextFlagged}
            />

            <PositionSets
              positions={positions}
              activePositionId={applicable.position?.id ?? null}
              currentPage={page}
              isDirty={isDirty}
              alignment={alignment}
              isAlignmentLocked={isAlignmentLocked}
              disabled={!hasBothPdfs}
              onApply={applyPosition}
              onSave={handleSavePosition}
              onUpdateActive={handleUpdateActivePosition}
              onDuplicate={handleDuplicatePosition}
              onRename={handleRenamePosition}
              onDelete={handleDeletePosition}
              onSetScope={handleSetScope}
              onAlignmentChange={setAlignment}
              onToggleLock={handleTogglePositionLock}
              onResetAlignment={handleResetAlignment}
              onNudge={handleNudge}
            />

            <OverlayControls
              mode={mode}
              opacity={opacity}
              colors={colors}
              view={view}
              blinkRate={blinkRate}
              blinkPaused={blinkPaused}
              holdView={holdView}
              disabled={!hasAnyPdf}
              onModeChange={setMode}
              onOpacityChange={setOpacity}
              onColorsChange={setColors}
              onViewChange={setView}
              onBlinkRateChange={setBlinkRate}
              onBlinkPausedChange={setBlinkPaused}
              onHoldViewChange={setHoldView}
              onResetView={handleResetView}
            />

            <ReviewControls
              page={page}
              maxPages={maxPages}
              reviews={reviews}
              disabled={!hasAnyPdf}
              onUpdateReview={handleUpdateReview}
            />
          </aside>
        </div>
      ) : null}
    </main>
  );
}
