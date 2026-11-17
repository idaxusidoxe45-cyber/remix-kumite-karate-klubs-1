import React, { useEffect, useRef } from 'react';

interface InteractiveRepelCardProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxShift?: number;
  maxRotate?: number;
}

/**
 * Zero-dependency GPU-composited card tilt/repel interaction:
 * - On fine-pointer desktop (Windows/macOS), smoothly tilts & repels away from cursor via rAF CSS vars.
 * - On touchscreens (iOS/Android/tablets), provides snappy native active press spring feedback.
 */
export default function InteractiveRepelCard({
  children,
  className = '',
  onClick,
  maxShift = 12,
  maxRotate = 5,
}: InteractiveRepelCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const canTiltRef = useRef(false);

  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      canTiltRef.current = hoverMq.matches && !reducedMq.matches;
    };
    update();
    hoverMq.addEventListener?.('change', update);
    reducedMq.addEventListener?.('change', update);
    return () => {
      hoverMq.removeEventListener?.('change', update);
      reducedMq.removeEventListener?.('change', update);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const resetVars = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTiltRef.current || e.pointerType !== 'mouse') return;
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTiltRef.current || e.pointerType !== 'mouse') return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const el = e.currentTarget;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = rectRef.current || el.getBoundingClientRect();
      rectRef.current = rect;
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

      el.style.setProperty('--tx', `${(-normX * maxShift).toFixed(2)}px`);
      el.style.setProperty('--ty', `${(-normY * maxShift).toFixed(2)}px`);
      el.style.setProperty('--rx', `${(normY * maxRotate).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(-normX * maxRotate).toFixed(2)}deg`);
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    resetVars();
  };

  return (
    <div
      ref={cardRef}
      data-interactive={onClick ? 'true' : undefined}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`repel-card ${onClick ? 'cursor-pointer active:scale-[0.985]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
