import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { Eye, EyeOff, Pause, Palette, Play, ZoomIn } from 'lucide-react';
import type { CompareMode, LayerColors, ViewTransform } from '../lib/types';

type OverlayControlsProps = {
  mode: CompareMode;
  opacity: number;
  colors: LayerColors;
  view: ViewTransform;
  blinkRate: number;
  blinkPaused: boolean;
  holdView: 'a' | 'b' | null;
  disabled?: boolean;
  onModeChange: (mode: CompareMode) => void;
  onOpacityChange: (opacity: number) => void;
  onColorsChange: (colors: LayerColors) => void;
  onViewChange: (view: ViewTransform) => void;
  onBlinkRateChange: (rate: number) => void;
  onBlinkPausedChange: (paused: boolean) => void;
  onHoldViewChange: (value: 'a' | 'b' | null) => void;
  onResetView: () => void;
};

const modes: Array<[CompareMode, string]> = [
  ['overlay', 'Overlay'],
  ['a-only', 'A only'],
  ['b-only', 'B only'],
  ['blink', 'Blink'],
];

const blinkRates: Array<[string, number]> = [
  ['Slow', 1100],
  ['Standard', 700],
  ['Fast', 350],
];

export function OverlayControls({
  mode,
  opacity,
  colors,
  view,
  blinkRate,
  blinkPaused,
  holdView,
  disabled,
  onModeChange,
  onOpacityChange,
  onColorsChange,
  onViewChange,
  onBlinkRateChange,
  onBlinkPausedChange,
  onHoldViewChange,
  onResetView,
}: OverlayControlsProps) {
  const holdCancelledRef = useRef(false);

  function startHold(value: 'a' | 'b', event: PointerEvent<HTMLButtonElement>) {
    holdCancelledRef.current = false;
    onHoldViewChange(value);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function endHold(value: 'a' | 'b', event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (holdCancelledRef.current) {
      holdCancelledRef.current = false;
      return;
    }
    if (holdView === value) onHoldViewChange(null);
  }

  function cancelHold() {
    holdCancelledRef.current = true;
    onHoldViewChange(null);
  }

  function startKeyboardHold(value: 'a' | 'b', event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    onHoldViewChange(value);
  }

  function endKeyboardHold(value: 'a' | 'b', event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    if (holdView === value) onHoldViewChange(null);
  }

  return (
    <section className="toolbar-card control-panel">
      <div className="section-heading">
        <h3>Compare</h3>
      </div>

      <div className="segmented-control" aria-label="Compare mode">
        {modes.map(([value, label]) => (
          <button
            type="button"
            key={value}
            disabled={disabled}
            className={mode === value ? 'active' : ''}
            onClick={() => onModeChange(value)}
            aria-pressed={mode === value}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="hold-view-row" aria-label="Momentary view">
        <button
          type="button"
          className={holdView === 'a' ? 'hold-button is-on is-a' : 'hold-button is-a'}
          disabled={disabled}
          aria-pressed={holdView === 'a'}
          onPointerDown={(event) => startHold('a', event)}
          onPointerUp={(event) => endHold('a', event)}
          onPointerCancel={cancelHold}
          onKeyDown={(event) => startKeyboardHold('a', event)}
          onKeyUp={(event) => endKeyboardHold('a', event)}
          onBlur={cancelHold}
          onPointerLeave={(event) => {
            if (holdView === 'a') endHold('a', event);
          }}
        >
          <Eye size={14} /> Hold A
        </button>
        <button
          type="button"
          className={holdView === 'b' ? 'hold-button is-on is-b' : 'hold-button is-b'}
          disabled={disabled}
          aria-pressed={holdView === 'b'}
          onPointerDown={(event) => startHold('b', event)}
          onPointerUp={(event) => endHold('b', event)}
          onPointerCancel={cancelHold}
          onKeyDown={(event) => startKeyboardHold('b', event)}
          onKeyUp={(event) => endKeyboardHold('b', event)}
          onBlur={cancelHold}
          onPointerLeave={(event) => {
            if (holdView === 'b') endHold('b', event);
          }}
        >
          <EyeOff size={14} /> Hold B
        </button>
      </div>

      <div className="color-grid" aria-label="PDF layer colors">
        <label>
          <span>
            <Palette size={15} />
            PDF A color
          </span>
          <input
            type="color"
            value={colors.a}
            disabled={disabled}
            onChange={(event) => onColorsChange({ ...colors, a: event.target.value })}
            aria-label="PDF A color"
          />
        </label>
        <label>
          <span>
            <Palette size={15} />
            PDF B color
          </span>
          <input
            type="color"
            value={colors.b}
            disabled={disabled}
            onChange={(event) => onColorsChange({ ...colors, b: event.target.value })}
            aria-label="PDF B color"
          />
        </label>
      </div>

      <label className="slider-row">
        <span>Opacity B</span>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          disabled={disabled || mode === 'a-only'}
          onChange={(event) => onOpacityChange(Number(event.target.value))}
          aria-label="PDF B opacity"
        />
        <strong>{opacity}%</strong>
      </label>

      <label className="slider-row">
        <span>
          <ZoomIn size={15} />
          View zoom
        </span>
        <input
          type="range"
          min={25}
          max={400}
          step={5}
          value={Math.round(view.zoom * 100)}
          disabled={disabled}
          onChange={(event) => onViewChange({ ...view, zoom: Number(event.target.value) / 100 })}
          aria-label="View zoom"
        />
        <strong>{Math.round(view.zoom * 100)}%</strong>
      </label>

      <div className="blink-card">
        <div className="blink-card__header">
          <h4>Blink</h4>
          <button
            type="button"
            className={blinkPaused ? 'lock-button compact active' : 'lock-button compact'}
            disabled={disabled}
            onClick={() => onBlinkPausedChange(!blinkPaused)}
            aria-pressed={blinkPaused}
          >
            {blinkPaused ? <Play size={14} /> : <Pause size={14} />}
            {blinkPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="segmented-control segmented-control--compact" aria-label="Blink rate">
          {blinkRates.map(([label, value]) => (
            <button
              type="button"
              key={value}
              disabled={disabled}
              className={blinkRate === value ? 'active' : ''}
              onClick={() => onBlinkRateChange(value)}
              aria-pressed={blinkRate === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="secondary-button compact"
        disabled={disabled}
        onClick={onResetView}
      >
        Reset view
      </button>
    </section>
  );
}
