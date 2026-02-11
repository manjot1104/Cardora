'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl, getAudioUrl } from '@/lib/imageUtils';
import RSVPModal from '@/components/RSVPModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CityTemplate({ data, onRSVPClick }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const groomName = data.groomName || 'Abhishek';
  const brideName = data.brideName || 'Kanika';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Rambagh, Jaipur';
  const weddingTime = data.weddingTime || '6pm Onwards';
  const couplePhoto = data.couplePhoto;
  const backgroundImage = data.backgroundImage;
  const musicUrl = data.music ? getAudioUrl(data.music) : null;
  
  // Parents' names
  const groomFatherName = data.groomFatherName || 'Mr. Kamal Kapoor';
  const groomMotherName = data.groomMotherName || 'Smt. Lata Devi';
  const brideFatherName = data.brideFatherName || 'Mr. Aakash Mittal';
  const brideMotherName = data.brideMotherName || 'Mrs. Shalini';
  
  // Additional data
  const hashtag = data.hashtag || '#abkan';
  const weather = data.weather || 'It will be mostly sunny with temperature reaching up to 28 degrees at the venue';
  const staffHotel = data.staffHotel || 'We recommend the nearby hotel called Bhola Bhawan near the venue for the staff members';
  const parking = data.parking || 'Valet parking for all our guests will be available at the venue';
  const instagramLink = data.instagramLink || '';
  const whatsappNumber = data.whatsapp || '';
  const inviteSlug = data.slug || data.username || data.inviteSlug || '';
  
  // Multiple events
  const events = data.events || [
    { name: 'Mehendi', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
    { name: 'Haldi', date: 'Friday, March 10th 2026', venue: venue, time: weddingTime },
    { name: 'Cocktail', date: 'Friday, March 10th 2026', venue: venue, time: weddingTime },
    { name: 'Engagement', date: 'Friday, March 11th 2026', venue: venue, time: weddingTime },
    { name: 'Shaadi', date: 'Friday, March 12th 2026', venue: venue, time: weddingTime },
    { name: 'Reception', date: 'Friday, March 17th 2026', venue: venue, time: weddingTime },
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

  // Get WhatsApp URL
  const getWhatsAppUrl = () => {
    if (!whatsappNumber) return '#';
    const message = encodeURIComponent(`Hello! I would like to RSVP for ${groomName} & ${brideName}'s wedding.`);
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`;
  };

  // Floral decoration component
  const FloralDecoration = () => (
    <svg viewBox="0 0 100 100" className="absolute w-16 h-16 opacity-60">
      <circle cx="50" cy="30" r="8" fill="#D4A574" />
      <circle cx="40" cy="40" r="6" fill="#D4A574" />
      <circle cx="60" cy="40" r="6" fill="#D4A574" />
      <path d="M 50 30 Q 45 50 50 70 Q 55 50 50 30" fill="#8B7355" />
      <path d="M 40 40 Q 35 60 40 80 Q 45 60 40 40" fill="#8B7355" />
      <path d="M 60 40 Q 65 60 60 80 Q 55 60 60 40" fill="#8B7355" />
      <ellipse cx="50" cy="70" rx="12" ry="8" fill="#8B7355" />
      <ellipse cx="40" cy="80" rx="10" ry="6" fill="#8B7355" />
      <ellipse cx="60" cy="80" rx="10" ry="6" fill="#8B7355" />
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .damask-pattern {
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.02) 35px, rgba(255, 255, 255, 0.02) 70px);
        }
        .floral-pattern {
          background-image: 
            url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20 Q45 40 50 60 Q55 40 50 20' fill='%23D4A574' opacity='0.3'/%3E%3C/svg%3E");
          background-size: 80px 80px;
          background-repeat: repeat;
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
      <div ref={containerRef} className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#4a7a7c', zIndex: 1, minHeight: '100vh', opacity: 1 }}>
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

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden" style={{ zIndex: 10 }}>
          {/* Parallax Background Layer */}
          <div 
            className="hero-parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: backgroundImage ? `url(${getImageUrl(backgroundImage)})` : `url(/images/wedding-backgrounds/city/beach-sunset-bg.jpg.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              opacity: 0.7,
              zIndex: 1
            }}
          ></div>
          {/* Gradient overlay for better text readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(232, 240, 232, 0.2) 0%, rgba(232, 240, 232, 0.4) 100%)',
              zIndex: 4
            }}
          ></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Ganesha Blessing */}
            <div className="mb-8 fade-in-section">
              <p className="text-3xl md:text-4xl font-serif mb-4" style={{ color: '#FFD700', fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                ॐ श्री गणेशाय नम
              </p>
            </div>

            {/* Parents Section */}
            <div className="mb-12 fade-in-section">
              <p className="text-lg md:text-xl mb-4 font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                With the heavenly blessings of
              </p>
              <div className="space-y-2" style={{ color: '#FFD700', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                <p className="text-xl md:text-2xl font-serif">
                  {groomMotherName} & {groomFatherName}
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
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#FFFFFF', textShadow: '3px 3px 8px rgba(0,0,0,0.5)' }}>
                  {groomName}
                </h1>
                <p className="text-3xl md:text-4xl my-4 font-serif font-bold" style={{ color: '#FFD700', letterSpacing: '3px', textShadow: '2px 2px 5px rgba(0,0,0,0.4)' }}>WEDS</p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#FFFFFF', textShadow: '3px 3px 8px rgba(0,0,0,0.5)' }}>
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

        {/* Events Section with Light Yellow-Green Cards */}
        <section className="py-20 px-4 fade-in-section relative overflow-hidden" style={{ backgroundColor: '#4a7a7c' }}>
          {/* Mid Section Parallax Background */}
          <div 
            className="parallax-bg absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(/images/wedding-backgrounds/sunset-palace-wedding.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 1
            }}
          ></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg p-6 shadow-lg relative overflow-hidden" 
                  style={{ 
                    background: 'linear-gradient(135deg, #e0e6b8 0%, #d4d9a8 100%)',
                    border: '1px solid rgba(212, 165, 116, 0.5)',
                    minHeight: '200px'
                  }}
                >
                  {/* Floral Decorations */}
                  <div className="absolute top-2 right-2">
                    <FloralDecoration />
                  </div>
                  <div className="absolute bottom-2 left-2 transform rotate-180">
                    <FloralDecoration />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3" style={{ color: '#4a7a7c' }}>
                      {event.name.toUpperCase()}
                    </h3>
                    <p className="text-base md:text-lg mb-2 font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                      {formatDate(event.date)}
                    </p>
                    <p className="text-sm md:text-base mb-1 font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                        {event.venue}
                      </p>
                      <p className="text-sm md:text-base mb-4 font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                      {event.time}
                    </p>
                    {event.venue && (
                      <a
                        href={getMapUrl(event.venue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-serif underline"
                        style={{ color: '#4a7a7c', opacity: 1 }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.9'}
                      >
                        See the route
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Bride & Groom Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#4a7a7c' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8" style={{ color: '#FFD700' }}>
              meet the<br />bride and groom
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
                    <p className="text-2xl font-serif" style={{ color: '#4a7a7c' }}>Bride & Groom</p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-lg md:text-xl font-serif leading-relaxed max-w-3xl mx-auto" style={{ color: '#FFD700', opacity: 0.9 }}>
              {coupleMessage}
            </p>
          </div>
        </section>

        {/* Things to Know Section - Light Yellowish-Green Background */}
        <section className="py-20 px-4 fade-in-section floral-pattern" style={{ backgroundColor: '#e0e6b8' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center" style={{ color: '#4a7a7c' }}>
              Things to know
            </h2>
            <p className="text-lg md:text-xl font-serif mb-12 text-center" style={{ color: '#4a7a7c', opacity: 0.9 }}>
              To help you feel at ease and enjoy every moment of the celebrations, we've gathered a few thoughtful details we'd love for you to know before the big day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(26, 74, 76, 0.2)' }}>
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#4a7a7c' }}>Hashtag</h3>
                <p className="text-base font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                  While posting photos on social media please use the hashtag - {hashtag}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(74, 122, 124, 0.3)' }}>
                <div className="text-4xl mb-4">☀️</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#4a7a7c' }}>Weather</h3>
                <p className="text-base font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                  {weather}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(74, 122, 124, 0.3)' }}>
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#4a7a7c' }}>Staff</h3>
                <p className="text-base font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                  {staffHotel}
                </p>
              </div>
              
              <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(74, 122, 124, 0.3)' }}>
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#4a7a7c' }}>Parking</h3>
                <p className="text-base font-serif" style={{ color: '#4a7a7c', opacity: 0.9 }}>
                  {parking}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#4a7a7c' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFD700' }}>
              The countdown begins
            </h2>
            <div className="flex justify-center gap-4 md:gap-6 mt-8">
              {[
                { value: countdown.days, label: 'D' },
                { value: countdown.hours.toString().padStart(2, '0'), label: 'H' },
                { value: countdown.minutes.toString().padStart(2, '0'), label: 'M' },
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
          </div>
        </section>

        {/* Instagram Section */}
        {instagramLink && (
          <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#4a7a7c' }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFD700' }}>
                Follow the action
              </h2>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-full transition-all font-semibold text-lg"
                style={{ backgroundColor: '#FFD700', color: '#4a7a7c', fontWeight: 'bold' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Click to open our Instagram page
              </a>
            </div>
          </section>
        )}

        {/* RSVP Section with WhatsApp */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ backgroundColor: '#4a7a7c' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" style={{ color: '#FFD700' }}>
              Please rsvp
            </h2>
            {whatsappNumber ? (
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-full transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Click to message on WhatsApp
              </a>
            ) : (
              <button
                onClick={() => {
                  if (onRSVPClick) {
                    onRSVPClick();
                  } else {
                    setShowRSVPModal(true);
                  }
                }}
                className="px-8 py-4 rounded-full transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#FFD700', color: '#4a7a7c', fontWeight: 'bold' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Confirm Attendance
              </button>
            )}
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
            style={{ backgroundColor: '#FFD700', color: '#4a7a7c', boxShadow: '0 10px 40px rgba(255, 215, 0, 0.4)' }}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </>
  );
}
