'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = ['·', '○', '◦', '•', '◉', '●'];
    let frame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      ctx.fillStyle = 'oklch(0.12 0.01 60)';
      ctx.font = '16px var(--font-jetbrains-mono), monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.35;

      for (let i = 0; i < 180; i += 15) {
        for (let j = 0; j < 360; j += 20) {
          const theta = (i * Math.PI) / 180;
          const phi = (j * Math.PI) / 180 + frame * 0.005;
          
          const x = radius * Math.sin(theta) * Math.cos(phi);
          const y = radius * Math.sin(theta) * Math.sin(phi);
          const z = radius * Math.cos(theta);
          
          const scale = (z + radius) / (2 * radius);
          const opacity = scale * 0.3 + 0.1;
          
          ctx.globalAlpha = opacity;
          const charIndex = Math.floor((scale * chars.length)) % chars.length;
          ctx.fillText(chars[charIndex], centerX + x, centerY + y);
        }
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.4 }}
    />
  );
}
