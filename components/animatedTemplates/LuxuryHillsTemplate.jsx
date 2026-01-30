'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LuxuryHillsTemplate({ data }) {
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Envelope opening animation
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from(envelopeRef.current, {
      scale: 0.8,
      rotation: -5,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
    })
      .to(flapRef.current, {
        rotationX: -180,
        transformOrigin: 'top center',
        duration: 1,
        ease: 'power2.in',
      }, '-=0.3')
      .from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.5');
  }, []);

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* Hero Section with Envelope */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 parallax-bg bg-cover bg-center"
          style={{
            backgroundImage: `url(${data.backgroundImage || '/images/wedding-backgrounds/sunset-palace-wedding.png'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Envelope Opening Animation */}
        <div ref={envelopeRef} className="relative z-10">
          <div className="relative w-80 h-96 perspective-1000">
            {/* Envelope */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg shadow-2xl border-4 border-amber-400">
              {/* Flap */}
              <div 
                ref={flapRef}
                className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-300 to-amber-400 rounded-t-lg origin-top border-b-4 border-amber-500"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                  💌
                </div>
              </div>
              
              {/* Content */}
              <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-serif text-amber-900 mb-2 fade-up">
                  {groomName} & {brideName}
                </h1>
                <p className="text-xl text-amber-800 mb-4 fade-up">Are getting married</p>
                <p className="text-lg text-amber-700 fade-up">{weddingDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-2xl">👇</div>
        </div>
      </section>

      {/* Story Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center bg-white/80 backdrop-blur-sm">
        <h2 className="text-5xl font-serif text-amber-900 mb-8 fade-up">Our Story</h2>
        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed fade-up">
          {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
        </p>
      </section>

      {/* Couple Photo Section */}
      {data.couplePhoto && (
        <section className="h-screen flex justify-center items-center bg-gradient-to-b from-amber-50 to-orange-50">
          <div className="fade-up">
            <img 
              src={data.couplePhoto} 
              alt={`${groomName} & ${brideName}`}
              className="w-96 h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </section>
      )}

      {/* Event Details */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-white/90">
        <h2 className="text-5xl font-serif text-amber-900 mb-12 fade-up">Wedding Ceremony</h2>
        <div className="space-y-6 fade-up">
          <div className="text-2xl text-gray-800">
            <span className="text-3xl mr-2">📍</span>
            {venue}
          </div>
          <div className="text-2xl text-gray-800">
            <span className="text-3xl mr-2">🕕</span>
            {data.weddingTime || '6:00 PM onwards'}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-amber-100 to-orange-100">
        <h2 className="text-4xl font-serif text-amber-900 mb-8 fade-up">Will you join us?</h2>
        <button className="px-12 py-4 bg-amber-600 text-white rounded-full text-xl font-semibold hover:bg-amber-700 transition-all transform hover:scale-105 shadow-xl fade-up">
          Confirm Attendance
        </button>
      </section>
    </div>
  );
}
