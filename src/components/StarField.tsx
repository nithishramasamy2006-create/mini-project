import { useEffect, useRef } from 'react';

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.001,
    }));

    const meteors: { x: number; y: number; opacity: number; length: number; speed: number }[] = [];

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula radial glow
      const g = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.25, 0, canvas.width * 0.5, canvas.height * 0.25, canvas.width * 0.55);
      g.addColorStop(0, 'rgba(124,58,237,0.06)');
      g.addColorStop(0.5, 'rgba(59,130,246,0.03)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const s of stars) {
        const a = (Math.sin(frame * s.speed + s.phase) + 1) * 0.3 + 0.05;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,232,240,${a})`;
        ctx.fill();
      }

      // Meteors
      if (frame % 200 === 0 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
          y: Math.random() * canvas.height * 0.4,
          opacity: 1,
          length: 80 + Math.random() * 100,
          speed: 4 + Math.random() * 4,
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x -= m.speed;
        m.y += m.speed * 0.55;
        m.opacity -= 0.01;
        if (m.opacity <= 0) { meteors.splice(i, 1); continue; }

        const mg = ctx.createLinearGradient(m.x, m.y, m.x + m.length, m.y - m.length * 0.55);
        mg.addColorStop(0, `rgba(255,255,255,${m.opacity})`);
        mg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.length, m.y - m.length * 0.55);
        ctx.strokeStyle = mg;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      frame++;
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', opacity: 0.7,
      }}
    />
  );
}
