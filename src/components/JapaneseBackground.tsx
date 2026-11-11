import React, { useEffect, useState, lazy, Suspense } from 'react';

const DesktopJapaneseBackground = lazy(() => import('./DesktopJapaneseBackground'));

function StaticAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20"
      style={{
        backgroundImage:
          'radial-gradient(circle at 12% 8%, rgba(220, 38, 38, 0.14), transparent 40%), radial-gradient(circle at 88% 38%, rgba(58, 37, 32, 0.12), transparent 45%)',
      }}
    />
  );
}

export default function JapaneseBackground() {
  const [enableDesktopMotion, setEnableDesktopMotion] = useState(false);

  useEffect(() => {
    const fineMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      setEnableDesktopMotion(fineMq.matches && !reducedMq.matches);
    };

    updateMode();
    fineMq.addEventListener?.('change', updateMode);
    reducedMq.addEventListener?.('change', updateMode);

    return () => {
      fineMq.removeEventListener?.('change', updateMode);
      reducedMq.removeEventListener?.('change', updateMode);
    };
  }, []);

  if (!enableDesktopMotion) {
    return <StaticAmbientBackground />;
  }

  return (
    <Suspense fallback={<StaticAmbientBackground />}>
      <DesktopJapaneseBackground />
    </Suspense>
  );
}
