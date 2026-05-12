import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  oscillationOffset: number;
  oscillationSpeed: number;
}

const COLORS = [
  'rgba(255, 182, 193, 0.4)', // Light Pink
  'rgba(255, 105, 180, 0.3)', // Hot Pink
  'rgba(255, 218, 185, 0.4)', // Peach
  'rgba(255, 228, 225, 0.5)', // Misty Rose
  'rgba(250, 218, 94, 0.3)',  // Yellow (Guayacan)
  'rgba(238, 130, 238, 0.4)'  // Violet / Jacaranda
];

export default function FallingFlowers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const petals: Petal[] = [];
    const NUM_PETALS = 40;

    for (let i = 0; i < NUM_PETALS; i++) {
      petals.push(createPetal(width, height, true));
    }

    let wind = 0;
    let targetWind = 0;
    let lastMouseX = -1;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0 && lastMouseX !== -1) {
        const dx = e.clientX - lastMouseX;
        const velocity = dx / dt;
        // Apply wind based on mouse velocity
        targetWind += velocity * 4;
        // Cap max wind
        targetWind = Math.max(-12, Math.min(12, targetWind));
      }
      lastMouseX = e.clientX;
      lastTime = now;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Wind decays naturally back to 0 (calm)
      targetWind *= 0.95;
      wind += (targetWind - wind) * 0.1;
      
      // Reset tracking to prevent sudden jumps after hovering out
      if (Date.now() - lastTime > 100) {
        lastMouseX = -1;
      }

      petals.forEach(p => {
        // Physics update
        p.x += p.vx + wind + Math.sin(p.oscillationOffset) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.oscillationOffset += p.oscillationSpeed;

        // Reset if it flows out of the screen bounds
        if (p.y > height + 20 || p.x > width + 50 || p.x < -50) {
          Object.assign(p, createPetal(width, height, false));
        }

        // Watercolor drawing logic
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        ctx.beginPath();
        // Drawing an organic petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 2);
        ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
        
        ctx.fillStyle = p.color;
        
        // Watercolor blur effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        
        // Composite mode for blending colors like watercolors
        ctx.globalCompositeOperation = 'multiply';
        
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}

function createPetal(width: number, height: number, initial: boolean): Petal {
  return {
    x: Math.random() * width,
    y: initial ? Math.random() * height : -20 - Math.random() * 50,
    size: Math.random() * 6 + 4, // 4 to 10
    vx: (Math.random() - 0.5) * 1,
    vy: Math.random() * 1.0 + 0.5, // 0.5 to 1.5 falling speed
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    oscillationOffset: Math.random() * Math.PI * 2,
    oscillationSpeed: Math.random() * 0.03 + 0.01
  };
}
