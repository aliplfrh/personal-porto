# Glass Prism hero integration

The registry component (`glass-prism-hero.tsx` — plain WebGL, no dependencies)
replaces the old bento hero. It is adapted, not copied verbatim, because this
codebase has no Tailwind or shadcn runtime. The `@/components/ui/...` import
convention it expects is already wired in `vite.config.ts` and
`tsconfig.app.json`.

## Files

- `src/components/ui/glass-prism-hero.tsx`: the scene — beam, prism, spectrum
  fan over a dot grid, drawn with raw WebGL (shaders, Snell's-law CPU geometry,
  canvas-rendered headline texture). Exported as `GlassPrismHero` / default
  with a `replay()` handle.
- `src/components/ui/glass-prism-hero.css`: the component's styles, prefixed
  `gph-*`.
- `src/components/Hero.tsx`: renders the scene from admin content.
- `src/index.css`: all bento-hero styles removed (`.hero`, `.hero-grid`,
  `.widget`, `.profile-*`, `.social-link`, `.map-*`, `.tech-*`, `.code-*`,
  `.art-*`, `.badge-*`, entrance stagger, world-map animations); `.hero-cta`
  stays — the prism's CTAs reuse it. The body's site-wide texture is now the
  hero's dot grid (20×13, phase-synced via `--dot-phase-y`) instead of the old
  64px square grid.

## Deleted with the bento hero (the screenshot parts)

- `src/components/WorldMap.tsx`, `src/components/Clock.tsx` (map card, WIB
  clock, Malang pill) — hero-only, deleted.
- The hero's inline Tech Stack card, code snippet card, artwork carousel and
  "A" monogram card. `TechStack.tsx` remains in the tree (kept by decision),
  still unreferenced.

## Data mapping (admin-editable, `useSiteContent`)

- `headline` ← `content.hero.greeting` ("Hey, I'm Alief") — drawn into the
  glass and rendered as a real `<h1>` (visually hidden while the canvas shows
  it; becomes visible markup if WebGL is unavailable).
- `eyebrow` ← `content.hero.status` ("Available for work").
- `description` ← `content.hero.bio`.
- `actions` ← View works (`/portofolio`) + Resume (`content.resumeUrl`), using
  the site's own `.hero-cta` monochrome buttons. Social links stay in the
  footer, so nothing is lost by dropping them from the hero.
- `accent` = white, matching the monochrome identity; the spectrum fan itself
  is the scene's one colour moment by design.

## Deviations from the supplied component

- Tailwind utilities replaced by `gph-*` classes; theme tokens map to the
  site's own variables (`--bg-base`, `--text-primary`, `--text-secondary`,
  `--border-subtle`), so the shader reads a pure black stage with white
  foreground via its computed-style colour reader.
- Headline font defaults to Manrope (loaded in `index.html`), not Geist.
- The scroll hint (wheel icon + "Scroll to rotate"/"Scroll up" labels) was
  removed entirely, along with its `scrollHint` prop, refs and `gph-wheel`
  keyframes.
- `(g as any)` casts replaced with a typed `CanvasRenderingContext2D &
  { letterSpacing?: string }`; the listener-removal cast removed.

## Transition to the intro statement

The section is `calc(100svh + 70vh)` tall with a sticky stage. Scrolling
rotates the prism (`SCR * 1.35`) and dims the light (`uFade = 1 - SCR`); the
copy fades out by `SCR 0.625`. The scene itself never fades. Instead the
site-wide background is the same dot grid the scene draws — body background at
20×13 with matched dot size and brightness — and the component syncs its phase
(`--dot-phase-y` on `<html>`, recomputed on resize) to the stage's document
position at the sticky release. When the stage lets go, the dark prism simply
slides up and away while the dot field continues unbroken into the statement
("Im a visual artist based in Indonesia…"), which brightens word by word as it
rises. No fade, no crop, no seam; no scroll is hijacked.

## Accessibility & motion

- `prefers-reduced-motion`: the intro animation, light flicker and source drift
  are skipped; the scene renders settled. Scroll-linked rotation and the
  end-of-runway fade remain (both are 1:1 with user input).
- The canvas is `aria-hidden`; the real `<h1>` carries the headline for screen
  readers. CTAs are real links with visible focus rings.
- No WebGL → static fallback headline, everything still readable.
