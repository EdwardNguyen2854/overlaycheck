import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { CheckCircle2, Flag, Lock, Maximize2, Minus, Plus, ScanLine } from 'lucide-react';
import type { PdfDocument } from '../lib/pdf';
import { clearCanvas, renderPdfPageToCanvas } from '../lib/pdf';
import type {
  Alignment,
  CompareMode,
  LayerColors,
  PageReview,
  ViewTransform,
} from '../lib/types';

type PdfCompareViewerProps = {
  pdfA: PdfDocument | null;
  pdfB: PdfDocument | null;
  page: number;
  pageCountA?: number;
  pageCountB?: number;
  mode: CompareMode;
  opacity: number;
  alignment: Alignment;
  alignmentLocked: boolean;
  colors: LayerColors;
  view: ViewTransform;
  holdView: 'a' | 'b' | null;
  blinkPaused: boolean;
  blinkRate: number;
  activePositionName: string | null;
  isDirty: boolean;
  currentReview?: PageReview;
  statusMessage: string;
  onAlignmentChange: (alignment: Alignment) => void;
  onViewChange: (view: ViewTransform) => void;
};

type CanvasSize = {
  width: number;
  height: number;
};

const emptySize: CanvasSize = { width: 0, height: 0 };
const PDF_RENDER_SCALE = 1;
const MIN_VIEW_ZOOM = 0.25;
const MAX_VIEW_ZOOM = 4;

export function PdfCompareViewer({
  pdfA,
  pdfB,
  page,
  pageCountA,
  pageCountB,
  mode,
  opacity,
  alignment,
  alignmentLocked,
  colors,
  view,
  holdView,
  blinkPaused,
  blinkRate,
  activePositionName,
  isDirty,
  currentReview,
  statusMessage,
  onAlignmentChange,
  onViewChange,
}: PdfCompareViewerProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const [sizeA, setSizeA] = useState<CanvasSize>(emptySize);
  const [sizeB, setSizeB] = useState<CanvasSize>(emptySize);
  const [renderingA, setRenderingA] = useState(false);
  const [renderingB, setRenderingB] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderedPageA, setRenderedPageA] = useState<number | null>(null);
  const [renderedPageB, setRenderedPageB] = useState<number | null>(null);
  const [blinkOn, setBlinkOn] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef<null | { x: number; y: number; startX: number; startY: number }>(null);
  const panRef = useRef<null | { x: number; y: number; startPanX: number; startPanY: number }>(null);
  const lastAutoFitPageRef = useRef<number | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = () => {
      setReducedMotion(media.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (mode !== 'blink' || blinkPaused || holdView || reducedMotion) {
      setBlinkOn(false);
      return;
    }
    const id = window.setInterval(() => setBlinkOn((value) => !value), Math.max(120, blinkRate));
    return () => window.clearInterval(id);
  }, [mode, blinkPaused, blinkRate, holdView, reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    const ref = canvasARef.current;
    if (!ref) return;
    const canvas: HTMLCanvasElement = ref;

    async function render() {
      setRenderError(null);
      setRenderedPageA(null);
      if (!pdfA || page > pdfA.numPages) {
        clearCanvas(canvas);
        setSizeA(emptySize);
        return;
      }
      try {
        setRenderingA(true);
        const renderCanvas = document.createElement('canvas');
        const nextSize = await renderPdfPageToCanvas(pdfA, page, renderCanvas, PDF_RENDER_SCALE, colors.a);
        if (!cancelled) {
          copyCanvas(renderCanvas, canvas, nextSize);
          setSizeA(nextSize);
          setRenderedPageA(page);
        }
      } catch (error) {
        if (!cancelled) setRenderError(error instanceof Error ? error.message : 'Failed to render PDF A.');
      } finally {
        if (!cancelled) setRenderingA(false);
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [pdfA, page, colors.a]);

  useEffect(() => {
    let cancelled = false;
    const ref = canvasBRef.current;
    if (!ref) return;
    const canvas: HTMLCanvasElement = ref;

    async function render() {
      setRenderError(null);
      setRenderedPageB(null);
      if (!pdfB || page > pdfB.numPages) {
        clearCanvas(canvas);
        setSizeB(emptySize);
        return;
      }
      try {
        setRenderingB(true);
        const renderCanvas = document.createElement('canvas');
        const nextSize = await renderPdfPageToCanvas(pdfB, page, renderCanvas, PDF_RENDER_SCALE, colors.b);
        if (!cancelled) {
          copyCanvas(renderCanvas, canvas, nextSize);
          setSizeB(nextSize);
          setRenderedPageB(page);
        }
      } catch (error) {
        if (!cancelled) setRenderError(error instanceof Error ? error.message : 'Failed to render PDF B.');
      } finally {
        if (!cancelled) setRenderingB(false);
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [pdfB, page, colors.b]);

  const stageSize = useMemo(() => {
    const transformedBWidth = Math.abs(sizeB.width * alignment.scale) + Math.abs(alignment.offsetX) + 260;
    const transformedBHeight = Math.abs(sizeB.height * alignment.scale) + Math.abs(alignment.offsetY) + 260;
    return {
      width: Math.max(920, sizeA.width + 220, transformedBWidth),
      height: Math.max(620, sizeA.height + 220, transformedBHeight),
    };
  }, [alignment.offsetX, alignment.offsetY, alignment.scale, sizeA.height, sizeA.width, sizeB.height, sizeB.width]);

  const effectiveMode: CompareMode = holdView === 'a' ? 'a-only' : holdView === 'b' ? 'b-only' : mode;

  const showA = effectiveMode === 'overlay' || effectiveMode === 'a-only' || (effectiveMode === 'blink' && !blinkOn);
  const showB = effectiveMode === 'overlay' || effectiveMode === 'b-only' || (effectiveMode === 'blink' && blinkOn);
  const bOpacity = effectiveMode === 'overlay' ? opacity / 100 : 1;
  const isEmpty = !pdfA && !pdfB;
  const isRendering = renderingA || renderingB;
  const pageMissingA = Boolean(pdfA && page > pdfA.numPages);
  const pageMissingB = Boolean(pdfB && page > pdfB.numPages);

  function fitView(fitWidth = false) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const bounds = getVisibleBounds(sizeA, sizeB, alignment, showA, showB);
    if (!bounds) return;

    const horizontalPadding = 64;
    const verticalPadding = 64;
    const availableWidth = Math.max(1, viewport.clientWidth - horizontalPadding);
    const availableHeight = Math.max(1, viewport.clientHeight - verticalPadding);
    const widthZoom = availableWidth / bounds.width;
    const heightZoom = availableHeight / bounds.height;
    const zoom = clamp(fitWidth ? widthZoom : Math.min(widthZoom, heightZoom), MIN_VIEW_ZOOM, MAX_VIEW_ZOOM);

    onViewChange({
      zoom: Number(zoom.toFixed(3)),
      panX: Math.round((viewport.clientWidth - bounds.width * zoom) / 2 - bounds.left * zoom),
      panY: Math.round((viewport.clientHeight - bounds.height * zoom) / 2 - bounds.top * zoom),
    });
  }

  useEffect(() => {
    const waitingForA = Boolean(pdfA && page <= pdfA.numPages && renderedPageA !== page);
    const waitingForB = Boolean(pdfB && page <= pdfB.numPages && renderedPageB !== page);
    if (lastAutoFitPageRef.current === page || waitingForA || waitingForB) return;
    lastAutoFitPageRef.current = page;
    fitView();
  }, [page, pdfA, pdfB, renderedPageA, renderedPageB, sizeA, sizeB, alignment, showA, showB]); // Auto-fit only after a newly selected page has rendered.

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.button !== 1) return;
    if (!alignmentLocked && !event.shiftKey && event.button === 0) return;
    panRef.current = {
      x: event.clientX,
      y: event.clientY,
      startPanX: view.panX,
      startPanY: view.panY,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updatePan(event: React.PointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    if (!pan) return;
    onViewChange({
      ...view,
      panX: Math.round(pan.startPanX + event.clientX - pan.x),
      panY: Math.round(pan.startPanY + event.clientY - pan.y),
    });
  }

  function stopPan() {
    panRef.current = null;
    setIsPanning(false);
  }

  function handleWheelZoom(event: React.WheelEvent<HTMLDivElement>) {
    if (!pdfA && !pdfB) return;
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const nextZoom = clamp(view.zoom * zoomFactor, MIN_VIEW_ZOOM, MAX_VIEW_ZOOM);
    const stageX = (pointerX - view.panX) / view.zoom;
    const stageY = (pointerY - view.panY) / view.zoom;

    onViewChange({
      panX: Math.round(pointerX - stageX * nextZoom),
      panY: Math.round(pointerY - stageY * nextZoom),
      zoom: Number(nextZoom.toFixed(3)),
    });
  }

  const motionClass = reducedMotion ? 'viewer-stage viewer-stage--static' : 'viewer-stage';

  return (
    <section id="comparison-viewer" className="viewer-shell" tabIndex={-1} aria-labelledby="viewer-title">
      <div className="viewer-header">
        <div className="viewer-header__primary">
          <h2 id="viewer-title">Comparison view</h2>
          <p>
            {activePositionName ? (
              <>
                <strong>{activePositionName}</strong>
                {isDirty ? <span className="dirty-tag">modified</span> : null}
              </>
            ) : (
              'Unsaved alignment'
            )}
          </p>
        </div>
        <div className="viewer-status-group">
          <span className="viewer-status">
            {isRendering ? <span className="status-dot" /> : null}
            {isRendering
              ? 'Rendering'
              : effectiveMode === 'blink'
              ? blinkOn
                ? 'Showing B'
                : 'Showing A'
              : effectiveMode === 'a-only'
              ? 'Showing A only'
              : effectiveMode === 'b-only'
              ? 'Showing B only'
              : 'Ready'}
          </span>
          <span className={alignmentLocked ? 'viewer-status locked' : 'viewer-status'}>
            {alignmentLocked ? <Lock size={13} /> : null}
            {alignmentLocked ? 'Locked' : 'Editable'}
          </span>
          {currentReview?.reviewed ? (
            <span className="viewer-status is-reviewed">
              <CheckCircle2 size={13} /> Reviewed
            </span>
          ) : null}
          {currentReview?.flagged ? (
            <span className="viewer-status is-flagged">
              <Flag size={13} /> Flagged
            </span>
          ) : null}
          <span className="viewer-status">{Math.round(view.zoom * 100)}%</span>
        </div>
      </div>

      <div className="viewer-tools" aria-label="View controls">
        <button type="button" className="viewer-tool" onClick={() => fitView()} disabled={isEmpty}>
          <Maximize2 size={15} /> Fit page
        </button>
        <button type="button" className="viewer-tool" onClick={() => fitView(true)} disabled={isEmpty}>
          <ScanLine size={15} /> Fit width
        </button>
        <span className="viewer-tools__divider" aria-hidden="true" />
        <button
          type="button"
          className="viewer-tool viewer-tool--icon"
          onClick={() => onViewChange({ ...view, zoom: Number(clamp(view.zoom - 0.1, MIN_VIEW_ZOOM, MAX_VIEW_ZOOM).toFixed(3)) })}
          disabled={isEmpty || view.zoom <= MIN_VIEW_ZOOM}
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          className="viewer-tool viewer-tool--icon"
          onClick={() => onViewChange({ ...view, zoom: Number(clamp(view.zoom + 0.1, MIN_VIEW_ZOOM, MAX_VIEW_ZOOM).toFixed(3)) })}
          disabled={isEmpty || view.zoom >= MAX_VIEW_ZOOM}
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="page-banners" role="status">
        {pageMissingA ? <span className="page-banner">PDF A has no page {page}</span> : null}
        {pageMissingB ? <span className="page-banner">PDF B has no page {page}</span> : null}
        {statusMessage ? <span className="page-banner is-info">{statusMessage}</span> : null}
      </div>

      <div
        ref={viewportRef}
        className={isPanning ? 'viewer-viewport is-panning' : 'viewer-viewport'}
        tabIndex={0}
        aria-label="PDF comparison canvas. Use the mouse wheel to zoom. Drag the overlay to align it, or hold Shift while dragging to pan."
        onWheel={handleWheelZoom}
        onPointerDown={startPan}
        onPointerMove={updatePan}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
      >
        <div
          className={motionClass}
          style={{
            width: stageSize.width,
            height: stageSize.height,
            transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`,
          }}
        >
          <canvas
            ref={canvasARef}
            className="pdf-layer pdf-layer--a"
            style={{ opacity: showA ? 1 : 0 }}
            aria-label="PDF A canvas"
          />
          <canvas
            ref={canvasBRef}
            className={alignmentLocked ? 'pdf-layer pdf-layer--b is-locked' : 'pdf-layer pdf-layer--b'}
            style={{
              opacity: showB ? bOpacity : 0,
              transform: `translate(${alignment.offsetX}px, ${alignment.offsetY}px) scale(${alignment.scale}) rotate(${alignment.rotation}deg)`,
            }}
            aria-label="PDF B canvas"
            onPointerDown={(event) => {
              if (!pdfB || !showB || alignmentLocked || event.shiftKey || event.button !== 0) return;
              dragRef.current = {
                x: event.clientX,
                y: event.clientY,
                startX: alignment.offsetX,
                startY: alignment.offsetY,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
              event.stopPropagation();
              event.preventDefault();
            }}
            onPointerMove={(event) => {
              const drag = dragRef.current;
              if (!drag) return;
              onAlignmentChange({
                ...alignment,
                offsetX: Math.round(drag.startX + (event.clientX - drag.x) / view.zoom),
                offsetY: Math.round(drag.startY + (event.clientY - drag.y) / view.zoom),
              });
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              dragRef.current = null;
              event.stopPropagation();
            }}
            onPointerCancel={(event) => {
              dragRef.current = null;
              event.stopPropagation();
            }}
          />

          {isEmpty ? (
            <div className="empty-state">
              <strong>Upload two PDFs to compare.</strong>
              <span>Files are rendered locally in your browser. Nothing is uploaded.</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="viewer-footer">
        <span style={{ '--legend-color': colors.a } as React.CSSProperties}>PDF A</span>
        <span style={{ '--legend-color': colors.b } as React.CSSProperties}>PDF B</span>
        <span className="viewer-footer__hint">Shift + drag to pan</span>
      </div>

      <span className="sr-only" aria-live="polite">
        {statusMessage}
      </span>

      {renderError ? <p className="error-text viewer-error">{renderError}</p> : null}
      <p className="sr-only">
        PDF A has {pageCountA ?? 0} pages. PDF B has {pageCountB ?? 0} pages. Viewing page {page}.
      </p>
    </section>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function copyCanvas(source: HTMLCanvasElement, target: HTMLCanvasElement, size: CanvasSize): void {
  target.width = source.width;
  target.height = source.height;
  target.style.width = `${size.width}px`;
  target.style.height = `${size.height}px`;
  const context = target.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

function getVisibleBounds(
  sizeA: CanvasSize,
  sizeB: CanvasSize,
  alignment: Alignment,
  showA: boolean,
  showB: boolean,
): { left: number; top: number; width: number; height: number } | null {
  const points: Array<{ x: number; y: number }> = [];

  if (showA && sizeA.width > 0 && sizeA.height > 0) {
    points.push(
      { x: 96, y: 96 },
      { x: 96 + sizeA.width, y: 96 },
      { x: 96, y: 96 + sizeA.height },
      { x: 96 + sizeA.width, y: 96 + sizeA.height },
    );
  }

  if (showB && sizeB.width > 0 && sizeB.height > 0) {
    const radians = (alignment.rotation * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const originX = 96 + alignment.offsetX;
    const originY = 96 + alignment.offsetY;
    const corners = [
      { x: 0, y: 0 },
      { x: sizeB.width * alignment.scale, y: 0 },
      { x: 0, y: sizeB.height * alignment.scale },
      { x: sizeB.width * alignment.scale, y: sizeB.height * alignment.scale },
    ];
    for (const corner of corners) {
      points.push({
        x: originX + corner.x * cosine - corner.y * sine,
        y: originY + corner.x * sine + corner.y * cosine,
      });
    }
  }

  if (points.length === 0) return null;
  const left = Math.min(...points.map((point) => point.x));
  const top = Math.min(...points.map((point) => point.y));
  const right = Math.max(...points.map((point) => point.x));
  const bottom = Math.max(...points.map((point) => point.y));
  return { left, top, width: right - left, height: bottom - top };
}
