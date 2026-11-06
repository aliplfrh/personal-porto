# Halftone integration and optional shadcn setup

## Current stack and paths

- Vite 5 + React 18 + strict TypeScript are already installed.
- App components: `src/components/`.
- Reusable UI: `src/components/ui/`, imported as `@/components/ui/...`.
- Global styles and design tokens: `src/index.css`; component styles are colocated `.css` files.
- `@/*` maps to `src/*` in `tsconfig.app.json` and Vite.
- Tailwind and shadcn CLI configuration are **not installed**. The folder/import convention is compatible, but this is not a fully initialized shadcn project.

In a `src/` project, `/components/ui` conventionally means `src/components/ui`, not a second folder at the repository root. Keeping shared primitives here makes registry imports and CLI-generated components predictable, and separates them from page-specific components. The folder already exists.

## Component integration

The supplied React-only canvas component is adapted, not copied verbatim, and is used by the site footer only:

- `src/components/ui/halftone-wordmark.tsx`: canvas field, spring pointer displacement, click shock ring and grain.
- `src/components/ui/halftone/geometry.ts`: pure, tested coverage and spring geometry.
- `src/components/ui/halftone-wordmark-footer.tsx`: footer wrapper retaining the site's existing children, six destinations and `aliplfrh` wordmark. No new back-to-top button or sample links.

The homepage hero remains the original bento layout (`src/components/Hero.tsx`), so the halftone wordmark appears only at the bottom of the page. Footer content still comes from the existing `useSiteContent` provider. No new provider, store, image, font download or animation dependency is needed. Internal canvas state lives in the effect/ref lifecycle, not React state per frame.

The footer wordmark fills the width and crops at the bottom edge, as supplied. A narrow viewport keeps the same crop with a shorter canvas. Pointer effects are static for touch/reduced-motion, offscreen and hidden tabs; resize and font readiness recalculate the canvas.

## Optional Tailwind v4 + shadcn installation

These are instructions, **not changes already applied**. Perform them on a branch and review generated CSS carefully: Tailwind preflight and shadcn tokens can alter this site's established monochrome styling.

1. Install Tailwind and its Vite plugin (PowerShell uses `.cmd` here):

   ```powershell
   npm.cmd install -D tailwindcss @tailwindcss/vite
   ```

   Check peer compatibility with the existing Vite 5 version. If npm reports a conflict, select a compatible plugin release or upgrade Vite in a separate, tested change; do not force-install mismatched peers.

2. In `vite.config.ts`, retain the current alias/server settings and add:

   ```ts
   import tailwindcss from '@tailwindcss/vite';
   // In the existing config:
   // plugins: [react(), tailwindcss()],
   ```

3. Add `@import "tailwindcss";` at the beginning of `src/index.css`. **Do not replace the existing stylesheet**. Review preflight effects on headings, borders, buttons and the footer before continuing.

4. The app and Vite aliases already work. For CLI discovery, also merge this into root `tsconfig.json` without removing its references:

   ```json
   { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
   ```

5. Initialize shadcn in this existing project:

   ```powershell
   npx.cmd shadcn@latest init
   ```

   Configure global CSS as `src/index.css`, `rsc: false`, TypeScript/TSX enabled, and these `components.json` aliases:

   ```json
   {
     "components": "@/components",
     "ui": "@/components/ui",
     "utils": "@/lib/utils",
     "lib": "@/lib",
     "hooks": "@/hooks"
   }
   ```

   Review changes to global color/font tokens so Manrope/Geist Mono and the current palette remain intact. Do not overwrite custom components when prompted.

6. Optional smoke test: `npx.cmd shadcn@latest add button`. This generates a primitive; it does not need to be added to the footer.

For a separate **new** project instead, scaffold with `npx.cmd shadcn@latest init -t vite` and choose React + TypeScript. TypeScript installation is unnecessary here; for a plain React project it would require `npm.cmd install -D typescript @types/react @types/react-dom @types/node`, TSX file migration and a Vite-compatible tsconfig.

## Verification commands

```powershell
node --test tests/*.test.mjs
npx.cmd tsc --noEmit -p tsconfig.app.json
npx.cmd tsc --noEmit -p tsconfig.node.json
npm.cmd run lint
npm.cmd run build
```

Setup reference: https://ui.shadcn.com/docs/installation/vite
