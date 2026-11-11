import React, { useState, useEffect, lazy, Suspense } from 'react';

const DesktopRepelCard = lazy(() => import('./DesktopRepelCard'));

interface InteractiveRepelCardProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxShift?: number;
  maxRotate?: number;
}

function useIsDesktopHover() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setIsDesktop(hoverMq.matches && !reducedMq.matches);

    hoverMq.addEventListener?.('change', handler);
    reducedMq.addEventListener?.('change', handler);
    return () => {
      hoverMq.removeEventListener?.('change', handler);
      reducedMq.removeEventListener?.('change', handler);
    };
  }, []);

  return isDesktop;
}

export default function InteractiveRepelCard(props: InteractiveRepelCardProps) {
  const isDesktop = useIsDesktopHover();

  const staticFallback = (
    <div
      onClick={props.onClick}
      className={`${props.onClick ? 'cursor-pointer' : ''} ${props.className || ''}`}
    >
      {props.children}
    </div>
  );

  if (!isDesktop) {
    return staticFallback;
  }

  return (
    <Suspense fallback={staticFallback}>
      <DesktopRepelCard
        className={props.className}
        onClick={props.onClick}
        maxShift={props.maxShift}
        maxRotate={props.maxRotate}
      >
        {props.children}
      </DesktopRepelCard>
    </Suspense>
  );
}
