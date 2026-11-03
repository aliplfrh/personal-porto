import { useEffect, useRef } from 'react';
import './AmbientBackground.css';

interface Orb {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };
    window.addEventListener('mousemove', onMouse);

    const count = Math.min(7, Math.max(4, Math.floor(w / 320)));
    const orbs: Orb[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 180 + Math.random() * 260,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: 0.05 + Math.random() * 0.06,
      hue: i % 2 === 0 ? 0 : 220,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      const mx = (mouseRef.current.x - 0.5) * 40;
      const my = (mouseRef.current.y - 0.5) * 40;

      // Soft drifting monochrome orbs (white + faint cool blue, low alpha)
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;

        const breathe = 1 + Math.sin(t * 0.0004 + o.r) * 0.08;
        const px = o.x + mx * o.alpha * 10;
        const py = o.y + my * o.alpha * 10;
        const g = ctx.createRadialGradient(px, py, 0, px, py, o.r * breathe);
        const sat = o.hue === 0 ? '255,255,255' : '160,180,255';
        g.addColorStop(0, `rgba(${sat},${o.alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(px - o.r * breathe, py - o.r * breathe, o.r * breathe * 2, o.r * breathe * 2);
      }

      // Faint mouse-following glow
      const gx = mouseRef.current.x * w;
      const gy = mouseRef.current.y * h;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 220);
      glow.addColorStop(0, 'rgba(255,255,255,0.045)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(gx - 220, gy - 220, 440, 440);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(0); // single static frame
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />
      <div className="ambient-grain" aria-hidden="true" />
      <div className="ambient-vignette" aria-hidden="true" />
    </>
  );
}
