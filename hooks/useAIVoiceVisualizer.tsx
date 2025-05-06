'use client';

import { useEffect, useRef } from 'react';

export function useAIVoiceVisualizer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean = false,
  color: string = '#10b981'
) {
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Parse color to RGB
    let r = 16, g = 185, b = 129; // Default green color
    if (color.startsWith('#') && color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
    
    // Set initial dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Circle configuration
    const circles: {
      radius: number;
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      alpha: number;
      growSpeed: number;
    }[] = [];
    
    // Initialize circles
    const maxCircles = isActive ? 15 : 5;
    for (let i = 0; i < maxCircles; i++) {
      circles.push({
        radius: Math.random() * 5 + 3,
        x: Math.random() * width,
        y: Math.random() * height,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2, 
        alpha: Math.random() * 0.5 + 0.2,
        growSpeed: Math.random() * 0.2 + 0.1
      });
    }
    
    // Animation time tracking
    let time = 0;
    
    // Draw function
    const draw = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw connection lines
      if (circles.length > 1) {
        ctx.beginPath();
        
        // Connect all circles with curved paths
        for (let i = 0; i < circles.length - 1; i++) {
          const current = circles[i];
          const next = circles[i + 1];
          
          // Calculate control points for curve
          const cpX = (current.x + next.x) / 2;
          const cpY = current.y + Math.sin(time * 3 + i * 0.5) * 20;
          
          if (i === 0) {
            ctx.moveTo(current.x, current.y);
          }
          
          ctx.quadraticCurveTo(cpX, cpY, next.x, next.y);
        }
        
        // Style the path
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw and update circles
      circles.forEach((circle, index) => {
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${circle.alpha})`;
        ctx.fill();
        
        // Update circle position
        circle.x += circle.speedX * (isActive ? 1 : 0.3);
        circle.y += circle.speedY * (isActive ? 1 : 0.3);
        
        // Bounce off walls
        if (circle.x - circle.radius < 0 || circle.x + circle.radius > width) {
          circle.speedX = -circle.speedX;
        }
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > height) {
          circle.speedY = -circle.speedY;
        }
        
        // Grow/shrink radius with sine wave
        if (isActive) {
          circle.radius = 3 + Math.sin(time * circle.growSpeed * 5) * 5;
        } else {
          circle.radius = 3 + Math.sin(time * circle.growSpeed) * 2;
        }
        
        // Keep within bounds
        circle.x = Math.max(circle.radius, Math.min(width - circle.radius, circle.x));
        circle.y = Math.max(circle.radius, Math.min(height - circle.radius, circle.y));
      });
      
      // Draw center waveform
      ctx.beginPath();
      
      const centerY = height / 2;
      const amplitude = isActive ? 30 : 10;
      const frequency = 0.05;
      
      ctx.moveTo(0, centerY);
      for (let x = 0; x < width; x += 5) {
        const y = centerY + Math.sin(x * frequency + time * 2) * amplitude * 
                  (isActive ? (0.5 + Math.sin(time * 3) * 0.5) : 0.2);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef, isActive, color]);
}
