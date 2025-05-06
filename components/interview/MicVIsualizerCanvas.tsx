'use client';

import { useRef } from 'react';
import { useMicRipple } from '@/hooks/useMicRipple';
import { Mic } from 'lucide-react';

export default function MicVisualizerCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMicRipple(canvasRef, active);

  return (
    <div className="relative w-20 h-20">
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className="rounded-full bg-zinc-900 absolute top-0 left-0"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Mic className="text-green-400 w-5 h-5" />
      </div>
    </div>
  );
}