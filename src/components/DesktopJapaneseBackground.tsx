import React, { useEffect } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from 'motion/react';

const MAPLE_LEAVES = [
  { top: '12%', left: '14%', scale: 0.9, duration: 10, delay: 0.4 },
  { top: '28%', left: '82%', scale: 1.05, duration: 12, delay: 1.2 },
  { top: '54%', left: '22%', scale: 0.75, duration: 14, delay: 2.0 },
  { top: '68%', left: '74%', scale: 0.95, duration: 11, delay: 0.8 },
  { top: '82%', left: '38%', scale: 0.85, duration: 13, delay: 1.6 },
  { top: '40%', left: '58%', scale: 0.7, duration: 15, delay: 2.4 },
] as const;

/**
 * Desktop-only ambient cursor-reactive glow and floating particles,
 * isolated into a lazy chunk so mobile clients do not load motion/react.
 */
export default function DesktopJapaneseBackground() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const primaryX = useSpring(rawX, { stiffness: 45, damping: 32 });
  const primaryY = useSpring(rawY, { stiffness: 45, damping: 32 });
  const secondaryX = useTransform(primaryX, (v) => -v * 0.7);
  const secondaryY = useTransform(primaryY, (v) => -v * 0.7);

  useEffect(() => {
    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        rawX.set((clientX / window.innerWidth - 0.5) * 28);
        rawY.set((clientY / window.innerHeight - 0.5) * 28);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <m.div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"
          style={{ x: primaryX, y: primaryY }}
        />
        <m.div
          className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#3a2520]/10 blur-3xl"
          style={{ x: secondaryX, y: secondaryY }}
        />

        {MAPLE_LEAVES.map((leaf, i) => (
          <m.div
            key={i}
            className="absolute w-3 h-3 bg-[#c83832] rounded-full opacity-35"
            style={{
              top: leaf.top,
              left: leaf.left,
              scale: leaf.scale,
            }}
            animate={{
              y: [0, 36, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: leaf.delay,
            }}
          />
        ))}
      </div>
    </LazyMotion>
  );
}
