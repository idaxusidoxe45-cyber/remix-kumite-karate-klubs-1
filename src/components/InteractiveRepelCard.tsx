import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface InteractiveRepelCardProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxShift?: number;
  maxRotate?: number;
}

export default function InteractiveRepelCard({
  children,
  className = '',
  onClick,
  maxShift = 14,
  maxRotate = 6,
}: InteractiveRepelCardProps) {
  const [isDesktopHover, setIsDesktopHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktopHover(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktopHover(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.4 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-maxShift, maxShift], [maxRotate, -maxRotate]);
  const rotateY = useTransform(x, [-maxShift, maxShift], [-maxRotate, maxRotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktopHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(-normX * maxShift);
    mouseY.set(-normY * maxShift);
  };

  const handleMouseLeave = () => {
    if (!isDesktopHover) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!isDesktopHover) {
    return (
      <div
        onClick={onClick}
        className={`${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`will-change-transform ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
