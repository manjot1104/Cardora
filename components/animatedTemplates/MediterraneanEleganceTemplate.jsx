'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl, getAudioUrl } from '@/lib/imageUtils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MediterraneanEleganceTemplate({ data, onRSVPClick }) {
  const containerRef = useRef(null);
  const sealRef = useRef(null);
  const contentRef = useRef(null);
  const audioRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';
  const weddingTime = data.weddingTime || '5:00 PM';
  const couplePhoto = data.couplePhoto;
  const backgroundImage = data.backgroundImage;
  const musicUrl = data.music ? getAudioUrl(data.music) : null;

  // Handle music playback
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (musicPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Auto-play prevented:', err);
            setMusicPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, musicUrl]);

  // Calculate countdown
  useEffect(() => {
    const calculateCountdown = () => {
      if (!weddingDate) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      let targetDate;
      try {
        targetDate = new Date(weddingDate);
        if (isNaN(targetDate.getTime())) {
          const dateStr = weddingDate.trim();
          const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
          const yearMatch = dateStr.match(/\b(20\d{2}|19\d{2})\b/);
          let day = dayMatch ? parseInt(dayMatch[1]) : 15;
          let year = yearMatch ? parseInt(yearMatch[1]) : 2024;
          
          const monthMap = {
            'january': 0, 'jan': 0, 'february': 1, 'feb': 1,
            'march': 2, 'mar': 2, 'april': 3, 'apr': 3,
            'may': 4, 'june': 5, 'jun': 5, 'july': 6, 'jul': 6,
            'august': 7, 'aug': 7, 'september': 8, 'sept': 8, 'sep': 8,
            'october': 9, 'oct': 9, 'november': 10, 'nov': 10,
            'december': 11, 'dec': 11,
          };
          
          const lowerStr = dateStr.toLowerCase();
          let month = 11;
          for (const [key, value] of Object.entries(monthMap)) {
            if (lowerStr.includes(key)) {
              month = value;
              break;
            }
          }
          targetDate = new Date(year, month, day);
        }
      } catch (err) {
        console.error('Date parsing error:', err);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // Initial animations
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });
    
    if (sealRef.current && !isOpened) {
      gsap.to(sealRef.current, {
        y: -8,
        duration: 2.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, [isOpened]);

  // Scroll animations
  useEffect(() => {
    if (isOpened) {
      gsap.utils.toArray('.fade-in-section').forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
    }
  }, [isOpened]);

  const handleSealClick = () => {
    if (isOpened) return;
    
    setIsOpened(true);
    
    // Wait for next frame to ensure contentRef is available
    setTimeout(() => {
      if (contentRef.current) {
        const tl = gsap.timeline();
        
        tl.to(sealRef.current, {
          scale: 1.3,
          rotation: 15,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        })
        .fromTo(contentRef.current, 
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          }, 
          '-=0.2'
        );
      }
    }, 50);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBA';
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (err) {
      // If parsing fails, return as is
    }
    return dateStr;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F5F1E8] relative overflow-x-hidden">
      {/* Audio Element */}
      {musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          onPlay={() => setMusicPlaying(true)}
          onPause={() => setMusicPlaying(false)}
        />
      )}

      {/* Envelope Opening Section */}
      {!isOpened && (
        <div className="h-screen flex items-center justify-center bg-[#8B7D6B] relative">
          {/* Wax Seal */}
          <div
            ref={sealRef}
            onClick={handleSealClick}
            className="relative z-10 cursor-pointer group"
          >
            <div className="w-28 h-28 rounded-full bg-[#C9B99B] shadow-lg flex items-center justify-center transition-transform group-hover:scale-105" style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}>
              <div className="text-center">
                <div className="text-[#5C4A37] font-serif text-2xl font-bold leading-tight">
                  {groomName.charAt(0).toUpperCase()}
                </div>
                <div className="text-[#5C4A37] font-serif text-sm mt-0.5">&</div>
                <div className="text-[#5C4A37] font-serif text-2xl font-bold leading-tight">
                  {brideName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Invitation Text */}
          <div className="absolute bottom-24 right-8 text-right">
            <p className="text-[#5C4A37] font-serif text-base italic mb-2">
              This invitation is exclusive for you
            </p>
            <p className="text-[#5C4A37] font-serif text-sm">
              Tap to open
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isOpened && (
        <div ref={contentRef} style={{ opacity: 0 }} className="min-h-screen">
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
            {/* Background Illustration Placeholder */}
            {backgroundImage ? (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${getImageUrl(backgroundImage)})` }}
              ></div>
            ) : (
              <div className="absolute inset-0 opacity-10">
                {/* Watercolor-style decorative elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-200 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            )}
            
            <div className="relative z-10 text-center max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-serif text-[#2D5016] mb-4 tracking-wide">
                WE ARE GETTING MARRIED
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-5xl md:text-6xl font-serif text-[#2D5016] font-bold italic">
                  {groomName}
                </span>
                <span className="text-3xl md:text-4xl text-[#D4A574] font-serif">&</span>
                <span className="text-5xl md:text-6xl font-serif text-[#2D5016] font-bold italic">
                  {brideName}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-serif text-[#2D5016] mb-8">
                {formatDate(weddingDate)}
              </p>
              <div className="mt-12">
                <button
                  onClick={onRSVPClick}
                  className="px-8 py-4 bg-[#2D5016] text-white rounded-full hover:bg-[#1f3a0f] transition-all font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                >
                  CONFIRM YOUR ATTENDANCE
                </button>
              </div>
            </div>
          </section>

          {/* Countdown Section */}
          <section className="py-20 px-4 bg-[#2D5016] fade-in-section">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Countdown
              </h2>
              <p className="text-lg text-white/90 mb-12 font-serif">
                For the most special day of our lives
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { value: countdown.days, label: 'DAYS' },
                  { value: countdown.hours.toString().padStart(2, '0'), label: 'HOURS' },
                  { value: countdown.minutes.toString().padStart(2, '0'), label: 'MINUTES' },
                  { value: countdown.seconds.toString().padStart(2, '0'), label: 'SECONDS' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#3A6B1F] border-2 border-white/20 rounded-lg p-6 md:p-8">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {item.value}
                    </div>
                    <div className="text-sm md:text-base text-white/90 font-serif">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Program Section */}
          <section className="py-20 px-4 bg-[#F5F1E8] fade-in-section">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-serif text-[#2D5016] mb-4">
                  Program of the Day
                </h2>
                <p className="text-lg text-[#2D5016]/80 font-serif">
                  What we have prepared for you
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { time: '17:00', title: 'Guest Arrival', desc: 'Reception and welcome at the venue', icon: '❤️' },
                  { time: '17:30', title: 'Welcome Drink', desc: 'Welcome cocktail while we wait', icon: '🍷' },
                  { time: '18:00', title: 'Ceremony', desc: 'The most special moment of the day', icon: '⛪' },
                  { time: '19:00', title: 'Cocktail', desc: 'Appetizers and drinks in the gardens', icon: '🥂' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-start gap-6 bg-white/50 rounded-lg p-6 shadow-sm">
                    <div className="bg-[#2D5016] text-white px-4 py-2 rounded font-serif font-bold text-lg min-w-[80px] text-center">
                      {event.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{event.icon}</span>
                        <h3 className="text-xl font-serif text-[#2D5016] font-bold">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-[#2D5016]/70 font-serif">
                        {event.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="py-20 px-4 bg-[#F5F1E8] fade-in-section">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto bg-[#2D5016]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2D5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-[#2D5016] mb-4">
                  Details of the Day
                </h2>
                <p className="text-lg text-[#2D5016]/80 font-serif mb-8">
                  Everything you need to know
                </p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-8 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-[#2D5016] font-bold mb-2">
                    Location
                  </h3>
                  <p className="text-xl text-[#2D5016] mb-4">{venue}</p>
                  <div className="flex items-center justify-center gap-2 text-[#2D5016]/70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-serif">From {weddingTime} to 1:00 AM</span>
                  </div>
                </div>
                
                {couplePhoto && (
                  <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={getImageUrl(couplePhoto)} 
                      alt="Venue" 
                      className="w-full h-64 object-cover"
                      style={{
                        imageRendering: 'auto',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Accommodation Section */}
          <section className="py-20 px-4 bg-[#F5F1E8] fade-in-section">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <svg className="w-12 h-12 mx-auto text-[#2D5016] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h2 className="text-4xl md:text-5xl font-serif text-[#2D5016] mb-4">
                  Accommodation
                </h2>
                <p className="text-lg text-[#2D5016]/80 font-serif">
                  Recommendations for your stay
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { name: 'Agroturismo Es Quatre Cantons', subtitle: 'Closer to the wedding' },
                  { name: 'La Pérgola', subtitle: 'Recommended accommodation' },
                ].map((hotel, idx) => (
                  <div key={idx} className="bg-white/70 rounded-lg p-6 shadow-sm text-left">
                    <h3 className="text-2xl font-serif text-[#2D5016] font-bold mb-2">
                      {hotel.name}
                    </h3>
                    <p className="text-[#2D5016]/70 font-serif mb-4">{hotel.subtitle}</p>
                    <button className="border-2 border-[#2D5016] text-[#2D5016] px-6 py-2 rounded font-serif hover:bg-[#2D5016] hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Gifts Section */}
          <section className="py-20 px-4 bg-[#F5F1E8] fade-in-section">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <div className="flex-1 h-px bg-[#2D5016]/20"></div>
                <div className="w-3 h-3 bg-[#2D5016] rotate-45 mx-4"></div>
                <div className="flex-1 h-px bg-[#2D5016]/20"></div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif text-[#2D5016] text-center mb-8">
                Gifts
              </h2>
              
              <div className="bg-white/70 rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                <p className="text-[#2D5016] font-serif text-lg leading-relaxed mb-6">
                  Your presence is the most important thing for us. If you wish to give us a gift, you can do so in the way that is most comfortable for you.
                </p>
                
                <div className="border-2 border-[#2D5016]/20 rounded-lg p-4 bg-white/50 flex items-center justify-between cursor-pointer hover:border-[#2D5016]/40 transition-colors">
                  <span className="text-[#2D5016] font-serif">Contribution</span>
                  <svg className="w-5 h-5 text-[#2D5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-8">
                <div className="flex-1 h-px bg-[#2D5016]/20"></div>
                <div className="w-3 h-3 bg-[#2D5016] rotate-45 mx-4"></div>
                <div className="flex-1 h-px bg-[#2D5016]/20"></div>
              </div>
            </div>
          </section>

          {/* RSVP Section */}
          <section className="py-20 px-4 bg-[#F5F1E8] fade-in-section">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-serif text-[#2D5016] mb-6 text-center">
                Message for the couple (optional)
              </h2>
              
              <div className="bg-white/70 rounded-lg p-8 shadow-sm">
                <textarea
                  className="w-full h-32 p-4 border-2 border-[#2D5016]/20 rounded-lg bg-white/50 text-[#2D5016] font-serif resize-none focus:outline-none focus:border-[#2D5016] transition-colors"
                  placeholder="Write us a few words..."
                ></textarea>
                
                <button className="mt-6 w-full bg-[#2D5016] text-white py-4 rounded-lg font-serif text-lg hover:bg-[#3A6B1F] transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send confirmation
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="py-16 px-4 bg-[#2D5016] text-center fade-in-section">
            <div className="mb-6">
              <svg className="w-12 h-12 mx-auto text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-4xl md:text-5xl font-serif text-white mb-4">
              {groomName} & {brideName}
            </div>
            <div className="text-xl text-white/90 font-serif mb-6">
              {formatDate(weddingDate)}
            </div>
            <div className="text-sm text-white/70 font-serif mb-2">
              Made by Cardora
            </div>
            <div className="text-xs text-white/60 font-serif">
              cardoradigital.ca
            </div>
          </section>

          {/* Website Name - Bottom Center (Fixed) */}
          <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <p 
              className="text-xs opacity-70 font-serif italic"
              style={{ 
                color: '#2D5016',
                textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
              }}
            >
              cardoradigital.ca
            </p>
          </div>

          {/* CARDORA Watermark - Bottom Right */}
          <div 
            className="fixed bottom-20 right-6 z-40 pointer-events-none"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '2px',
              color: 'rgba(45, 80, 22, 0.5)',
              opacity: 0.6,
            }}
          >
            CARDORA
          </div>

          {/* Music Toggle Button */}
          {musicUrl && (
            <button
              onClick={async () => {
                if (audioRef.current) {
                  if (musicPlaying) {
                    audioRef.current.pause();
                    setMusicPlaying(false);
                  } else {
                    try {
                      await audioRef.current.play();
                      setMusicPlaying(true);
                    } catch (err) {
                      console.log('Play failed:', err);
                      setMusicPlaying(false);
                    }
                  }
                }
              }}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#2D5016] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
              style={{ boxShadow: '0 10px 40px rgba(45, 80, 22, 0.4)' }}
              aria-label={musicPlaying ? 'Pause music' : 'Play music'}
            >
              {musicPlaying ? '🔊' : '🔇'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
