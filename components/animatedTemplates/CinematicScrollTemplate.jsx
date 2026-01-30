'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CinematicScrollTemplate({ data }) {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  useEffect(() => {
    // Smooth scroll snap
    gsap.utils.toArray('.snap-section').forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        snap: {
          snapTo: 1,
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
          ease: 'power1.inOut',
        },
      });
    });

    // Parallax background
    gsap.to('.parallax-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-bg',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Fade in animations on scroll
    gsap.utils.toArray('.fade-in').forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Scale animations
    gsap.utils.toArray('.scale-in').forEach((element) => {
      gsap.fromTo(
        element,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section - Full Screen */}
      <section className="snap-section h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg bg-cover bg-center"
          style={{
            backgroundImage: `url(${data.backgroundImage || '/images/wedding-backgrounds/sunset-palace-wedding.png'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-8xl font-serif text-white mb-6 fade-in drop-shadow-2xl">
            {groomName} & {brideName}
          </h1>
          <div className="w-32 h-1 bg-white mx-auto mb-6 fade-in"></div>
          <p className="text-3xl text-white/90 mb-4 fade-in">Are getting married</p>
          <p className="text-2xl text-white/80 fade-in">{weddingDate}</p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-3xl">👇</div>
        </div>
      </section>

      {/* Story Section */}
      <section className="snap-section min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center bg-gradient-to-b from-white to-gray-50">
        <h2 className="text-7xl font-serif text-gray-900 mb-12 scale-in">
          Our Story
        </h2>
        <p className="max-w-3xl text-xl text-gray-700 leading-relaxed fade-in">
          {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
        </p>
      </section>

      {/* Couple Photo Section */}
      {data.couplePhoto && (
        <section className="snap-section h-screen flex justify-center items-center bg-black">
          <div className="scale-in">
            <img
              src={data.couplePhoto}
              alt={`${groomName} & ${brideName}`}
              className="w-full max-w-2xl h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </section>
      )}

      {/* Event Details */}
      <section className="snap-section min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-7xl font-serif text-gray-900 mb-16 scale-in">
          Wedding Ceremony
        </h2>
        <div className="space-y-8 fade-in">
          <div className="text-3xl text-gray-800">
            <span className="text-4xl mr-3">📍</span>
            {venue}
          </div>
          <div className="text-3xl text-gray-800">
            <span className="text-4xl mr-3">🕕</span>
            {data.weddingTime || '6:00 PM onwards'}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="snap-section h-screen flex flex-col justify-center items-center bg-gradient-to-b from-pink-100 via-purple-100 to-pink-100">
        <h2 className="text-6xl font-serif text-gray-900 mb-12 scale-in">
          Will you join us?
        </h2>
        <button className="px-16 py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-2xl font-semibold hover:scale-105 transition-all shadow-2xl fade-in">
          Confirm Attendance
        </button>
      </section>
    </div>
  );
}
