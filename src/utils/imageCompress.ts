export interface CompressedImageResult {
  thumbDataUrl: string;
  fullDataUrl: string;
  thumbBlob: Blob;
  fullBlob: Blob;
  origBytes: number;
  compressedBytes: number;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Neizdevās nolasīt attēlu.'));
    };
    img.src = url;
  });
}

function renderCanvas(img: HTMLImageElement, maxDim: number): HTMLCanvasElement {
  const ratio = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
  const width = Math.max(1, Math.round((img.naturalWidth || maxDim) * ratio));
  const height = Math.max(1, Math.round((img.naturalHeight || maxDim) * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Nav pieejams 2D grafikas konteksts.');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Attēla saspiešana neizdevās.'));
      },
      mime,
      quality
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('DataURL konvertēšanas kļūda.'));
    };
    reader.onerror = () => reject(new Error('DataURL lasīšanas kļūda.'));
    reader.readAsDataURL(blob);
  });
}

async function encodeAdaptive(canvas: HTMLCanvasElement, maxTargetBytes: number): Promise<Blob> {
  const qualities = [0.82, 0.74, 0.65, 0.55];
  for (const mime of ['image/webp', 'image/jpeg']) {
    for (const q of qualities) {
      try {
        const blob = await canvasToBlob(canvas, mime, q);
        if (mime === 'image/webp' && blob.type !== 'image/webp') {
          break; // Browser does not support WebP canvas encoding; fall back to JPEG
        }
        if (blob.size <= maxTargetBytes || q === qualities[qualities.length - 1]) {
          return blob;
        }
      } catch {
        break;
      }
    }
  }
  return canvasToBlob(canvas, 'image/jpeg', 0.65);
}

/**
 * Compresses any uploaded photo into two right-sized WebP assets:
 * - thumb (max 600px, <= ~65 KB) for gallery cards
 * - full (max 1400px, <= ~450 KB) for lightbox modal & Vercel Hobby limits
 */
export async function compressImageForGallery(file: File): Promise<CompressedImageResult> {
  const img = await loadImageFromFile(file);

  const thumbCanvas = renderCanvas(img, 600);
  const fullCanvas = renderCanvas(img, 1400);

  const [thumbBlob, fullBlob] = await Promise.all([
    encodeAdaptive(thumbCanvas, 65 * 1024),
    encodeAdaptive(fullCanvas, 450 * 1024),
  ]);

  const [thumbDataUrl, fullDataUrl] = await Promise.all([
    blobToDataUrl(thumbBlob),
    blobToDataUrl(fullBlob),
  ]);

  return {
    thumbDataUrl,
    fullDataUrl,
    thumbBlob,
    fullBlob,
    origBytes: file.size,
    compressedBytes: thumbBlob.size + fullBlob.size,
  };
}
