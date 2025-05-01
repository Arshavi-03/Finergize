// File: components/ui/SparklesBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

class Particle {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speed: number = 0;
  opacity: number = 0;
  color: string = '';

  constructor(canvasWidth: number, canvasHeight: number) {
    this.reset(canvasWidth, canvasHeight);
  }
  
  reset(canvasWidth: number, canvasHeight: number): void {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    this.speed = Math.random() * 0.2 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 150}, ${Math.random() * 50 + 200}, ${this.opacity})`;
  }
  
  update(canvasHeight: number, canvasWidth: number): void {
    this.y -= this.speed;
    
    // Reset particle when it goes off screen
    if (this.y < 0) {
      this.y = canvasHeight;
      this.x = Math.random() * canvasWidth;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const SparklesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        
        // Re-initialize particles on resize
        initParticles();
      }
    };
    
    // Set up the canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(150, Math.floor(canvasWidth * canvasHeight / 10000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvasWidth, canvasHeight));
      }
    };
    
    initParticles();
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      particles.forEach(particle => {
        particle.update(canvasHeight, canvasWidth);
        particle.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-10"
      />
    </div>
  );
};

export default SparklesBackground;