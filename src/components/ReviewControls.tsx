import { Flag, MessageSquareText, RotateCcw } from 'lucide-react';
import type { PageReview } from '../lib/types';

type ReviewControlsProps = {
  page: number;
  maxPages: number;
  reviews: Record<number, PageReview>;
  disabled?: boolean;
  onUpdateReview: (updates: Partial<PageReview>) => void;
};

export function ReviewControls({
  page,
  maxPages,
  reviews,
  disabled,
  onUpdateReview,
}: ReviewControlsProps) {
  const current = reviews[page];
  const reviewedCount = Object.values(reviews).filter((review) => review.reviewed).length;
  const flaggedCount = Object.values(reviews).filter((review) => review.flagged).length;
  const unreviewed = Math.max(0, maxPages - reviewedCount);

  return (
    <section className="toolbar-card review-card">
      <div className="section-heading">
        <h3>Review</h3>
      </div>

      <div className="review-toggles">
        <label className={current?.reviewed ? 'review-toggle is-on is-reviewed' : 'review-toggle is-reviewed'}>
          <input
            type="checkbox"
            checked={Boolean(current?.reviewed)}
            disabled={disabled}
            onChange={(event) => onUpdateReview({ reviewed: event.target.checked })}
          />
          <span className="review-toggle__dot" aria-hidden="true" />
          <span className="review-toggle__label">Reviewed</span>
        </label>
        <label className={current?.flagged ? 'review-toggle is-on is-flagged' : 'review-toggle is-flagged'}>
          <input
            type="checkbox"
            checked={Boolean(current?.flagged)}
            disabled={disabled}
            onChange={(event) => onUpdateReview({ flagged: event.target.checked })}
          />
          <Flag size={15} aria-hidden="true" />
          <span className="review-toggle__label">Flag</span>
        </label>
      </div>

      <label className="review-note">
        <span>
          <MessageSquareText size={15} aria-hidden="true" />
          Note
        </span>
        <textarea
          value={current?.note ?? ''}
          disabled={disabled}
          rows={2}
          placeholder="Short note about this page…"
          maxLength={280}
          onChange={(event) => onUpdateReview({ note: event.target.value })}
        />
      </label>

      <div className="review-summary" aria-live="polite">
        <span className="review-summary__chip is-reviewed">
          <span className="review-summary__count">{reviewedCount}</span>
          <span>reviewed</span>
        </span>
        <span className="review-summary__chip is-flagged">
          <span className="review-summary__count">{flaggedCount}</span>
          <span>flagged</span>
        </span>
        <span className="review-summary__chip is-pending">
          <span className="review-summary__count">{unreviewed}</span>
          <span>remaining</span>
        </span>
      </div>

      {current?.reviewed || current?.flagged || (current?.note && current.note.length > 0) ? (
        <button
          type="button"
          className="secondary-button compact"
          onClick={() => onUpdateReview({ reviewed: false, flagged: false, note: '' })}
        >
          <RotateCcw size={14} /> Clear page review
        </button>
      ) : null}
    </section>
  );
}
