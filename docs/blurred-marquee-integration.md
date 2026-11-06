# Blurred marquee integration (creative tools)

The supplied registry component (`blurred-marquee.tsx` — InfiniteSlider + ProgressiveBlur)
is adapted, not copied verbatim, because this codebase has no Tailwind or shadcn
runtime. The `@/components/ui/...` and `@/lib/utils` import conventions it expects
are already wired in `vite.config.ts` and `tsconfig.app.json`.

## Files

- `src/components/ui/blurred-marquee.tsx`: marquee (InfiniteSlider), progressive
  edge blur (ProgressiveBlur), logo item with mono wordmark fallback, exported as
  `BlurredMarquee` / default.
- `src/components/ui/blurred-marquee.css`: the component's styles, prefixed `bm-`.
- `src/lib/utils.ts`: minimal `cn` class joiner (no clsx dependency added).
- `src/pages/About.tsx`: renders the marquee between the stats row
  (Projects in portfolio / Creative tools / Organisation experiences) and the
  "Experience & education" heading.

## Deviations from the supplied component

- `motion/react` imports run against the already-installed `framer-motion`
  (same API surface; no second animation library added).
- `react-use-measure` is replaced by a local ResizeObserver hook using
  `useEffect`, so server rendering (the node test runner) stays warning-free.
- Tailwind utility classes are replaced by the `bm-*` CSS classes; the monochrome
  treatment (`grayscale + invert`) keeps each mark's internal contrast while
  reading on the black background.
- Two rows instead of one: the first scrolls rightwards, the second leftwards,
  running the same tools rotated half a list so identical logos never stack.
- The slider measures its own width and the width of one repeat unit, then clones
  that unit until the row overflows (`ceil((width + gap) / period) + 1` copies).
  The loop travels exactly one period, so the strip is covered at every frame —
  no empty space at either edge regardless of viewport or tool count.
- Motion honours `prefers-reduced-motion` (static rows, no hover speed-up)
  and pauses while the strip is offscreen (`useInView`); hidden tabs pause
  automatically because the loop is rAF-driven.
- Accessibility: copies beyond the first carry `aria-hidden` on their wrapper
  (real `alt` text is preserved), and the entire second row is `aria-hidden` as
  decoration — screen readers hear each tool name exactly once.

## Data

Logos come from `content.tools` (`ToolEntry`: `name`, `iconUrl`), editable in the
admin panel — no hardcoded brand list. Tools without an icon URL render their
name as a Geist Mono wordmark. An empty tools list renders nothing.

## Optional Tailwind / shadcn setup

Not installed. If wanted later: `npm install -D tailwindcss postcss autoprefixer`,
`npx tailwindcss init -p`, add `content: ['./index.html', './src/**/*.{ts,tsx}']`,
and the `@import "tailwindcss";` entry to `src/index.css`; then `npx shadcn@latest
init`. The `bm-*` classes can then be swapped for the original utilities.
