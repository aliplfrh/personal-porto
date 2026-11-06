/**
 * Pure geometry helpers for the halftone wordmark footer.
 *
 * No DOM, no React: these take plain numbers in and return plain numbers out,
 * so they can be unit-tested with `node --test` in this project, which has no
 * test runner and no testing-library.
 */

/** Hex (#rgb / #rrggbb) to [r, g, b] in 0-255, or null for anything else. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * Dot radius for a cell coverage in [0, 1]. Area-true, so a cell at 25%
 * coverage gets a dot of half the radius and a quarter of the area of a full
 * cell, and the tone stays even instead of bulging at the edges.
 */
export function dotRadius(coverage: number, gap: number): number {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.56;
}

/**
 * One spring step for a dot: home pull, pointer push, damping.
 * Returns [x, y, vx, vy]. Away from the pointer a displaced dot always heads
 * home and comes to rest, so the field settles instead of drifting.
 */
export function springStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number,
  px: number, py: number,
  radius: number
): [number, number, number, number] {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (radius > 0 && d2 < radius * radius) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / radius) * 2.6;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.05) * 0.84;
  vy = (vy + (hy - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

/**
 * How far a dot is from home, normalised to 0 (home) .. 1 (`span` px away).
 * Used to fade the pointer response in and out.
 */
export function displacement(x: number, y: number, hx: number, hy: number, span: number): number {
  const d = Math.hypot(x - hx, y - hy);
  return span > 0 ? Math.min(1, d / span) : 0;
}

/** Average alpha of the 3x3 sub-samples of one grid cell, in [0, 1]. */
export function cellCoverage(img: Uint8ClampedArray, width: number, gx: number, gy: number, gap: number): number {
  let sum = 0;
  for (let sy = 0; sy < 3; sy++) {
    for (let sx = 0; sx < 3; sx++) {
      const x = Math.min(width - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
      const y = Math.min(img.length / 4 / width - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
      sum += img[(y * width + x) * 4 + 3];
    }
  }
  return sum / (9 * 255);
}
