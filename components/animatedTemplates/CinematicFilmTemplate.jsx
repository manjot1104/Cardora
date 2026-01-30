'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleLayer, { PARTICLE_TYPES } from '@/components/cinematic/ParticleLayer';
import { 
  DecorativeBorder, 
  FloralFrame, 
  GoldenPattern, 
  OrnamentalDivider, 
  SparkleEffect,
  ElegantFrame 
} from '@/components/cinematic/DecorativeElements';

/**
 * CinematicFilmTemplate
 * 
 * Premium auto-play cinematic wedding invitation.
 * Feels like a luxury wedding teaser film - NO SCROLLING, AUTO-PLAY ONLY.
 */
export default function CinematicFilmTemplate({ data }) {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Enable native scrolling
    containerRef.current.style.overflow = 'auto';
    containerRef.current.style.overflowX = 'hidden';
    document.body.style.overflow = '';

    // Optional: Initialize auto-scroll controller (disabled by default, user can enable if needed)
    // For now, we'll just enable manual scrolling
    const container = containerRef.current;

    return () => {
      document.body.style.overflow = '';
    };
  }, [reducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black relative"
      style={{ 
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >
      {/* SCENE 1: HERO (Mandap) */}
      <section 
        data-scene-id="hero"
        className="h-screen relative overflow-hidden"
      >
        {/* Background with Ken Burns Effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: reducedMotion ? 1 : [1, 1.15],
          }}
          transition={{
            duration: reducedMotion ? 0 : 25,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            backgroundImage: `url(${data.backgroundImage || '/images/wedding-backgrounds/opulent-mandap-indoor.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70" />
        
        {/* Warm Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-transparent to-amber-900/40" />
        
        {/* Golden Pattern Overlay */}
        <GoldenPattern />
        
        {/* Floating Petals - More Count */}
        <ParticleLayer 
          type={PARTICLE_TYPES.PETAL} 
          count={reducedMotion ? 15 : 40} 
          intensity="high"
        />
        
        {/* Sparkle Effect */}
        <SparkleEffect count={30} />
        
        {/* Decorative Border */}
        <DecorativeBorder color="#FFD700" />
        
        {/* Floral Frame */}
        <FloralFrame intensity="medium" />
        
        {/* Content with Elegant Frame */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <ElegantFrame className="p-8 md:p-12" borderColor="#FFD700">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center relative z-10"
            >
              <motion.h1 
                className="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
                }}
              >
                {groomName} & {brideName}
              </motion.h1>
              
              <OrnamentalDivider className="mb-6" color="#FFD700" />
              
              <motion.p 
                className="text-xl md:text-2xl text-amber-100 mb-3 font-light tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Are getting married
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl text-amber-200 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {weddingDate}
              </motion.p>
            </motion.div>
          </ElegantFrame>
        </div>
      </section>

      {/* SCENE 2: OUR STORY */}
      <section 
        data-scene-id="story"
        className="h-screen relative flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-ivory-50 to-amber-50">
          {/* Light Particles (Golden Dust) */}
          <ParticleLayer 
            type={PARTICLE_TYPES.LIGHT} 
            count={reducedMotion ? 20 : 50} 
            intensity="medium"
          />
          
          {/* Golden Pattern */}
          <GoldenPattern />
        </div>
        
        {/* Decorative Border */}
        <DecorativeBorder color="#D4AF37" />
        
        {/* Sparkle Effect */}
        <SparkleEffect count={25} />
        
        <div className="relative z-10 max-w-4xl text-center">
          <ElegantFrame className="p-8 md:p-12 mb-8" borderColor="#D4AF37">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-7xl font-serif text-amber-900 mb-8"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Our Story
            </motion.h2>
          </ElegantFrame>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.5, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ElegantFrame className="p-6 md:p-10" borderColor="#D4AF37">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
              </p>
            </ElegantFrame>
          </motion.div>
        </div>
      </section>

      {/* SCENE 3: WEDDING CEREMONY DETAILS */}
      <section 
        data-scene-id="details"
        className="h-screen relative flex flex-col items-center justify-center px-6 py-20"
      >
        {/* Couple Photo Background with Low Opacity */}
        {data.couplePhoto && (
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.couplePhoto})`,
              opacity: 0.7,
              zIndex: 0,
            }}
            animate={{
              scale: reducedMotion ? 1 : [1, 1.05],
            }}
            transition={{
              duration: reducedMotion ? 0 : 20,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/90 via-white/90 to-amber-50/90" style={{ zIndex: 1 }}>
          {/* Golden Particle Shimmer - More Count */}
          <ParticleLayer 
            type={PARTICLE_TYPES.DUST} 
            count={reducedMotion ? 25 : 50} 
            intensity="medium"
          />
          
          {/* Golden Pattern */}
          <GoldenPattern />
        </div>
        
        {/* Decorative Border */}
        <DecorativeBorder color="#D4AF37" />
        
        {/* Sparkle Effect */}
        <SparkleEffect count={30} />
        
        {/* Floating Petals */}
        <ParticleLayer 
          type={PARTICLE_TYPES.PETAL} 
          count={reducedMotion ? 10 : 25} 
          intensity="medium"
        />
        
        <div className="relative z-10 max-w-3xl text-center">
          <ElegantFrame className="p-6 md:p-10 mb-12" borderColor="#D4AF37">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-7xl font-serif text-amber-900"
            >
              Wedding Ceremony
            </motion.h2>
          </ElegantFrame>
          
          <div className="space-y-10">
            {/* Venue */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.5, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ElegantFrame className="p-6 md:p-8" borderColor="#D4AF37">
                <motion.div 
                  className="text-5xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8, type: 'spring', stiffness: 300, damping: 15 }}
                >
                  📍
                </motion.div>
                <div className="text-2xl md:text-3xl text-gray-800 font-medium">
                  {venue}
                </div>
              </ElegantFrame>
            </motion.div>
            
            {/* Ornamental Divider */}
            <OrnamentalDivider className="my-8" color="#D4AF37" />
            
            {/* Time */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ElegantFrame className="p-6 md:p-8" borderColor="#D4AF37">
                <motion.div 
                  className="text-5xl mb-4"
                  initial={{ scale: 0, rotate: 180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.8, type: 'spring', stiffness: 300, damping: 15 }}
                >
                  🕕
                </motion.div>
                <div className="text-2xl md:text-3xl text-gray-800 font-medium">
                  {data.weddingTime || '6:00 PM onwards'}
                </div>
              </ElegantFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SCENE 4: MAP / LOCATION */}
      <section 
        data-scene-id="map"
        className="h-screen relative flex flex-col items-center justify-center px-6 py-20"
      >
        {/* Couple Photo Background with Low Opacity */}
        {data.couplePhoto && (
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.couplePhoto})`,
              opacity: 0.7,
              zIndex: 0,
            }}
            animate={{
              scale: reducedMotion ? 1 : [1, 1.05],
            }}
            transition={{
              duration: reducedMotion ? 0 : 20,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/90 via-white/90 to-amber-50/90" style={{ zIndex: 1 }}>
          {/* Golden Particle Shimmer */}
          <ParticleLayer 
            type={PARTICLE_TYPES.DUST} 
            count={reducedMotion ? 20 : 40} 
            intensity="medium"
          />
          
          {/* Golden Pattern */}
          <GoldenPattern />
        </div>
        
        {/* Decorative Border */}
        <DecorativeBorder color="#D4AF37" />
        
        {/* Sparkle Effect */}
        <SparkleEffect count={25} />
        
        <div className="relative z-10 max-w-4xl w-full text-center">
          <ElegantFrame className="p-6 md:p-10 mb-8" borderColor="#D4AF37">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-7xl font-serif text-amber-900 mb-6"
            >
              Location
            </motion.h2>
          </ElegantFrame>
          
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.5, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl mb-6"
          >
            {venue ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl text-gray-800 font-medium"
          >
            <span className="text-2xl mr-2">📍</span>
            {venue || 'Venue TBA'}
          </motion.div>
        </div>
      </section>

      {/* SCENE 5: RSVP / CTA */}
      <section 
        data-scene-id="rsvp"
        className="h-screen relative flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700">
          {/* Floating Light Orbs - More Count */}
          <ParticleLayer 
            type={PARTICLE_TYPES.LIGHT} 
            count={reducedMotion ? 30 : 60} 
            intensity="high"
          />
          
          {/* Golden Pattern */}
          <GoldenPattern />
        </div>
        
        {/* Decorative Border */}
        <DecorativeBorder color="#FFFFFF" />
        
        {/* Sparkle Effect */}
        <SparkleEffect count={40} />
        
        {/* Floating Petals */}
        <ParticleLayer 
          type={PARTICLE_TYPES.PETAL} 
          count={reducedMotion ? 10 : 25} 
          intensity="medium"
        />
        
        <div className="relative z-10 text-center">
          <ElegantFrame className="p-8 md:p-12 mb-12" borderColor="#FFFFFF">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.3, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl md:text-6xl font-serif text-white"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)',
              }}
            >
              Will you join us?
            </motion.h2>
          </ElegantFrame>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ 
              opacity: 1, 
              scale: [1, 1.02, 1],
            }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ 
              opacity: { delay: 0.6, duration: 1.5 },
              scale: { 
                delay: 0.8,
                duration: 2.5, 
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <ElegantFrame className="inline-block" borderColor="#FFFFFF">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 25px 70px rgba(255, 255, 255, 0.4)',
                }}
                className="px-12 md:px-16 py-5 md:py-6 bg-white text-amber-900 rounded-full text-xl md:text-2xl font-semibold shadow-2xl transition-all relative overflow-hidden"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(255, 255, 255, 0.3)',
                }}
              >
                <span className="relative z-10">Confirm Attendance</span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.button>
            </ElegantFrame>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
