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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = e.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  const hasCounter =
    typeof currentIndex === 'number' &&
    typeof totalCount === 'number' &&
    totalCount > 1;

  return (
    <dialog
      {...dialogProps}
      aria-label={item?.title || 'Attēla priekšskatījums'}
      className="m-auto p-0 w-[calc(100%-1.5rem)] max-w-5xl max-h-[92dvh] bg-[#0a0a0c] text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
    >
      {item && (
        <div
          className="relative flex flex-col items-center justify-center p-4 sm:p-6 max-h-[92dvh]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full flex items-center justify-between gap-4 mb-3">
            <div className="min-h-[28px] flex items-center">
              {hasCounter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-heading font-bold tracking-widest text-slate-200">
                  {currentIndex + 1} / {totalCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Aizvērt attēlu"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-200 hover:text-white rounded-full bg-slate-800/90 hover:bg-[#dc2626] border border-slate-700 transition-colors active:scale-95 cursor-pointer"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="relative w-full flex items-center justify-center min-h-[220px] sm:min-h-[420px]">
            {(!totalCount || totalCount > 1) && (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Iepriekšējais attēls"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-white bg-black/70 hover:bg-[#dc2626] rounded-full border border-white/20 transition-colors active:scale-95 z-20 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-7 h-7" aria-hidden="true" />
              </button>
            )}

            {currentSrc && (
              <div className="relative flex items-center justify-center max-h-[68dvh] max-w-full">
                <img
                  key={item.id}
                  src={currentSrc}
                  alt={item.title || 'Kumite Karate'}
                  decoding="async"
                  className="max-h-[68dvh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 select-none"
                />
              </div>
            )}

            {(!totalCount || totalCount > 1) && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Nākamais attēls"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-white bg-black/70 hover:bg-[#dc2626] rounded-full border border-white/20 transition-colors active:scale-95 z-20 cursor-pointer shadow-lg"
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
