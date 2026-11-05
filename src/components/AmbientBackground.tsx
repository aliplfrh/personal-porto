import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import './AmbientBackground.css';

export default function AmbientBackground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || reduceMotion || paused) return;

    const desktop = window.matchMedia('(min-width: 769px) and (pointer: fine)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      scene.style.transform = `translate3d(0, ${desktop.matches ? -64 * progress : 0}px, 0)`;
    };

    const onScroll = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(update);
    };

    const onVisibility = () => {
      scene.dataset.hidden = String(document.hidden);
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        onScroll();
      }
    };

    update();
    onVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    desktop.addEventListener('change', onScroll);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktop.removeEventListener('change', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduceMotion, paused]);

  if (reduceMotion) return null;

  return (
    <>
      <div
        ref={sceneRef}
        className={`ambient-scene${paused ? ' is-paused' : ''}`}
        aria-hidden="true"
      >
        <div className="ambient-light" />
        <div className="ambient-grid-light" />
      </div>
      <button
        type="button"
        className="motion-toggle"
        aria-label={paused ? 'Resume background motion' : 'Pause background motion'}
        title={paused ? 'Resume background motion' : 'Pause background motion'}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </>
  );
}
