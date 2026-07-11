import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


export type PdfDocument = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>;

export async function loadPdfFromFile(file: File): Promise<PdfDocument> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  return loadingTask.promise;
}

export async function renderPdfPageToCanvas(
  pdf: PdfDocument,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  renderScale: number,
  tintColor?: string,
): Promise<{ width: number; height: number }> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: renderScale });
  const dpr = window.devicePixelRatio || 1;
  const context = canvas.getContext('2d', { alpha: true, willReadFrequently: Boolean(tintColor) });

  if (!context) {
    throw new Error('Canvas 2D context is not available.');
  }

  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, viewport.width, viewport.height);

  const renderTask = page.render({
    canvasContext: context,
    viewport,
    background: 'rgba(255,255,255,0)',
  });
  await renderTask.promise;

  if (tintColor) {
    applyInkTint(canvas, tintColor);
  }

  return { width: viewport.width, height: viewport.height };
}

export function clearCanvas(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 1;
  canvas.height = 1;
  canvas.style.width = '1px';
  canvas.style.height = '1px';
}

function applyInkTint(canvas: HTMLCanvasElement, color: string): void {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context || canvas.width < 2 || canvas.height < 2) return;

  const rgb = hexToRgb(color);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3] / 255;
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    const ink = Math.max(0, Math.min(1, 1 - luminance)) * alpha;

    if (ink < 0.025) {
      data[i + 3] = 0;
      continue;
    }

    data[i] = rgb.r;
    data[i + 1] = rgb.g;
    data[i + 2] = rgb.b;
    data[i + 3] = Math.round(Math.min(1, ink * 1.45) * 255);
  }

  context.putImageData(imageData, 0, 0);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '').trim();
  const expanded = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized.padEnd(6, '0').slice(0, 6);

  const value = Number.parseInt(expanded, 16);

  if (Number.isNaN(value)) {
    return { r: 239, g: 68, b: 68 };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}
