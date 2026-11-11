import React, { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';

const MAPLE_LEAVES = [
  { top: '12%', left: '14%', scale: 0.9, duration: 9, delay: 0.4 },
  { top: '28%', left: '82%', scale: 1.1, duration: 11, delay: 1.2 },
  { top: '54%', left: '22%', scale: 0.75, duration: 13, delay: 2.0 },
  { top: '68%', left: '74%', scale: 1.0, duration: 10, delay: 0.8 },
  { top: '82%', left: '38%', scale: 0.85, duration: 12, delay: 1.6 },
  { top: '40%', left: '58%', scale: 0.7, duration: 14, delay: 2.4 },
] as const;

export default function JapaneseBackground() {
  const [enableDesktopMotion, setEnableDesktopMotion] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const primaryX = useSpring(rawX, { stiffness: 50, damping: 30 });
  const primaryY = useSpring(rawY, { stiffness: 50, damping: 30 });
  const secondaryX = useTransform(primaryX, (v) => -v * 0.7);
  const secondaryY = useTransform(primaryY, (v) => -v * 0.7);

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

  useEffect(() => {
    if (!enableDesktopMotion) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        rawX.set((clientX / window.innerWidth - 0.5) * 30);
        rawY.set((clientY / window.innerHeight - 0.5) * 30);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enableDesktopMotion, rawX, rawY]);

  // Lightweight zero-blur gradient accent on mobile / reduced-motion devices
  if (!enableDesktopMotion) {
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

  return (
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
          className="absolute w-3 h-3 bg-[#c83832] rounded-full opacity-40"
          style={{
            top: leaf.top,
            left: leaf.left,
            scale: leaf.scale,
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, i % 2 === 0 ? 25 : -25, 0],
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
  );
}
