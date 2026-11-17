import React, { useEffect, useRef, useState } from 'react';

const KUMITE_PARTICLES = [
  { top: '14%', left: '10%', tone: 'red', size: 'w-2.5 h-2.5', duration: '11s', delay: '0s' },
  { top: '26%', left: '86%', tone: 'blue', size: 'w-3 h-3', duration: '13s', delay: '1.2s' },
  { top: '52%', left: '16%', tone: 'blue', size: 'w-2 h-2', duration: '14s', delay: '2.1s' },
  { top: '66%', left: '80%', tone: 'red', size: 'w-2.5 h-2.5', duration: '12s', delay: '0.7s' },
  { top: '82%', left: '34%', tone: 'red', size: 'w-2 h-2', duration: '15s', delay: '1.8s' },
  { top: '42%', left: '62%', tone: 'blue', size: 'w-2 h-2', duration: '12.5s', delay: '2.6s' },
] as const;

/**
 * Lightweight, cross-platform ambient Aka (Red) & Ao (Blue) Sumi-e background accents.
 * Uses pure GPU compositor CSS animations on both mobile and desktop,
 * automatically pauses when the browser tab is hidden, and honors reduced-motion.
 */
export default function JapaneseBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    let rafId: number | null = null;
    const fineMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onMouseMove = (e: MouseEvent) => {
      if (!fineMq.matches || reducedMq.matches || !containerRef.current) return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const px = ((clientX / window.innerWidth - 0.5) * 24).toFixed(1);
        const py = ((clientY / window.innerHeight - 0.5) * 24).toFixed(1);
        containerRef.current.style.setProperty('--bg-px', `${px}px`);
        containerRef.current.style.setProperty('--bg-py', `${py}px`);
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-paused={paused ? 'true' : 'false'}
      className="ambient-layer fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div
        className="ambient-orb-primary absolute -top-24 -left-24 w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full opacity-25 sm:opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.22) 0%, transparent 68%)',
        }}
      />
      <div
        className="ambient-orb-secondary absolute top-1/3 -right-24 w-72 h-72 sm:w-[460px] sm:h-[460px] rounded-full opacity-25 sm:opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 68%)',
        }}
      />

      {KUMITE_PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`ambient-spark absolute ${p.size} rounded-full`}
          style={{
            top: p.top,
            left: p.left,
            backgroundColor: p.tone === 'red' ? 'rgba(220, 38, 38, 0.34)' : 'rgba(37, 99, 235, 0.30)',
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
