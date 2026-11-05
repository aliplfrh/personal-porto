import { useEffect } from 'react';

/**
 * Publishes document scroll position as CSS custom properties on <html>:
 *   --scroll-y        viewport offset in px
 *   --scroll-progress 0 at the top, 1 at the bottom of the document
 *
 * Writing a variable keeps scroll-linked motion off React's render path — no
 * component re-renders per frame — and lets plain CSS consume the value with
 * transform/opacity only, so the work stays on the compositor.
 */
export default function useScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const write = () => {
      frame = 0;
      const range = root.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      root.style.setProperty('--scroll-y', `${y}px`);
      root.style.setProperty(
        '--scroll-progress',
        range > 0 ? String(Math.min(1, Math.max(0, y / range))) : '0'
      );
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into one write per animation frame.
      if (!frame && !document.hidden) frame = requestAnimationFrame(write);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      } else {
        onScroll();
      }
    };

    write();
    onVisibility();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      root.style.removeProperty('--scroll-y');
      root.style.removeProperty('--scroll-progress');
    };
  }, []);
}
