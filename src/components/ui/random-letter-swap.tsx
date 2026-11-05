// src/components/ui/random-letter-swap.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('');
const SYMBOLS = '0123456789!@#$%&*+=<>'.split('');

const DEFAULT_TRANSITION: Transition = { type: 'spring', duration: 0.6, bounce: 0 };

export interface RandomLetterSwapProps {
  /** The text that is displayed, and that every slot resolves back to. */
  label: string;
  className?: string;
  /** Seconds of extra delay each successive character waits before shuffling. */
  staggerDuration?: number;
  /** framer-motion transition applied to the final character's pop-in. */
  transition?: Transition;
}

const pick = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];

/**
 * One character slot. `runId > 0` starts a scramble; `runId === 0` is idle or
 * leave, and instantly restores the source character with no transition.
 */
const SwapSlot: React.FC<{
  source: string;
  index: number;
  runId: number;
  staggerMs: number;
  scrambleMs: number;
  transition: Transition;
}> = ({ source, index, runId, staggerMs, scrambleMs, transition }) => {
  // Characters scramble against peers of their own case; whitespace and
  // non-ASCII characters are never touched.
  const pool = useMemo(() => {
    if (/[A-Z]/.test(source)) return [...UPPERCASE, ...SYMBOLS];
    if (/[a-z]/.test(source)) return [...LOWERCASE, ...SYMBOLS];
    if (SYMBOLS.includes(source)) return SYMBOLS;
    return null;
  }, [source]);

  const [current, setCurrent] = useState(source);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!pool) return;
    if (runId === 0) {
      setCurrent(source);
      setSettled(false);
      return;
    }

    let intervalId: number | null = null;
    // A re-trigger can arrive while a slot is still showing its settled
    // character; drop that state so this run scrambles from scratch.
    setCurrent(source);
    setSettled(false);
    const startAt = window.setTimeout(() => {
      setCurrent(pick(pool));
      intervalId = window.setInterval(() => setCurrent(pick(pool)), 45);
    }, index * staggerMs);

    const settleAt = window.setTimeout(() => {
      if (intervalId !== null) window.clearInterval(intervalId);
      setCurrent(source);
      setSettled(true);
    }, index * staggerMs + scrambleMs);

    return () => {
      window.clearTimeout(startAt);
      window.clearTimeout(settleAt);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [runId, pool, index, staggerMs, scrambleMs, source]);

  // The settled character re-enters with the supplied timing; the scramble
  // itself is instant so the noise never reads as laggy.
  if (settled) {
    return (
      <motion.span
        className="letter-swap-char"
        key={`settled-${runId}`}
        initial={{ opacity: 0.25, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
      >
        {source}
      </motion.span>
    );
  }
  return <span className="letter-swap-char">{current}</span>;
};

export function RandomLetterSwap({
  label,
  className,
  staggerDuration = 0.03,
  transition = DEFAULT_TRANSITION,
}: RandomLetterSwapProps) {
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [runId, setRunId] = useState(0);

  // Every hover/focus starts a fresh cascade; leaving resets any slots still
  // shuffling so the link never ends mid-noise.
  useEffect(() => {
    if (hovering) setRunId((id) => id + 1);
    else setRunId(0);
  }, [hovering]);

  const characters = useMemo(() => Array.from(label), [label]);
  const staggerMs = Math.max(0, staggerDuration) * 1000;
  const scrambleMs = 320;

  // Without motion the label must render exactly as it always did — no dimmed
  // or half-scrambled state from an animation that was skipped.
  if (reduceMotion) {
    return <span className={className}>{label}</span>;
  }

  return (
    <span
      className={`letter-swap${className ? ` ${className}` : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* Real text for assistive tech while the visible layers scramble. */}
      <span className="sr-only">{label}</span>

      {/* Keeps the final dimensions so no layout shift happens mid-scramble. */}
      <span className="letter-swap-ghost" aria-hidden="true">
        {label}
      </span>

      <span className="letter-swap-face" aria-hidden="true">
        {characters.map((char, index) => (
          <SwapSlot
            key={index}
            source={char}
            index={index}
            runId={runId}
            staggerMs={staggerMs}
            scrambleMs={scrambleMs}
            transition={transition}
          />
        ))}
      </span>
    </span>
  );
}

export default RandomLetterSwap;
