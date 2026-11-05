// src/components/Reveal.tsx
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

const OFFSETS: Record<Exclude<Direction, 'fade'>, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
};

interface RevealProps {
  children: React.ReactNode;
  /** Index inside a staggered group. Each step adds `stagger` seconds. */
  delay?: number;
  /** Seconds per step. Raise for slower, more deliberate cascades. */
  stagger?: number;
  /** Travel direction. Keeps the original rise as the default. */
  from?: Direction;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  stagger = 0.08,
  from = 'up',
  amount = 0.2,
  className,
}) => {
  const reduceMotion = useReducedMotion();

  // Without motion the content must render exactly as it always did — never
  // left transparent or shifted because an animation was skipped.
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = from === 'fade' ? { x: 0, y: 0 } : OFFSETS[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        ease: EASE,
        delay: delay * stagger,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
