import React, { useEffect, useRef } from 'react';
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface DesktopRepelCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxShift?: number;
  maxRotate?: number;
}

/**
 * Desktop-only 3D pointer repel tilt effect loaded lazily so touch/mobile
 * devices never download the Framer Motion bundle.
 */
export default function DesktopRepelCard({
  children,
  className = '',
  onClick,
  maxShift = 14,
  maxRotate = 6,
}: DesktopRepelCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);

  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-maxShift, maxShift], [maxRotate, -maxRotate]);
  const rotateY = useTransform(x, [-maxShift, maxShift], [-maxRotate, maxRotate]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const target = e.currentTarget;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = rectRef.current || target.getBoundingClientRect();
      rectRef.current = rect;
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

      mouseX.set(-normX * maxShift);
      mouseY.set(-normY * maxShift);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.015, y: -2 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        className={`hover:will-change-transform ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
