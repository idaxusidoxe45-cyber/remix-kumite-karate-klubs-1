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

  const springConfig = { damping: 22, stiffness: 280, mass: 0.4 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-maxShift, maxShift], [maxRotate, -maxRotate]);
  const rotateY = useTransform(x, [-maxShift, maxShift], [-maxRotate, maxRotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(-normX * maxShift);
    mouseY.set(-normY * maxShift);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onClick={onClick}
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
      className={`will-change-transform ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
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

