import type {
  ComparisonMetadata,
  PageReview,
  PdfFileRef,
  PositionSet,
} from './types';

const STORAGE_NAMESPACE = 'overlaycheck';
const STORAGE_VERSION = 1;

type Envelope = {
  version: number;
  pairKey: string;
  updatedAt: number;
  metadata: ComparisonMetadata;
};

type StorageAdapter = {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
};

function memoryAdapter(): StorageAdapter {
  const store = new Map<string, string>();
  return {
    read(key) {
      return store.get(key) ?? null;
    },
    write(key, value) {
      store.set(key, value);
    },
    remove(key) {
      store.delete(key);
    },
  };
}

function browserAdapter(): StorageAdapter {
  try {
    const probeKey = `${STORAGE_NAMESPACE}:probe`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return {
      read(key) {
        return window.localStorage.getItem(key);
      },
      write(key, value) {
        window.localStorage.setItem(key, value);
      },
      remove(key) {
        window.localStorage.removeItem(key);
      },
    };
  } catch {
    return memoryAdapter();
  }
}

let adapter: StorageAdapter = browserAdapter();

export function setStorageAdapter(next: StorageAdapter) {
  adapter = next;
}

function storageKey(pairKey: string) {
  return `${STORAGE_NAMESPACE}:pair:${pairKey}`;
}

export function buildPairKey(fileA?: PdfFileRef | null, fileB?: PdfFileRef | null): string {
  if (!fileA || !fileB) return '';
  return [fileA.name, fileA.size, fileA.lastModified, fileB.name, fileB.size, fileB.lastModified]
    .map((value) => String(value))
    .join('|');
}

export function buildFileRef(file: File): PdfFileRef {
  return {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
  };
}

export function createEmptyMetadata(pairKey: string): ComparisonMetadata {
  return {
    version: STORAGE_VERSION,
    pairKey,
    updatedAt: Date.now(),
    activePositionId: null,
    positions: [],
    reviews: {},
  };
}

export function loadMetadata(pairKey: string): ComparisonMetadata | null {
  if (!pairKey) return null;
  const raw = adapter.read(storageKey(pairKey));
  if (!raw) return null;

  try {
    const envelope = JSON.parse(raw) as Envelope;
    if (envelope.version !== STORAGE_VERSION || envelope.pairKey !== pairKey) {
      return null;
    }
    return envelope.metadata;
  } catch {
    return null;
  }
}

export function saveMetadata(metadata: ComparisonMetadata) {
  if (!metadata.pairKey) return;
  const payload: Envelope = {
    version: STORAGE_VERSION,
    pairKey: metadata.pairKey,
    updatedAt: Date.now(),
    metadata,
  };

  try {
    adapter.write(storageKey(metadata.pairKey), JSON.stringify(payload));
  } catch {
    // Storage may be full or disabled. Metadata is best-effort.
  }
}

export function clearMetadata(pairKey: string) {
  if (!pairKey) return;
  adapter.remove(storageKey(pairKey));
}

export function generatePositionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pos_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function findApplicablePosition(
  positions: PositionSet[],
  page: number,
  activeId: string | null,
): { position: PositionSet | null; index: number } {
  if (positions.length === 0) return { position: null, index: -1 };

  const activeIndex = activeId ? positions.findIndex((item) => item.id === activeId) : -1;
  if (activeIndex >= 0) {
    const active = positions[activeIndex];
    if (active.scope === 'global' || active.page === page) {
      return { position: active, index: activeIndex };
    }
  }

  for (let i = 0; i < positions.length; i += 1) {
    const candidate = positions[i];
    if (candidate.scope === 'page' && candidate.page === page) {
      return { position: candidate, index: i };
    }
  }

  for (let i = 0; i < positions.length; i += 1) {
    const candidate = positions[i];
    if (candidate.scope === 'global') {
      return { position: candidate, index: i };
    }
  }

  return { position: null, index: -1 };
}

export function ensurePageReview(reviews: Record<number, PageReview>, page: number): PageReview {
  return reviews[page] ?? { reviewed: false, flagged: false, note: '', updatedAt: Date.now() };
}

export function hasReviewContent(review: PageReview | undefined): boolean {
  if (!review) return false;
  return review.reviewed || review.flagged || review.note.trim().length > 0;
}