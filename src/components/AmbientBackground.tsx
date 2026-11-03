import { useEffect, useRef } from 'react';
import './AmbientBackground.css';

export default function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const update = () => {
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      glow.style.opacity = '1';
      if (!frame) frame = requestAnimationFrame(update);
    };

    const hide = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return <div ref={glowRef} className="ambient-pointer-glow" aria-hidden="true" />;
}
