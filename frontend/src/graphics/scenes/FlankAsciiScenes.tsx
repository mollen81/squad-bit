import { useEffect, useRef } from 'react';
import type { ThemeMode } from '@/shared/store/usePreferencesStore';

const ASCII_RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function pickEdgeChar(gx: number, gy: number): string {
  const angle = (Math.atan2(gy, gx) * 180) / Math.PI;
  const absAngle = Math.abs(angle);
  if (absAngle < 22.5 || absAngle > 157.5) return '|';
  if (absAngle > 67.5 && absAngle < 112.5) return '-';
  if ((angle > 22.5 && angle < 67.5) || (angle < -112.5 && angle > -157.5)) return '/';
  return '\\';
}

function loadFlankImage(
  basePath: string,
  onLoaded: (img: HTMLImageElement) => void,
  isCancelled: () => boolean
) {
  let extIdx = 0;

  const tryNext = () => {
    if (isCancelled() || extIdx >= IMAGE_EXTENSIONS.length) return;
    const img = new Image();
    const url = `${basePath}${IMAGE_EXTENSIONS[extIdx]}`;
    extIdx++;

    img.onload = () => {
      if (!isCancelled()) onLoaded(img);
    };
    img.onerror = tryNext;
    img.src = url;
  };

  tryNext();
}

function renderStaticAscii(
  canvas: HTMLCanvasElement,
  srcCanvas: HTMLCanvasElement | null,
  width: number,
  height: number,
  theme: ThemeMode
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isDark = theme === 'dark';
  ctx.fillStyle = isDark ? '#0E0E0E' : '#F7F7F7';
  ctx.fillRect(0, 0, width, height);

  if (!srcCanvas) return;

  const cols = Math.max(66, Math.min(104, Math.floor(width / 3.4)));
  const charW = width / cols;
  const charH = charW * 1.56;
  const rows = Math.ceil(height / charH);
  const fontSize = Math.max(5.2, charH * 0.94);

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sCtx) return;

  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;
  const targetAspect = width / height;
  const srcAspect = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  if (targetAspect > srcAspect) {
    cropH = srcW / targetAspect;
    cropY = (srcH - cropH) * 0.35;
  } else {
    cropW = srcH * targetAspect;
    cropX = (srcW - cropW) * 0.5;
  }

  sCtx.drawImage(srcCanvas, cropX, cropY, cropW, cropH, 0, 0, cols, rows);
  const imgData = sCtx.getImageData(0, 0, cols, rows).data;

  const lumMap = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    const idx = i * 4;
    const raw =
      (0.2126 * imgData[idx] + 0.7152 * imgData[idx + 1] + 0.0722 * imgData[idx + 2]) / 255;
    lumMap[i] = Math.max(0, Math.min(1, raw));
  }

  ctx.font = `600 ${fontSize.toFixed(1)}px "IBM Plex Mono", monospace`;
  ctx.textBaseline = 'top';

  const rampMax = ASCII_RAMP.length - 1;

  for (let y = 0; y < rows; y++) {
    const drawY = y * charH;
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const rawLum = lumMap[i];

      let gx = 0;
      let gy = 0;
      if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
        const tl = lumMap[(y - 1) * cols + (x - 1)];
        const tc = lumMap[(y - 1) * cols + x];
        const tr = lumMap[(y - 1) * cols + (x + 1)];
        const ml = lumMap[y * cols + (x - 1)];
        const mr = lumMap[y * cols + (x + 1)];
        const bl = lumMap[(y + 1) * cols + (x - 1)];
        const bc = lumMap[(y + 1) * cols + x];
        const br = lumMap[(y + 1) * cols + (x + 1)];
        gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
        gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      }

      const edgeMag = Math.hypot(gx, gy);

      const density = isDark
        ? Math.min(1, Math.pow(rawLum, 1.05) * 0.95 + edgeMag * 0.34)
        : Math.min(1, Math.pow(1 - rawLum, 1.08) * 0.96 + edgeMag * 0.32);

      if (density < 0.07) continue;

      let char: string;
      if (edgeMag > 0.56 && density > 0.24) {
        char = pickEdgeChar(gx, gy);
      } else {
        const charIdx = Math.min(rampMax, Math.max(1, Math.floor(density * rampMax)));
        char = ASCII_RAMP[charIdx];
      }

      if (isDark) {
        const g = Math.min(235, Math.floor(42 + density * 185));
        const a = Math.min(0.86, 0.22 + density * 0.64);
        ctx.fillStyle = `rgba(${g}, ${g}, ${g}, ${a.toFixed(2)})`;
      } else {
        const g = Math.max(16, Math.floor(175 - density * 155));
        const a = Math.min(0.82, 0.16 + density * 0.66);
        ctx.fillStyle = `rgba(${g}, ${g}, ${g}, ${a.toFixed(2)})`;
      }

      ctx.fillText(char, x * charW, drawY);
    }
  }
}

interface FlankAsciiProps {
  side: 'left' | 'right';
  theme: ThemeMode;
}

function FlankAsciiPanel({ side, theme }: FlankAsciiProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let srcCanvas: HTMLCanvasElement | null = null;

    const redraw = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderStaticAscii(canvas, srcCanvas, width, height, theme);
    };

    const basePath = side === 'left' ? '/flanks/art_left' : '/flanks/art_right';
    loadFlankImage(
      basePath,
      (loadedImg) => {
        const off = document.createElement('canvas');
        off.width = loadedImg.naturalWidth || 480;
        off.height = loadedImg.naturalHeight || 900;
        const octx = off.getContext('2d');
        if (octx) {
          octx.drawImage(loadedImg, 0, 0);
          srcCanvas = off;
          redraw();
        }
      },
      () => isDisposed
    );

    redraw();
    window.addEventListener('resize', redraw, { passive: true });

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', redraw);
    };
  }, [side, theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-[#F7F7F7] dark:bg-[#0E0E0E]"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {side === 'left' ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#F7F7F7] dark:from-[#0E0E0E] to-transparent" />
      ) : (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#F7F7F7] dark:from-[#0E0E0E] to-transparent" />
      )}
    </div>
  );
}

export function LeftBoatAsciiScene({ theme }: { theme: ThemeMode }) {
  return <FlankAsciiPanel side="left" theme={theme} />;
}

export function RightAtgmAsciiScene({ theme }: { theme: ThemeMode }) {
  return <FlankAsciiPanel side="right" theme={theme} />;
}
