'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ParticleLayer
 * 
 * Performance-optimized particle system for floating petals and light particles.
 * Automatically disables on low-end devices.
 */

const PARTICLE_TYPES = {
  PETAL: 'petal',
  LIGHT: 'light',
  DUST: 'dust',
};

export default function ParticleLayer({
  type = PARTICLE_TYPES.PETAL,
  count = 15,
  intensity = 'medium',
  className = '',
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Performance check - disable on low-end devices
    const checkPerformance = () => {
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isLowEnd) {
        setIsEnabled(false);
        return false;
      }
      return true;
    };

    if (!checkPerformance()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Adjust count based on intensity
    const particleCount = intensity === 'low' ? Math.floor(count * 0.5) :
                         intensity === 'high' ? Math.floor(count * 1.5) : count;

    // Initialize particles
    const createParticle = (index) => {
      const baseSpeed = type === PARTICLE_TYPES.PETAL ? 0.3 : 0.2;
      const size = type === PARTICLE_TYPES.PETAL 
        ? 8 + Math.random() * 12 
        : 2 + Math.random() * 4;
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * baseSpeed,
        speedY: type === PARTICLE_TYPES.PETAL 
          ? -0.5 - Math.random() * 0.5 
          : -0.2 - Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.2 + Math.random() * 0.3,
        depth: Math.random(),
        life: Math.random(),
        lifeSpeed: 0.0005 + Math.random() * 0.001,
      };
    };

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => 
      createParticle(i)
    );

    // Animation loop
    const animate = () => {
      if (!isEnabled) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        particle.life += particle.lifeSpeed;
        
        // Reset if out of bounds
        if (particle.y < -particle.size || 
            particle.y > canvas.height + particle.size ||
            particle.x < -particle.size ||
            particle.x > canvas.width + particle.size) {
          particlesRef.current[index] = createParticle(index);
          return;
        }
        
        // Life cycle for opacity variation
        const lifeOpacity = Math.sin(particle.life) * 0.1 + 0.9;
        const finalOpacity = particle.opacity * lifeOpacity;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = finalOpacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        if (type === PARTICLE_TYPES.PETAL) {
          // Draw petal shape
          ctx.fillStyle = '#FFB6C1';
          ctx.beginPath();
          ctx.ellipse(0, 0, particle.size, particle.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Add subtle glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 182, 193, 0.5)';
          ctx.fill();
        } else if (type === PARTICLE_TYPES.LIGHT) {
          // Draw light particle (glowing dot)
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
          gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === PARTICLE_TYPES.DUST) {
          // Draw dust particle
          ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, count, intensity, isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}

export { PARTICLE_TYPES };
