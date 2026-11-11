import React, { useState, useEffect, useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';

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
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  return isDesktop;
}

function DesktopRepelCard({
  children,
  className = '',
  onClick,
  maxShift = 14,
  maxRotate = 6,
}: InteractiveRepelCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.4 };
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
    <m.div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
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
  );
}

export default function InteractiveRepelCard(props: InteractiveRepelCardProps) {
  const isDesktop = useIsDesktopHover();

  if (!isDesktop) {
    return (
      <div
        onClick={props.onClick}
        className={`${props.onClick ? 'cursor-pointer' : ''} ${props.className || ''}`}
      >
        {props.children}
      </div>
    );
  }

  return <DesktopRepelCard {...props} />;
}
