'use client';

import { useEffect } from 'react';

export function useMicRipple(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;

    let animationId: number;
    let start = Date.now();
    const icon = new Image();
    icon.src = '/mic-icon.svg';

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const draw = () => {
      const now = Date.now();
      const elapsed = (now - start) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Draw ripple waves
      for (let i = 0; i < 3; i++) {
        const radius = 20 + ((elapsed * 20 + i * 15) % 60);
        const alpha = 1 - radius / 80;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(74, 222, 128, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw mic icon in center (20x20 size)
      ctx.save();
      ctx.translate(centerX - 10, centerY - 10); // center the image
      ctx.drawImage(icon, 0, 0, 20, 20);
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    icon.onload = () => {
      draw(); // wait for image to load
    };

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [canvasRef, active]);
}
