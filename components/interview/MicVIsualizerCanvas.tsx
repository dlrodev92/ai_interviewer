'use client';

import { useRef, useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface MicVisualizerProps {
  active: boolean;
  audioData?: Uint8Array | null;
  color?: string;
}

export default function MicVisualizerCanvas({
  active,
  audioData = null,
  color = '#4ADE80', // Default green color
}: MicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    if (!active) {
      // Clear canvas when not active
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    let animationId: number;
    let start = Date.now();

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Convert color string to RGB components
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 74, g: 222, b: 128 }; // Default to green if invalid
    };

    const colorRgb = hexToRgb(color);

    const draw = () => {
      const now = Date.now();
      const elapsed = (now - start) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Determine wave amplitude based on audioData if available
      let amplitude = 1;
      if (audioData && audioData.length > 0) {
        // Calculate average amplitude from audio data
        const sum = audioData.reduce((acc, val) => acc + val, 0);
        amplitude = sum / audioData.length / 255; // Normalize between 0 and 1
        amplitude = 0.2 + amplitude * 0.8; // Scale to make it more visible (min 0.2, max 1.0)
      }

      // Draw ripple waves
      for (let i = 0; i < 3; i++) {
        const baseRadius = 20 + ((elapsed * 20 + i * 15) % 60);
        const radius = baseRadius * amplitude;
        const alpha = 1 - radius / 80;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw mic icon in center
      if (showIcon) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(centerX, centerY);

        // Draw a simple mic icon if SVG not loaded
        const iconSize = 10;
        ctx.beginPath();
        ctx.arc(0, -iconSize / 3, iconSize / 2, 0, Math.PI * 2);
        ctx.fillRect(-iconSize / 4, -iconSize / 3, iconSize / 2, iconSize);
        ctx.beginPath();
        ctx.arc(0, (iconSize * 2) / 3, iconSize / 3, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [canvasRef, active, audioData, color]);

  return (
    <div className="relative w-20 h-20">
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className="rounded-full bg-zinc-900 absolute top-0 left-0"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Mic
          className={`w-5 h-5 ${active ? 'text-green-400' : 'text-zinc-500'}`}
        />
      </div>
    </div>
  );
}
