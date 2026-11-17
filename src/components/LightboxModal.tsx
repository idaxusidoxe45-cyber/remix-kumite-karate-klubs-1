import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { useDialogModal } from '../hooks/useDialogModal';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex?: number;
  totalCount?: number;
  adjacentSrcs?: string[];
}

export default function LightboxModal({
  item,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
  adjacentSrcs,
}: LightboxModalProps) {
  const { dialogProps } = useDialogModal(Boolean(item), onClose);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragContainerRef = useRef<HTMLDivElement | null>(null);

  // Progressive image display state:
  // 1. Immediately renders the cached grid thumbnail (0ms latency, zero ghosting).
  // 2. Preloads the full HD image in background.
  // 3. Upgrades seamlessly to full resolution once loaded.
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const activeItemIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!item) {
      setCurrentSrc('');
      activeItemIdRef.current = null;
      return;
    }

    activeItemIdRef.current = item.id;

    // Instant thumbnail render from browser cache
    const initialSrc = item.image || item.fullImage || '';
    setCurrentSrc(initialSrc);

    const hasDistinctFullImage = Boolean(item.fullImage && item.fullImage !== item.image);
    if (!hasDistinctFullImage) {
      return;
    }

    // Progressive HD upgrade in background
    let isCancelled = false;
    const fullImg = new Image();
    fullImg.src = item.fullImage!;
    fullImg.onload = () => {
      if (!isCancelled && activeItemIdRef.current === item.id) {
        setCurrentSrc(item.fullImage!);
      }
    };
    fullImg.onerror = () => {
      // Keep initialSrc fallback if full image fails to load
    };

    return () => {
      isCancelled = true;
    };
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onNext, onPrev]);

  // Preload adjacent gallery images smoothly when navigating
  useEffect(() => {
    if (!item || !adjacentSrcs?.length) return;
    adjacentSrcs.forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [item, adjacentSrcs]);

  const resetDragTransform = () => {
    const el = dragContainerRef.current;
    if (!el) return;
    el.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out';
    el.style.transform = 'translate3d(0, 0, 0)';
    el.style.opacity = '1';
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    if (dragContainerRef.current) {
      dragContainerRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = e.touches[0];
    const el = dragContainerRef.current;
    if (!start || !touch || !el || e.touches.length !== 1) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) > Math.abs(dy) && (!totalCount || totalCount > 1)) {
      const clampedX = Math.max(-140, Math.min(140, dx));
      const fade = Math.max(0.55, 1 - Math.abs(clampedX) / 320);
      el.style.transform = `translate3d(${clampedX.toFixed(1)}px, 0, 0)`;
      el.style.opacity = fade.toFixed(2);
    } else if (dy > 12 && Math.abs(dy) > Math.abs(dx) * 1.4) {
      const clampedY = Math.min(130, dy * 0.7);
      const fade = Math.max(0.55, 1 - clampedY / 260);
      el.style.transform = `translate3d(0, ${clampedY.toFixed(1)}px, 0)`;
      el.style.opacity = fade.toFixed(2);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = e.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) {
      resetDragTransform();
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (dy > 85 && Math.abs(dy) > Math.abs(dx) * 1.35) {
      resetDragTransform();
      onClose();
      return;
    }

    if ((!totalCount || totalCount > 1) && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      resetDragTransform();
      if (dx < 0) onNext();
      else onPrev();
      return;
    }

    resetDragTransform();
  };

  const hasCounter =
    typeof currentIndex === 'number' &&
    typeof totalCount === 'number' &&
    totalCount > 1;

  return (
    <dialog
      {...dialogProps}
      aria-label={item?.title || 'Attēla priekšskatījums'}
      className="m-auto p-0 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-5xl max-h-[92dvh] bg-[#0a0a0c] text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
    >
      {item && (
        <div
          className="relative flex flex-col items-center justify-center p-3 sm:p-6 max-h-[92dvh]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={resetDragTransform}
        >
          <div className="w-full flex items-center justify-between gap-4 mb-3">
            <div className="min-h-[28px] flex items-center">
              {hasCounter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1e293b] border border-slate-700 text-xs font-heading font-bold tracking-widest text-slate-200">
                  {currentIndex + 1} / {totalCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Aizvērt attēlu"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-200 hover:text-white rounded-full bg-[#1e293b] hover:bg-[#dc2626] border border-slate-700 transition-colors active:scale-95 cursor-pointer"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative w-full flex items-center justify-center min-h-[220px] sm:min-h-[420px] touch-pan-y">
            {(!totalCount || totalCount > 1) && (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Iepriekšējais attēls"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-white bg-black/65 backdrop-blur-sm hover:bg-[#2563eb] rounded-full border border-white/20 transition-colors active:scale-95 z-20 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-7 h-7" aria-hidden="true" />
              </button>
            )}

            {currentSrc && (
              <div
                ref={dragContainerRef}
                className="relative flex items-center justify-center max-h-[68dvh] max-w-full will-change-transform"
              >
                <img
                  key={item.id}
                  src={currentSrc}
                  alt={item.title || 'Kumite Karate'}
                  decoding="async"
                  draggable={false}
                  className="max-h-[68dvh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 select-none animate-fadeIn"
                />
              </div>
            )}

            {(!totalCount || totalCount > 1) && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Nākamais attēls"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-white bg-black/65 backdrop-blur-sm hover:bg-[#dc2626] rounded-full border border-white/20 transition-colors active:scale-95 z-20 cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-7 h-7" aria-hidden="true" />
              </button>
            )}
          </div>

          {(item.caption || item.title) && (
            <p className="text-slate-100 font-heading tracking-wide text-base sm:text-lg font-bold mt-3 text-center px-2">
              {item.caption || item.title}
            </p>
          )}
        </div>
      )}
    </dialog>
  );
}
