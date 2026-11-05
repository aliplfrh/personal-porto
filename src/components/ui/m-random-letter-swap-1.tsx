// src/components/ui/m-random-letter-swap-1.tsx
//
// Reference demo for this nav pattern, adapted from the Tailwind/shadcn
// snippet to this project's plain-CSS design system:
//   text-muted-foreground / hover:text-foreground → .m-nav, .m-nav-inner
//   flex / gap-8                                  → flex layout via CSS
// Unused by the app (Navbar wires the same primitive into the real pill) —
// kept because it documents the intended API shape and can be previewed
// standalone.
import { RandomLetterSwap } from '@/components/ui/random-letter-swap';

const links = ['About', 'aliplfrh', 'Works'];

export default function RandomLetterSwapNav() {
  return (
    <div className="m-swap-demo">
      <nav className="m-nav">
        {links.map((link) => (
          <RandomLetterSwap
            className="m-nav-item"
            key={link}
            label={link}
            staggerDuration={0.025}
            transition={{ duration: 0.6, type: 'spring' }}
          />
        ))}
      </nav>
    </div>
  );
}
