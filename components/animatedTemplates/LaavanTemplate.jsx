'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl, getAudioUrl } from '@/lib/imageUtils';
import RSVPModal from '@/components/RSVPModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LaavanTemplate({ data, onRSVPClick }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const groomName = data.groomName || 'Gurjot';
  const brideName = data.brideName || 'Hineet';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Taj Exotica Resort, Goa';
  const weddingTime = data.weddingTime || '6pm Onwards';
  const couplePhoto = data.couplePhoto;
  const backgroundImage = data.backgroundImage;
  const musicUrl = data.music ? getAudioUrl(data.music) : null;
  
  // Parents' names
  const groomFatherName = data.groomFatherName || 'Late Sh. Rajesh Singh';
  const groomMotherName = data.groomMotherName || 'Smt. Seema Bajaj';
  const brideFatherName = data.brideFatherName || 'Ajay Arora';
  const brideMotherName = data.brideMotherName || 'Mrs. Manisha';
  
  // Additional data
  const hashtag = data.hashtag || '#BadriKiDulhania';
  const weather = data.weather || 'It will be mostly cloudy with temperature reaching up to 22 degrees at the venue';
  const staffHotel = data.staffHotel || 'We recommend the nearby lodge called VEGA near the venue for the staff members';
  const parking = data.parking || 'Valet parking for all our guests will be available at the venue';
  const instagramLink = data.instagramLink || '';
  const inviteSlug = data.slug || data.username || data.inviteSlug || '';
  
  // Multiple events - Sikh wedding includes Anand Karaj
  const events = data.events || [
    { name: 'Mehendi', date: 'Monday, 4th Feb 2026', venue: 'W Resort, Goa', time: '9pm Onwards' },
    { name: 'Haldi', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
    { name: 'Cocktail', date: 'Friday, March 9th 2026', venue: 'JW Mariott, Mussoorie', time: weddingTime },
    { name: 'Pre-wedding', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
    { name: 'Anand Karaj', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
    { name: 'Reception', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
  ];

  // Couple message
  const coupleMessage = data.coupleMessage || 'We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding.';

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
    if (containerRef.current) {
      // Set initial opacity to 1 to ensure visibility
      containerRef.current.style.opacity = '1';
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, []);

  // Scroll animations with parallax
  useEffect(() => {
    // Fade in sections
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

    // Parallax background images
    gsap.utils.toArray('.parallax-bg').forEach((bg) => {
      gsap.to(bg, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Parallax for hero background
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 30,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroBg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }, []);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBA';
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          weekday: 'long',
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

  // Get map URL
  const getMapUrl = (location) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  // Sikh Lantern Component with orange/pink glow
  const SikhLantern = ({ size = 60, x = 0, y = 0, delay = 0 }) => (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size * 1.5}px`,
        zIndex: 1,
        opacity: 0.9,
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 100 150" className="w-full h-full">
        <defs>
          <radialGradient id={`sikh-glow-${x}-${y}`}>
            <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#FFA500" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FF8C00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>
          <filter id={`sikh-glow-filter-${x}-${y}`}>
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Lantern body - orange with pink glow */}
        <ellipse cx="50" cy="75" rx="35" ry="50" fill="#FFA500" opacity="0.95" filter={`url(#sikh-glow-filter-${x}-${y})`} />
        <ellipse cx="50" cy="75" rx="30" ry="45" fill="url(#sikh-glow-${x}-${y})" />
        {/* Lantern top - pink accent */}
        <rect x="40" y="25" width="20" height="15" fill="#FF6B9D" />
        {/* Lantern bottom - pink accent */}
        <rect x="45" y="125" width="10" height="10" fill="#FF6B9D" />
      </svg>
    </div>
  );

  // Khanda Symbol Component
  const KhandaSymbol = () => (
    <svg viewBox="0 0 200 200" className="w-32 h-32 md:w-40 md:h-40" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id="khanda-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Central double-edged sword */}
      <path d="M 100 20 L 100 180" stroke="url(#khanda-gradient)" strokeWidth="8" strokeLinecap="round" />
      {/* Left curved sword */}
      <path d="M 100 40 Q 60 60 50 100 Q 60 140 100 160" stroke="url(#khanda-gradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Right curved sword */}
      <path d="M 100 40 Q 140 60 150 100 Q 140 140 100 160" stroke="url(#khanda-gradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Circle in center */}
      <circle cx="100" cy="100" r="25" stroke="url(#khanda-gradient)" strokeWidth="4" fill="none" />
      {/* Inner circle */}
      <circle cx="100" cy="100" r="12" fill="url(#khanda-gradient)" />
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .damask-pattern {
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.02) 35px, rgba(255, 255, 255, 0.02) 70px);
        }
        .diagonal-split {
          background: linear-gradient(135deg, 
            #FFA500 0%, 
            #FFA500 25%, 
            #8B40C2 25%, 
            #8B40C2 75%, 
            #FFA500 75%, 
            #FFA500 100%);
        }
        .fade-in-section {
          opacity: 1 !important;
        }
        .hero-parallax-bg {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .parallax-bg {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .hero-parallax-bg {
          animation: subtle-zoom 20s ease-in-out infinite;
        }
      `}} />
      <div ref={containerRef} className="min-h-screen relative overflow-x-hidden diagonal-split" style={{ zIndex: 1, minHeight: '100vh', opacity: 1 }}>
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

        {/* Floating Lanterns */}
        <SikhLantern size={80} x={8} y={5} delay={0} />
        <SikhLantern size={60} x={25} y={12} delay={0.5} />
        <SikhLantern size={70} x={75} y={8} delay={1} />
        <SikhLantern size={55} x={85} y={20} delay={1.5} />
        <SikhLantern size={65} x={15} y={35} delay={2} />
        <SikhLantern size={50} x={90} y={40} delay={2.5} />
        <SikhLantern size={70} x={20} y={60} delay={3} />
        <SikhLantern size={60} x={80} y={65} delay={3.5} />
        <SikhLantern size={55} x={10} y={80} delay={4} />
        <SikhLantern size={65} x={88} y={85} delay={4.5} />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden" style={{ zIndex: 10 }}>
          {/* Parallax Background Layers */}
          <div 
            className="hero-parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(/images/wedding-backgrounds/laavan/golden-temple-bg.jpg.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              opacity: 0.6,
              zIndex: 1
            }}
          ></div>
          {/* Secondary parallax layer - Sikh patterns */}
          <div 
            className="parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(/images/wedding-backgrounds/laavan/sikh-pattern-overlay.png.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              zIndex: 2
            }}
          ></div>
          {/* Custom background image if provided */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center parallax-bg"
              style={{ 
                backgroundImage: `url(${getImageUrl(backgroundImage)})`,
                opacity: 0.25,
                zIndex: 3
              }}
            ></div>
          )}
          {/* Gradient overlay for better text readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 184, 77, 0.1) 0%, rgba(255, 184, 77, 0.1) 25%, rgba(139, 64, 194, 0.1) 25%, rgba(139, 64, 194, 0.1) 75%, rgba(255, 184, 77, 0.1) 75%, rgba(255, 184, 77, 0.1) 100%)',
              zIndex: 4
            }}
          ></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Gurmukhi Text - Mool Mantar */}
            <div className="mb-8 fade-in-section">
              <p className="text-2xl md:text-3xl font-serif mb-4" dir="ltr" style={{ color: '#FFFFFF', fontFamily: 'serif', textShadow: '3px 3px 10px rgba(0,0,0,0.9)', lineHeight: '1.6', fontWeight: 'bold' }}>
                ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ…
              </p>
              <p className="text-sm md:text-base italic" style={{ color: '#FFD700', textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontWeight: '600' }}>
                Ik Onkar Satnam Karta Purakh Nirbhau Nirvair…
              </p>
            </div>

            {/* Khanda Symbol */}
            <div className="mb-8 fade-in-section flex justify-center">
              <KhandaSymbol />
            </div>

            {/* Parents Section */}
            <div className="mb-12 fade-in-section">
              <p className="text-lg md:text-xl mb-4 font-serif" style={{ color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontWeight: '600' }}>
                With the heavenly blessings of
              </p>
              <div className="space-y-2" style={{ color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
                <p className="text-xl md:text-2xl font-serif">
                  {groomMotherName} {groomFatherName ? `W/o ${groomFatherName}` : ''}
                </p>
                <p className="text-2xl md:text-3xl my-4" style={{ color: '#FFD700', opacity: 0.8 }}>——</p>
                <p className="text-xl md:text-2xl font-serif">
                  {brideMotherName} & {brideFatherName}
                </p>
              </div>
            </div>

            {/* Main Invitation */}
            <div className="mb-12 fade-in-section">
              <p className="text-3xl md:text-4xl mb-8 font-serif font-bold" style={{ color: '#FFFFFF', letterSpacing: '3px', textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}>
                INVITE
              </p>
              <p className="text-lg md:text-xl mb-6 font-serif" style={{ color: '#FFD700', opacity: 0.95, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                You to join us in the wedding celebrations of
              </p>
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#FFFFFF', textShadow: '4px 4px 12px rgba(0,0,0,0.9)' }}>
                  {groomName}
                </h1>
                <p className="text-3xl md:text-4xl my-4 font-serif font-bold" style={{ color: '#FFD700', letterSpacing: '3px', textShadow: '3px 3px 10px rgba(0,0,0,0.9)' }}>WEDS</p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#FFFFFF', textShadow: '4px 4px 12px rgba(0,0,0,0.9)' }}>
                  {brideName}
                </h1>
              </div>
              <p className="text-lg md:text-xl font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                Daughter of
              </p>
              <p className="text-xl md:text-2xl font-serif mt-2" style={{ color: '#FFD700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                {brideMotherName} & {brideFatherName}
              </p>
            </div>

            <div className="mt-12 fade-in-section">
              <p className="text-xl md:text-2xl mb-6 font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                On the following events
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20 px-4 fade-in-section relative overflow-hidden" style={{ backgroundColor: '#8B40C2' }}>
          {/* Mid Section Parallax Background */}
          <div 
            className="parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(/images/wedding-backgrounds/laavan/sikh-pattern-overlay.png.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4,
              zIndex: 1
            }}
          ></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => (
                <div key={idx} className="rounded-lg p-6 shadow-lg relative overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3" style={{ color: '#FFD700' }}>
                    {event.name}
                  </h3>
                  <p className="text-base md:text-lg mb-2 font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                    {formatDate(event.date)}
                  </p>
                  <p className="text-sm md:text-base mb-1 font-serif" style={{ color: '#FFD700', opacity: 0.8 }}>
                    {event.venue}
                  </p>
                  <p className="text-sm md:text-base mb-4 font-serif" style={{ color: '#FFD700', opacity: 0.8 }}>
                    {event.time}
                  </p>
                  {event.venue && (
                    <a
                      href={getMapUrl(event.venue)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 rounded-full transition-all font-semibold text-sm"
                      style={{ backgroundColor: '#FFD700', color: '#8B40C2', fontWeight: 'bold' }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      See the route
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Bride & Groom Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#8B40C2' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8" style={{ color: '#FFD700' }}>
              MEET THE<br />Bride & Groom
            </h2>
            
            {couplePhoto ? (
              <div className="relative mb-8">
                <div className="rounded-lg overflow-hidden shadow-2xl" style={{ border: '3px solid #FFD700' }}>
                  <img 
                    src={getImageUrl(couplePhoto)} 
                    alt="Bride & Groom" 
                    className="w-full h-auto"
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
              </div>
            ) : (
              <div className="mb-8 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-orange-200 to-pink-200 p-12" style={{ border: '3px solid #FFD700', minHeight: '400px' }}>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💑</div>
                    <p className="text-2xl font-serif" style={{ color: '#8B40C2' }}>Bride & Groom</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-lg md:text-xl font-serif mb-4" style={{ color: '#FFD700', opacity: 0.9 }}>
                A message from the couple
              </p>
            </div>
            
            <p className="text-lg md:text-xl font-serif leading-relaxed max-w-3xl mx-auto" style={{ color: '#FFD700', opacity: 0.9 }}>
              {coupleMessage}
            </p>
          </div>
        </section>

        {/* Things to Know Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#8B40C2' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center" style={{ color: '#FFD700' }}>
              Things to know
            </h2>
            <p className="text-lg md:text-xl font-serif mb-12 text-center" style={{ color: '#FFD700', opacity: 0.9 }}>
              To help you feel at ease and enjoy every moment of the celebrations, we've gathered a few thoughtful details we'd love for you to know before the big day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#FFD700' }}>Hashtag</h3>
                <p className="text-base font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                  While posting photos on social media please use the hashtag - {hashtag}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#FFD700' }}>Weather</h3>
                <p className="text-base font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                  {weather}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#FFD700' }}>Staff</h3>
                <p className="text-base font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                  {staffHotel}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#FFD700' }}>Parking</h3>
                <p className="text-base font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                  {parking}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#8B40C2' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFD700' }}>
              The countdown begins
            </h2>
            <div className="flex justify-center gap-4 md:gap-6 mt-8">
              {[
                { value: countdown.days.toString().padStart(2, '0'), label: 'D' },
                { value: countdown.hours.toString().padStart(2, '0'), label: 'H' },
                { value: countdown.minutes.toString().padStart(2, '0'), label: 'M' },
                { value: countdown.seconds.toString().padStart(2, '0'), label: 'S' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', border: '2px solid #FFD700', minWidth: '100px' }}>
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#FFD700' }}>
                    {item.value}
                  </div>
                  <div className="text-lg font-serif" style={{ color: '#FFD700', opacity: 0.9 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-lg md:text-xl font-serif mt-8" style={{ color: '#FFD700', opacity: 0.9 }}>
              Our families are excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.
            </p>
          </div>
        </section>

        {/* Instagram Section */}
        {instagramLink && (
          <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#8B40C2' }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFD700' }}>
                Follow the action
              </h2>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-full transition-all font-semibold text-lg"
                style={{ backgroundColor: '#FFD700', color: '#8B40C2', fontWeight: 'bold' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Click to open Instagram
              </a>
            </div>
          </section>
        )}

        {/* RSVP Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#8B40C2' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" style={{ color: '#FFD700', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
              Looking forward to see you
            </h2>
            <button
              onClick={() => {
                if (onRSVPClick) {
                  onRSVPClick();
                } else {
                  setShowRSVPModal(true);
                }
              }}
              className="px-8 py-4 rounded-full transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#FFD700', color: '#8B40C2', fontWeight: 'bold' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Confirm Attendance
            </button>
          </div>
        </section>

        {/* RSVP Modal */}
        <RSVPModal
          isOpen={showRSVPModal}
          onClose={() => setShowRSVPModal(false)}
          inviteSlug={inviteSlug}
        />

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
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: '#FFD700', color: '#8B40C2', boxShadow: '0 10px 40px rgba(255, 215, 0, 0.4)' }}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </>
  );
}
