import { useEffect, useRef } from 'react';
import { cellCoverage, displacement, dotRadius, hexToRgb, springStep } from './halftone/geometry';
import './halftone-wordmark.css';

export interface HalftoneWordmarkProps {
  /** The word set enormous and printed as a field of halftone dots. */
  wordmark?: string;
  /** Distance between dot centres, in CSS px. */
  dotGap?: number;
  /** How far the pointer pushes, in CSS px. */
  radius?: number;
  /** How much of the word hangs past the bottom edge, 0 to 0.6. */
  crop?: number;
  /** Print grain over the dots, 0 to 1. */
  grain?: number;
  /** Pointer and click response. */
  interactive?: boolean;
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string;
  /** Weight of the wordmark. */
  fontWeight?: number;
}

/**
 * One canvas of halftone dots spelling `wordmark`, cropped by the bottom edge.
 *
 * Each dot is sized by how much of the letter covers its cell, so the type
 * keeps its edges at any scale. On a fine pointer the dots part around the
 * cursor on springs, warming in colour as they are pushed off their place, and
 * a click sends a shock ring through the word. Static under
 * prefers-reduced-motion, on touch, and whenever it is off screen or hidden,
 * and it repaints itself when its container resizes.
 *
 * The dots are decorative, so the whole field is aria-hidden and the caller is
 * responsible for a text alternative of the same word.
 */
export default function HalftoneWordmark({
  wordmark = 'aliplfrh',
  dotGap = 6,
  radius = 80,
  crop = 0.18,
  grain = 0.35,
  interactive = true,
  fontFamily,
  fontWeight = 800,
}: HalftoneWordmarkProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const canMove = () => interactive && !motion.matches && pointer.matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let lastFrame = 0;
    let visible = false;
    let alive = true;
    let ring = { x: 0, y: 0, start: -1e5 };
    let dots = new Float32Array(0);
    let ink: [number, number, number] = [163, 163, 163];
    let warm: [number, number, number] = [255, 255, 255];
    let texture: CanvasPattern | null = null;

    const paint = (now: number, simulate: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const age = now - ring.start;
      const ringActive = canMove() && age < 900;
      let moving = false;

      for (let j = 0; j < dots.length; j += 7) {
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        if (canMove() && simulate) {
          if (ringActive) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const distance = Math.hypot(dx, dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(distance - age * 0.9) / 26);
            const force = band * 3.2 * (1 - age / 900);
            vx += (dx / distance) * force;
            vy += (dy / distance) * force;
          }
          [x, y, vx, vy] = springStep(x, y, vx, vy, hx, hy, px, py, Math.max(0, radius));
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }
        const warmth = displacement(x, y, hx, hy, 28);
        ctx.fillStyle = `rgb(${ink.map((channel, index) => Math.round(channel + (warm[index] - channel) * warmth)).join(',')})`;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, Math.PI * 2);
        ctx.fill();
      }

      if (texture && grain > 0) {
        ctx.globalAlpha = Math.min(1, grain) * 0.06;
        ctx.fillStyle = texture;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }
      return moving || ringActive;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden || !canMove()) return;
      // Keep the spring's 60 Hz tuning on high-refresh screens.
      if (now - lastFrame < 1000 / 60 - 1) {
        raf = requestAnimationFrame(loop);
        return;
      }
      lastFrame = now;
      if (paint(now, true)) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf && alive && visible && !document.hidden && canMove()) raf = requestAnimationFrame(loop);
    };
    const sleep = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      px = py = -1e5;
      ring.start = -1e5;
    };

    const layout = () => {
      if (!alive) return;
      sleep();
      const rect = field.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const styles = getComputedStyle(field);
      ink = hexToRgb(styles.getPropertyValue('--hwf-ink').trim()) || [163, 163, 163];
      warm = hexToRgb(styles.getPropertyValue('--hwf-warm').trim()) || [255, 255, 255];

      // Set the word once, at a size that fills the width, on a 1x mask.
      const face = fontFamily || styles.fontFamily;
      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const m = mask.getContext('2d', { willReadFrequently: true });
      if (!m) return;
      const word = wordmark || ' ';
      m.font = `${fontWeight} 100px ${face}`;
      const measured = m.measureText(word).width;
      const fit = measured > 0 ? ((width * 1.02) / measured) * 100 : 0;
      if (!fit) return;
      m.font = `${fontWeight} ${fit}px ${face}`;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      m.textBaseline = 'alphabetic';
      m.fillText(word, (width - box.width) / 2, height + cap * Math.max(0, Math.min(0.6, crop)));
      const pixels = m.getImageData(0, 0, width, height).data;

      const gap = Math.max(3, dotGap);
      const next: number[] = [];
      for (let gy = 0; gy < Math.ceil(height / gap); gy++) {
        for (let gx = 0; gx < Math.ceil(width / gap); gx++) {
          const coverage = cellCoverage(pixels, width, gx, gy, gap);
          if (coverage < 0.06) continue;
          const x = gx * gap + gap / 2;
          const y = gy * gap + gap / 2;
          next.push(x, y, 0, 0, x, y, dotRadius(coverage, gap));
        }
      }
      dots = new Float32Array(next);
      paint(performance.now(), false);
      field.dataset.ready = 'true';
    };

    if (grain > 0) {
      const tile = document.createElement('canvas');
      tile.width = tile.height = 128;
      const g = tile.getContext('2d');
      if (g) {
        const pixels = g.createImageData(128, 128);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const value = Math.random() * 255;
          pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
          pixels.data[i + 3] = 128;
        }
        g.putImageData(pixels, 0, 0);
        texture = ctx.createPattern(tile, 'repeat');
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!canMove() || event.pointerType === 'touch') return;
      const rect = field.getBoundingClientRect();
      px = event.clientX - rect.left;
      py = event.clientY - rect.top;
      wake();
    };
    const onLeave = () => {
      px = py = -1e5;
      wake();
    };
    const onDown = (event: PointerEvent) => {
      if (!canMove() || event.pointerType === 'touch' || event.button !== 0) return;
      const rect = field.getBoundingClientRect();
      ring = { x: event.clientX - rect.left, y: event.clientY - rect.top, start: performance.now() };
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) sleep();
      else layout();
    };

    const ro = new ResizeObserver(layout);
    ro.observe(field);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) layout();
      else sleep();
    });
    io.observe(field);
    field.addEventListener('pointermove', onMove);
    field.addEventListener('pointerleave', onLeave);
    field.addEventListener('pointerdown', onDown);
    motion.addEventListener('change', layout);
    pointer.addEventListener('change', layout);
    document.addEventListener('visibilitychange', onVisibility);
    layout();
    // A web font that lands late re-sets the word in its real face.
    void document.fonts.ready.then(() => { if (alive) layout(); });

    return () => {
      alive = false;
      sleep();
      ro.disconnect();
      io.disconnect();
      field.removeEventListener('pointermove', onMove);
      field.removeEventListener('pointerleave', onLeave);
      field.removeEventListener('pointerdown', onDown);
      motion.removeEventListener('change', layout);
      pointer.removeEventListener('change', layout);
      document.removeEventListener('visibilitychange', onVisibility);
      delete field.dataset.ready;
    };
  }, [wordmark, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight]);

  return (
    <div className="hwf-wordmark" ref={fieldRef} aria-hidden="true">
      {/* Shown until the dots are measured, and forever without canvas support. */}
      <span className="hwf-fallback">{wordmark}</span>
      <canvas ref={canvasRef} />
    </div>
  );
}
