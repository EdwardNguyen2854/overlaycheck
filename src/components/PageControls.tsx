import { ChevronLeft, ChevronRight, ListChecks, ListTodo } from 'lucide-react';
import type { PageReview } from '../lib/types';

type PageControlsProps = {
  page: number;
  maxPages: number;
  pageCountA?: number;
  pageCountB?: number;
  disabled?: boolean;
  currentReview?: PageReview;
  onPageChange: (page: number) => void;
  onJumpToNextUnreviewed: () => void;
  onJumpToNextFlagged: () => void;
};

export function PageControls({
  page,
  maxPages,
  pageCountA,
  pageCountB,
  disabled,
  currentReview,
  onPageChange,
  onJumpToNextUnreviewed,
  onJumpToNextFlagged,
}: PageControlsProps) {
  const mismatch = Boolean(pageCountA && pageCountB && pageCountA !== pageCountB);

  return (
    <section className="toolbar-card page-toolbar">
      <div>
        <h3>Page</h3>
        <p>
          {pageCountA || 0} pages in A / {pageCountB || 0} pages in B
        </p>
      </div>

      <div className="page-controls">
        <button
          type="button"
          className="icon-button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <label className="page-controls__label">
          <span className="sr-only">Current page</span>
          <input
            type="number"
            min={1}
            max={Math.max(1, maxPages)}
            disabled={disabled}
            value={page}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!Number.isNaN(next)) {
                onPageChange(Math.min(Math.max(1, next), Math.max(1, maxPages)));
              }
            }}
          />
        </label>

        <span className="page-total">/ {Math.max(1, maxPages)}</span>

        <button
          type="button"
          className="icon-button"
          disabled={disabled || page >= maxPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="page-review">
        <span
          className={
            currentReview?.reviewed
              ? 'page-review__chip is-reviewed'
              : currentReview?.flagged
              ? 'page-review__chip is-flagged'
              : 'page-review__chip'
          }
        >
          {currentReview?.reviewed
            ? 'Page reviewed'
            : currentReview?.flagged
            ? 'Page flagged'
            : 'Page not reviewed'}
        </span>
        <div className="page-review__buttons">
          <button
            type="button"
            className="secondary-button compact"
            disabled={disabled || maxPages <= 1}
            onClick={onJumpToNextUnreviewed}
          >
            <ListTodo size={14} /> Next unreviewed
          </button>
          <button
            type="button"
            className="secondary-button compact"
            disabled={disabled || maxPages <= 1}
            onClick={onJumpToNextFlagged}
          >
            <ListChecks size={14} /> Next flagged
          </button>
        </div>
      </div>

      {mismatch ? (
        <p className="warning-text">PDFs have different page counts. Out-of-range pages will show as empty.</p>
      ) : null}
    </section>
  );
}