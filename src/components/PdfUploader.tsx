import { FileText, Upload } from 'lucide-react';
import type { PdfSlot } from '../lib/types';

type PdfUploaderProps = {
  slot: PdfSlot;
  title: string;
  fileName?: string;
  pageCount?: number;
  isLoading?: boolean;
  error?: string;
  color: string;
  compact?: boolean;
  onFileSelect: (slot: PdfSlot, file: File) => void;
};

export function PdfUploader({
  slot,
  title,
  fileName,
  pageCount,
  isLoading,
  error,
  color,
  compact = false,
  onFileSelect,
}: PdfUploaderProps) {
  const inputId = `pdf-${slot}-input`;

  return (
    <section className={compact ? 'upload-card upload-card--compact' : 'upload-card'}>
      <div className="upload-card__header">
        <div className="badge" style={{ background: color }}>{slot.toUpperCase()}</div>
        <div>
          <h2>{title}</h2>
          <p>{slot === 'a' ? 'Base layer' : 'Movable overlay'}</p>
        </div>
      </div>

      <label htmlFor={inputId} className="file-drop">
        <Upload size={20} />
          <span>{fileName ? 'Replace' : 'Choose PDF'}</span>
          <input
          id={inputId}
          type="file"
            accept="application/pdf,.pdf"
            aria-label={`${title}: choose a PDF file`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileSelect(slot, file);
            event.target.value = '';
          }}
        />
      </label>

      <div className="file-meta">
        <FileText size={18} />
        <div>
          <strong>{fileName || 'No PDF selected'}</strong>
          <span>
            {isLoading
              ? 'Loading...'
              : pageCount
                ? `${pageCount} page${pageCount === 1 ? '' : 's'}`
                : 'Upload a PDF to start'}
          </span>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
