'use client';

import { motion } from 'framer-motion';

/**
 * DecorativeElements
 * 
 * Premium decorative elements for Canva-style wedding cards
 */

export function DecorativeBorder({ className = '', color = '#FFD700' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 2 }}>
      {/* Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      {/* Bottom Border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.6,
        }}
      />
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-16 h-16 opacity-40" style={{ color }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 opacity-40" style={{ color }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 opacity-40" style={{ color }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 opacity-40" style={{ color }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
        </svg>
      </div>
    </div>
  );
}

export function FloralFrame({ className = '', intensity = 'medium' }) {
  const petalCount = intensity === 'high' ? 12 : intensity === 'low' ? 6 : 8;
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      {[...Array(petalCount)].map((_, i) => {
        const angle = (360 / petalCount) * i;
        const radius = 200;
        const x = 50 + (radius * Math.cos((angle * Math.PI) / 180)) / 10;
        const y = 50 + (radius * Math.sin((angle * Math.PI) / 180)) / 10;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
            animate={{
              rotate: [angle, angle + 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <div className="text-3xl opacity-30">🌸</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function GoldenPattern({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1, opacity: 0.1 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="goldenPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="2" fill="#FFD700" />
            <circle cx="20" cy="20" r="1.5" fill="#FFA500" />
            <circle cx="80" cy="30" r="1" fill="#FFD700" />
            <circle cx="30" cy="80" r="1.5" fill="#FFA500" />
            <circle cx="70" cy="70" r="1" fill="#FFD700" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#goldenPattern)" />
      </svg>
    </div>
  );
}

export function OrnamentalDivider({ className = '', color = '#FFD700' }) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ zIndex: 2 }}>
      <div className="flex items-center w-full max-w-md">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
        <div className="mx-4" style={{ color }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" opacity="0.6">
            <circle cx="50" cy="50" r="5" />
            <path d="M50 20 L50 30 M50 70 L50 80 M20 50 L30 50 M70 50 L80 50" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  );
}

export function SparkleEffect({ count = 20, className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg" />
        </motion.div>
      ))}
    </div>
  );
}

export function ElegantFrame({ children, className = '', borderColor = '#FFD700' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative Frame */}
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          border: `3px solid ${borderColor}`,
          opacity: 0.4,
          boxShadow: `0 0 30px ${borderColor}40, inset 0 0 30px ${borderColor}20`,
        }}
      />
      <div 
        className="absolute inset-2 rounded-2xl"
        style={{
          border: `1px solid ${borderColor}`,
          opacity: 0.6,
        }}
      />
      {children}
    </div>
  );
}
