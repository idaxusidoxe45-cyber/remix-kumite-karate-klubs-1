import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function JapaneseBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsDesktop(isFinePointer);

    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (e.clientX / innerWidth - 0.5) * 20,
        y: (e.clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-red-600/10 blur-2xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#3a2520]/10 blur-2xl" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {/* Parallax floating ink and leaf particles */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"
        animate={{
          x: mousePosition.x * 1.5,
          y: mousePosition.y * 1.5,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#3a2520]/10 blur-3xl"
        animate={{
          x: mousePosition.x * -1,
          y: mousePosition.y * -1,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 30 }}
      />

      {/* Floating Japanese Maple Leaves / Petals */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-[#c83832] rounded-full opacity-40 blur-[0.5px]"
          initial={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.8 + 0.5,
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, (i % 2 === 0 ? 25 : -25), 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}
