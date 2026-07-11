export type CompareMode = 'overlay' | 'a-only' | 'b-only' | 'blink';

export type Alignment = {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
};

export type LayerColors = {
  a: string;
  b: string;
};

export type ViewTransform = {
  panX: number;
  panY: number;
  zoom: number;
};

export type PdfSlot = 'a' | 'b';

export type PositionScope = 'page' | 'global';

export type PositionSet = {
  id: string;
  name: string;
  scope: PositionScope;
  page: number;
  alignment: Alignment;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
};

export type PageReview = {
  reviewed: boolean;
  flagged: boolean;
  note: string;
  updatedAt: number;
};

export type PdfFileRef = {
  name: string;
  size: number;
  lastModified: number;
};

export type ComparisonMetadata = {
  version: 1;
  pairKey: string;
  updatedAt: number;
  activePositionId: string | null;
  positions: PositionSet[];
  reviews: Record<number, PageReview>;
};

export type ReviewSummary = {
  total: number;
  reviewed: number;
  flagged: number;
  unreviewed: number;
};