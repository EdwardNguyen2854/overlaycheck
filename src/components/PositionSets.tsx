import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Globe,
  Lock,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';
import type { Alignment, PositionScope, PositionSet } from '../lib/types';

type PositionSetsProps = {
  positions: PositionSet[];
  activePositionId: string | null;
  currentPage: number;
  isDirty: boolean;
  alignment: Alignment;
  isAlignmentLocked: boolean;
  disabled?: boolean;
  onApply: (position: PositionSet) => void;
  onSave: (name: string, scope: PositionScope) => void;
  onUpdateActive: () => void;
  onDuplicate: (position: PositionSet) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onSetScope: (id: string, scope: PositionScope) => void;
  onAlignmentChange: (alignment: Alignment) => void;
  onToggleLock: () => void;
  onResetAlignment: () => void;
  onNudge: (axis: 'x' | 'y' | 'scale' | 'rotation', direction: -1 | 1, step: number) => void;
};

type SaveDraft = {
  name: string;
  scope: PositionScope;
};

export function PositionSets({
  positions,
  activePositionId,
  currentPage,
  isDirty,
  alignment,
  isAlignmentLocked,
  disabled,
  onApply,
  onSave,
  onUpdateActive,
  onDuplicate,
  onRename,
  onDelete,
  onSetScope,
  onAlignmentChange,
  onToggleLock,
  onResetAlignment,
  onNudge,
}: PositionSetsProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveDraft, setSaveDraft] = useState<SaveDraft>({ name: '', scope: 'page' });
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const sortedPositions = [...positions].sort((a, b) => {
    if (a.scope !== b.scope) return a.scope === 'global' ? 1 : -1;
    if (a.page !== b.page) return a.page - b.page;
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    if (!saveOpen) return;
    setSaveDraft((current) => ({
      name: current.name || `Position ${positions.length + 1}`,
      scope: current.scope,
    }));
  }, [saveOpen, positions.length]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const alignmentDisabled = disabled || isAlignmentLocked;

  function commitSave() {
    onSave(saveDraft.name, saveDraft.scope);
    setSaveOpen(false);
    setSaveDraft({ name: '', scope: 'page' });
  }

  function startRename(position: PositionSet) {
    setRenamingId(position.id);
    setRenameDraft(position.name);
    setOpenMenuId(null);
  }

  function commitRename() {
    if (!renamingId) return;
    onRename(renamingId, renameDraft);
    setRenamingId(null);
    setRenameDraft('');
  }

  function toggleScope(position: PositionSet) {
    onSetScope(position.id, position.scope === 'global' ? 'page' : 'global');
    setOpenMenuId(null);
  }

  function confirmDelete(position: PositionSet) {
    if (window.confirm(`Delete position “${position.name}”?`)) {
      onDelete(position.id);
    }
    setOpenMenuId(null);
  }

  return (
    <section className="toolbar-card position-card">
      <div className="section-heading">
        <h3>Position sets</h3>
      </div>

      <div className="position-list" role="list">
        {sortedPositions.length === 0 ? (
          <p className="empty-note">No saved positions.</p>
        ) : null}

        {sortedPositions.map((position) => {
          const isActive = position.id === activePositionId;
          const showDirty = isActive && isDirty;
          return (
            <div
              key={position.id}
              role="listitem"
              className={isActive ? 'position-row is-active' : 'position-row'}
            >
              {renamingId === position.id ? (
                <div className="position-row__apply">
                  <input
                    autoFocus
                    type="text"
                    value={renameDraft}
                    aria-label="Rename position"
                    onChange={(event) => setRenameDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitRename();
                      if (event.key === 'Escape') {
                        setRenamingId(null);
                        setRenameDraft('');
                      }
                    }}
                    onBlur={commitRename}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="position-row__apply"
                  onClick={() => onApply(position)}
                  title={`Apply ${position.name}`}
                >
                  <>
                    <span className="position-row__name">{position.name}</span>
                    <span className="position-row__meta">
                      {position.scope === 'global' ? (
                        <span className="badge-chip badge-chip--global">
                          <Globe size={12} /> Global
                        </span>
                      ) : (
                        <span className="badge-chip badge-chip--page">Page {position.page}</span>
                      )}
                      {position.locked ? (
                        <span className="badge-chip badge-chip--lock" aria-label="Locked">
                          <Lock size={12} /> Locked
                        </span>
                      ) : null}
                      {showDirty ? (
                        <span className="badge-chip badge-chip--dirty" aria-label="Unsaved edits">
                          Modified
                        </span>
                      ) : null}
                    </span>
                  </>
                </button>
              )}
              <div className="position-row__menu" ref={openMenuId === position.id ? menuRef : null}>
                <button
                  type="button"
                  className="icon-button icon-button--ghost"
                  aria-label="Position actions"
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === position.id}
                  onClick={() => setOpenMenuId((current) => (current === position.id ? null : position.id))}
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenuId === position.id ? (
                  <div className="menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      onClick={() => startRename(position)}
                    >
                      <Pencil size={14} /> Rename
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      onClick={() => {
                        onDuplicate(position);
                        setOpenMenuId(null);
                      }}
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      onClick={() => toggleScope(position)}
                    >
                      {position.scope === 'global' ? (
                        <>
                          <ChevronDown size={14} /> Limit to page {position.page}
                        </>
                      ) : (
                        <>
                          <ChevronUp size={14} /> Make global
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="menu-item menu-item--danger"
                      onClick={() => confirmDelete(position)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {saveOpen ? (
        <div className="save-form" role="group" aria-label="Save current alignment">
          <label>
            <span>Name</span>
            <input
              type="text"
              value={saveDraft.name}
              placeholder="Title block alignment"
              maxLength={64}
              onChange={(event) =>
                setSaveDraft((current) => ({ ...current, name: event.target.value }))
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitSave();
                if (event.key === 'Escape') setSaveOpen(false);
              }}
            />
          </label>
          <fieldset className="scope-toggle">
            <legend>Apply to</legend>
            <label>
              <input
                type="radio"
                name="scope"
                value="page"
                checked={saveDraft.scope === 'page'}
                onChange={() => setSaveDraft((current) => ({ ...current, scope: 'page' }))}
              />
              Page {currentPage}
            </label>
            <label>
              <input
                type="radio"
                name="scope"
                value="global"
                checked={saveDraft.scope === 'global'}
                onChange={() => setSaveDraft((current) => ({ ...current, scope: 'global' }))}
              />
              All pages
            </label>
          </fieldset>
          <div className="save-form__actions">
            <button type="button" className="secondary-button compact" onClick={() => setSaveOpen(false)}>
              <X size={14} /> Cancel
            </button>
            <button type="button" className="primary-button" onClick={commitSave}>
              <Save size={14} /> Save position
            </button>
          </div>
        </div>
      ) : (
        <div className="button-row">
          <button
            type="button"
            className="primary-button"
            disabled={disabled}
            onClick={() => setSaveOpen(true)}
          >
            <Save size={15} /> Save current alignment
          </button>
          {activePositionId && isDirty ? (
            <button
              type="button"
              className="secondary-button compact"
              disabled={disabled || isAlignmentLocked}
              onClick={onUpdateActive}
            >
              <Check size={14} /> Update
            </button>
          ) : null}
        </div>
      )}

      <div className="alignment-editor">
        <div className="alignment-editor__header">
          <h4>Active alignment</h4>
          <button
            type="button"
            className={isAlignmentLocked ? 'lock-button compact active' : 'lock-button compact'}
            disabled={!activePositionId || disabled}
            onClick={onToggleLock}
            aria-pressed={isAlignmentLocked}
          >
            {isAlignmentLocked ? <Lock size={14} /> : <Unlock size={14} />}
            {isAlignmentLocked ? 'Locked' : 'Lock'}
          </button>
        </div>

        <div className="alignment-grid">
          <NudgeField
            label="X offset"
            unit="px"
            value={alignment.offsetX}
            step={1}
            largeStep={10}
            disabled={alignmentDisabled}
            axis="x"
            onNudge={onNudge}
            onChange={(value) => onAlignmentChange({ ...alignment, offsetX: value })}
          />
          <NudgeField
            label="Y offset"
            unit="px"
            value={alignment.offsetY}
            step={1}
            largeStep={10}
            disabled={alignmentDisabled}
            axis="y"
            onNudge={onNudge}
            onChange={(value) => onAlignmentChange({ ...alignment, offsetY: value })}
          />
          <NudgeField
            label="Scale B"
            unit="×"
            value={alignment.scale}
            step={0.005}
            largeStep={0.05}
            decimals={3}
            disabled={alignmentDisabled}
            axis="scale"
            onNudge={onNudge}
            onChange={(value) => onAlignmentChange({ ...alignment, scale: value })}
          />
          <NudgeField
            label="Rotation"
            unit="°"
            value={alignment.rotation}
            step={0.5}
            largeStep={5}
            decimals={2}
            disabled={alignmentDisabled}
            axis="rotation"
            onNudge={onNudge}
            onChange={(value) => onAlignmentChange({ ...alignment, rotation: value })}
          />
        </div>

        <button
          type="button"
          className="secondary-button compact"
          disabled={alignmentDisabled}
          onClick={onResetAlignment}
        >
          <RotateCcw size={14} /> Reset alignment
        </button>
      </div>

      <button
        type="button"
        className="link-button"
        aria-expanded={showHelp}
        onClick={() => setShowHelp((current) => !current)}
      >
        {showHelp ? 'Hide' : 'Show'} position shortcuts
      </button>
      {showHelp ? (
        <ul className="help-list">
          <li><kbd>[</kbd> / <kbd>]</kbd> switch position set</li>
          <li><kbd>L</kbd> lock or unlock the active set</li>
          <li><kbd>S</kbd> save edits to the active set</li>
          <li><kbd>↑</kbd> / <kbd>↓</kbd> nudge Y by 1px (Shift = 10px)</li>
          <li><kbd>←</kbd> / <kbd>→</kbd> change page</li>
        </ul>
      ) : null}
    </section>
  );
}

type NudgeFieldProps = {
  label: string;
  unit: string;
  value: number;
  step: number;
  largeStep: number;
  decimals?: number;
  disabled?: boolean;
  axis: 'x' | 'y' | 'scale' | 'rotation';
  onNudge: (axis: 'x' | 'y' | 'scale' | 'rotation', direction: -1 | 1, step: number) => void;
  onChange: (value: number) => void;
};

function NudgeField({
  label,
  unit,
  value,
  step,
  largeStep,
  decimals = 0,
  disabled,
  axis,
  onNudge,
  onChange,
}: NudgeFieldProps) {
  const arrows: Array<{ direction: -1 | 1; icon: typeof ArrowUp; large: boolean }> =
    axis === 'x'
      ? [
          { direction: -1, icon: ArrowLeft, large: false },
          { direction: 1, icon: ArrowRight, large: false },
        ]
      : axis === 'y'
      ? [
          { direction: -1, icon: ArrowUp, large: false },
          { direction: 1, icon: ArrowDown, large: false },
        ]
      : [
          { direction: -1, icon: ArrowDown, large: false },
          { direction: 1, icon: ArrowUp, large: false },
        ];

  return (
    <div className={disabled ? 'nudge-field is-disabled' : 'nudge-field'}>
      <div className="nudge-field__header">
        <span className="nudge-field__label">{label}</span>
        <span className="nudge-field__unit">{unit}</span>
      </div>
      <div className="nudge-field__row">
        <div className="nudge-field__buttons">
          {arrows.map(({ direction, icon: Icon, large }) => (
            <button
              key={`${axis}-${direction}-${large ? 'l' : 's'}`}
              type="button"
              className="nudge-button"
              aria-label={`Nudge ${label} ${direction > 0 ? 'increase' : 'decrease'} by ${large ? largeStep : step}${unit}`}
              disabled={disabled}
              onClick={() => onNudge(axis, direction, large ? largeStep : step)}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
        <input
          type="number"
          value={Number(value.toFixed(decimals))}
          step={step}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
        />
      </div>
    </div>
  );
}
