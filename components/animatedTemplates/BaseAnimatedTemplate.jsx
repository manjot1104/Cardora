'use client';

import { useEffect, useRef, useState } from 'react';
import { getBackgroundImageUrl, getImageUrl, getAudioUrl } from '@/lib/imageUtils';

export default function BaseAnimatedTemplate({ data, config, onRSVPClick }) {
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  
  const {
    backgroundImage: configBackgroundImage,
    gradientColors,
    textColor = '#FFFFFF',
    accentColor = '#FFD700',
    showEnvelope = false,
    showFlowers = false,
    showStars = false,
    overlayOpacity = 0.6,
  } = config || {};

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';
  const musicUrl = data.music ? getAudioUrl(data.music) : null;
  
  // Use data.backgroundImage if available, otherwise use config backgroundImage
  const backgroundImage = data.backgroundImage || configBackgroundImage;

  // Handle music playback
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (musicPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, musicUrl]);

  return (
    <div className="min-h-screen relative">
      {/* Hero Section - Background Image */}
      <section className="h-screen flex items-center justify-center relative">
        {/* Background Image */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(backgroundImage),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: gradientColors 
              ? `linear-gradient(to bottom, ${gradientColors.join(', ')})`
              : 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
            opacity: overlayOpacity,
            zIndex: 1,
          }}
        />
        
        {/* Content */}
        <div className="text-center backdrop-blur-md bg-white/10 p-12 rounded-2xl border-2 relative z-10" style={{ borderColor: accentColor }}>
          {showFlowers && <div className="text-4xl mb-4">🌸</div>}
          {showStars && <div className="text-4xl mb-4">✨</div>}
          <h1 className="text-6xl font-serif mb-4 fade-up" style={{ color: textColor }}>
            {groomName} & {brideName}
          </h1>
          <p className="text-2xl mb-2 fade-up" style={{ color: textColor }}>
            Are getting married
          </p>
          <p className="text-xl fade-up" style={{ color: textColor }}>
            {weddingDate}
          </p>
        </div>
      </section>

      {/* Story Section - Background Image */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center relative">
        {/* Background Image */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(backgroundImage),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/80 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20">
          <h2 className="text-5xl font-serif mb-8 fade-up" style={{ color: accentColor }}>
            Our Story
          </h2>
          <p className="max-w-2xl text-lg text-gray-700 leading-relaxed fade-up">
            {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
          </p>
        </div>
      </section>

      {/* Event Details - Couple Photo Background */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 relative">
        {/* Couple Photo Background with Low Opacity */}
        {data.couplePhoto && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(data.couplePhoto),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(to bottom, ${gradientColors?.[1] || '#f0f0f0'}E6, ${gradientColors?.[0] || '#ffffff'}E6)`,
          zIndex: 1,
        }} />
        
        <div className="relative z-10">
          <h2 className="text-5xl font-serif mb-12 fade-up" style={{ color: accentColor, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            Wedding Ceremony
          </h2>
          <div className="space-y-6 fade-up">
            <div className="text-2xl font-semibold" style={{ color: '#1a1a1a', textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)' }}>
              <span className="text-3xl mr-2">📍</span>
              {venue}
            </div>
            <div className="text-2xl font-semibold" style={{ color: '#1a1a1a', textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)' }}>
              <span className="text-3xl mr-2">🕕</span>
              {data.weddingTime || '6:00 PM onwards'}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Couple Photo Background */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 relative">
        {/* Couple Photo Background with Low Opacity */}
        {data.couplePhoto && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(data.couplePhoto),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(to bottom, ${gradientColors?.[1] || '#f0f0f0'}95, ${gradientColors?.[0] || '#ffffff'}95)`,
          zIndex: 1,
        }} />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl">
          <h2 className="text-5xl font-serif mb-8 fade-up" style={{ color: accentColor }}>
            Location
          </h2>
          
          {/* Map Container */}
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl fade-up mb-6">
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
          </div>
          
          <div className="text-xl font-bold fade-up" style={{ color: '#1a1a1a', textShadow: '1px 1px 3px rgba(255, 255, 255, 0.9)' }}>
            <span className="text-2xl mr-2">📍</span>
            {venue || 'Venue TBA'}
          </div>
        </div>
      </section>

      {/* RSVP Section - Couple Photo Background */}
      <section className="h-screen flex flex-col justify-center items-center relative">
        {/* Couple Photo Background with Low Opacity */}
        {data.couplePhoto && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(data.couplePhoto),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: gradientColors?.[0] || '#f0f0f0',
            opacity: 0.85,
            zIndex: 1,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-serif mb-8 fade-up" style={{ color: accentColor }}>
            Will you join us?
          </h2>
          <button 
            onClick={onRSVPClick}
            className="px-12 py-4 rounded-full text-xl font-semibold hover:scale-105 transition-all shadow-xl fade-up cursor-pointer"
            style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
          >
            Confirm Attendance
          </button>
        </div>
      </section>

      {/* CARDORA Watermark - Bottom Right */}
      <div 
        className="fixed bottom-20 right-6 z-40 pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontWeight: 700,
          fontSize: '20px',
          letterSpacing: '2px',
          color: textColor || '#FFFFFF',
          opacity: 0.6,
        }}
      >
        CARDORA
      </div>

      {/* Website Name - Bottom Center */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <p 
          className="text-xs opacity-70 font-serif italic"
          style={{ 
            color: textColor || '#FFFFFF',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          cardoradigital.ca
        </p>
      </div>
    </div>
  );
}
