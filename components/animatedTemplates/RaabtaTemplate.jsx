'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageUrl, getAudioUrl } from '@/lib/imageUtils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RaabtaTemplate({ data, onRSVPClick }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';
  const weddingTime = data.weddingTime || '6pm Onwards';
  const couplePhoto = data.couplePhoto;
  const backgroundImage = data.backgroundImage;
  const musicUrl = data.music ? getAudioUrl(data.music) : null;
  
  // Parents' names
  const groomFatherName = data.groomFatherName || 'Mr. Zafar Ahmed';
  const groomMotherName = data.groomMotherName || 'Mrs. Fatima Begum';
  const brideFatherName = data.brideFatherName || 'Mr. Arshad Hussain';
  const brideMotherName = data.brideMotherName || 'Mrs. Nida Khan';
  
  // Additional data
  const hashtag = data.hashtag || '#raabta';
  const weather = data.weather || 'It will be mostly sunny with temperature reaching up to 28 degrees at the venue';
  const staffHotel = data.staffHotel || 'We recommend the nearby hotel called Bhola Bhawan near the venue for the staff members';
  const parking = data.parking || 'Valet parking for all our guests will be available at the venue';
  const whatsappNumber = data.whatsapp || '';
  const instagramLink = data.instagramLink || '';
  
  // Multiple events - support for Mehendi, Manjha, Sangeet, Engagement, Nikah, Walima
  const events = data.events || [
    { name: 'Mehendi', date: 'Friday, March 9th 2026', venue: venue, time: weddingTime },
    { name: 'Manjha', date: 'Friday, March 10th 2026', venue: venue, time: weddingTime },
    { name: 'Sangeet', date: 'Friday, March 10th 2026', venue: venue, time: weddingTime },
    { name: 'Engagement', date: 'Friday, March 11th 2026', venue: venue, time: weddingTime },
    { name: 'Nikah', date: 'Friday, March 12th 2026', venue: venue, time: weddingTime },
    { name: 'Walima', date: 'Friday, March 17th 2026', venue: venue, time: weddingTime },
  ];

  // Couple message
  const coupleMessage = data.coupleMessage || 'We are both so delighted that you will be joining us to celebrate what we hope will be one of the happiest days of our lives. The love and warmth shown to us by so many people since our Mangni has been incredibly moving and has touched us deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness and prayers. We are truly looking forward to seeing you at the wedding functions.';

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
    // Don't hide the container initially - make it visible immediately
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 });
    }
    
    // Scroll animations - start with content visible, then animate on scroll
    if (typeof window !== 'undefined') {
      gsap.utils.toArray('.fade-in-section').forEach((section) => {
        if (section) {
          // Set initial state to visible
          gsap.set(section, { opacity: 1, y: 0 });
          
          // Then animate on scroll if needed
          gsap.fromTo(section, 
            {
              opacity: 0.8,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
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

  // Get Google Maps URL
  const getMapUrl = (venueName) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName)}`;
  };

  // Lantern SVG Component
  const Lantern = ({ size = 60, x = 0, y = 0, delay = 0 }) => (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size * 1.5}px`,
        zIndex: 1,
        opacity: 0.8,
        animation: `float ${3 + delay}s ease-in-out infinite`,
      }}
    >
      <svg viewBox="0 0 100 150" className="w-full h-full">
        {/* Glow effect */}
        <defs>
          <radialGradient id={`glow-${x}-${y}`}>
            <stop offset="0%" stopColor="#FFA500" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8C00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-filter-${x}-${y}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Lantern body */}
        <ellipse cx="50" cy="75" rx="35" ry="50" fill="#FFA500" opacity="0.9" filter={`url(#glow-filter-${x}-${y})`} />
        <ellipse cx="50" cy="75" rx="30" ry="45" fill="url(#glow-${x}-${y})" />
        {/* Lantern top */}
        <rect x="40" y="25" width="20" height="15" fill="#8B4513" />
        {/* Lantern bottom */}
        <rect x="45" y="125" width="10" height="10" fill="#8B4513" />
      </svg>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .damask-pattern {
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.03) 35px, rgba(255, 255, 255, 0.03) 70px);
        }
        .floral-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 255, 255, 0.05) 50px, rgba(255, 255, 255, 0.05) 100px);
        }
      `}} />
      <div ref={containerRef} className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#4A7C7E', zIndex: 1, minHeight: '100vh', opacity: 1 }}>
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

        {/* Hero Section with Arabic Text */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative damask-pattern" style={{ zIndex: 10 }}>
          {/* Diagonal Corner Sections */}
          <div 
            className="absolute top-0 left-0 w-64 h-64 opacity-30"
            style={{
              background: 'linear-gradient(135deg, #8B4513 0%, transparent 70%)',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            }}
          />
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-30"
            style={{
              background: 'linear-gradient(225deg, #8B4513 0%, transparent 70%)',
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
            }}
          />

          {/* Glowing Lanterns */}
          <Lantern size={80} x={10} y={15} delay={0} />
          <Lantern size={50} x={25} y={40} delay={0.5} />
          <Lantern size={60} x={75} y={20} delay={1} />
          <Lantern size={45} x={85} y={50} delay={1.5} />
          <Lantern size={55} x={15} y={70} delay={2} />
          <Lantern size={50} x={90} y={75} delay={2.5} />

          {/* Background Image */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url(${getImageUrl(backgroundImage)})` }}
            ></div>
          )}
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Arabic Text */}
            <div className="mb-8 fade-in-section" style={{ opacity: 1 }}>
              <p className="text-3xl md:text-4xl font-serif mb-2" dir="rtl" style={{ color: '#F5E6D3' }}>
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْم
              </p>
              <p className="text-lg md:text-xl italic" style={{ color: '#E8D5C4' }}>
                Bismillahir Rahmanir Raheem
              </p>
            </div>

            {/* Parents Section */}
            <div className="mb-12 fade-in-section" style={{ opacity: 1 }}>
              <p className="text-lg md:text-xl mb-4 font-serif" style={{ color: '#F5E6D3' }}>
                With the heavenly blessings of
              </p>
              <div className="space-y-2" style={{ color: '#F5E6D3' }}>
                <p className="text-xl md:text-2xl font-serif">
                  {groomMotherName} & {groomFatherName}
                </p>
                <p className="text-2xl md:text-3xl my-4" style={{ color: '#E8D5C4' }}>——</p>
                <p className="text-xl md:text-2xl font-serif">
                  {brideMotherName} & {brideFatherName}
                </p>
              </div>
            </div>

            {/* Main Invitation */}
            <div className="mb-12 fade-in-section" style={{ opacity: 1 }}>
              <p className="text-2xl md:text-3xl mb-8 font-serif" style={{ color: '#F5E6D3', letterSpacing: '2px' }}>
                INVITE
              </p>
              <p className="text-lg md:text-xl mb-6 font-serif" style={{ color: '#E8D5C4' }}>
                You to join us in the wedding celebrations of
              </p>
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#F5E6D3' }}>
                  {groomName}
                </h1>
                <p className="text-3xl md:text-4xl my-4 font-serif" style={{ color: '#E8D5C4', letterSpacing: '3px' }}>WEDS</p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-2" style={{ color: '#F5E6D3' }}>
                  {brideName}
                </h1>
              </div>
              <p className="text-lg md:text-xl font-serif" style={{ color: '#F5E6D3' }}>
                Daughter of
              </p>
              <p className="text-xl md:text-2xl font-serif mt-2" style={{ color: '#F5E6D3' }}>
                {brideMotherName} & {brideFatherName}
              </p>
            </div>

            <div className="mt-12 fade-in-section" style={{ opacity: 1 }}>
              <p className="text-xl md:text-2xl mb-6 font-serif" style={{ color: '#F5E6D3' }}>
                On the following events
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ opacity: 1, backgroundColor: '#4A7C7E' }}>
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {events.map((event, idx) => (
                <div key={idx} className="rounded-lg p-6 md:p-8 shadow-lg" style={{ backgroundColor: 'rgba(245, 230, 211, 0.15)', border: '1px solid rgba(245, 230, 211, 0.3)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: '#F5E6D3' }}>
                        {event.name}
                      </h3>
                      <p className="text-lg md:text-xl mb-2 font-serif" style={{ color: '#E8D5C4' }}>
                        {formatDate(event.date)}
                      </p>
                      <p className="text-base md:text-lg mb-1 font-serif" style={{ color: '#E8D5C4' }}>
                        {event.venue}
                      </p>
                      <p className="text-base md:text-lg font-serif" style={{ color: '#E8D5C4' }}>
                        {event.time}
                      </p>
                    </div>
                    {event.venue && (
                      <a
                        href={getMapUrl(event.venue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full transition-all font-semibold shadow-md hover:shadow-lg cursor-pointer text-center"
                        style={{ backgroundColor: '#8B4513', color: '#F5E6D3' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#A0522D'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#8B4513'}
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

        {/* Meet the Bride and Groom Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ opacity: 1, backgroundColor: '#4A7C7E' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-8" style={{ color: '#F5E6D3' }}>
              meet the bride and groom
            </h2>
            {couplePhoto && (
              <div className="mb-8 flex justify-center gap-4 overflow-x-auto pb-4">
                <img 
                  src={getImageUrl(couplePhoto)} 
                  alt="Bride and Groom" 
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-xl"
                  style={{
                    imageRendering: 'auto',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    border: '3px solid rgba(245, 230, 211, 0.5)',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-lg md:text-xl leading-relaxed font-serif max-w-3xl mx-auto" style={{ color: '#E8D5C4' }}>
              {coupleMessage}
            </p>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-20 px-4 fade-in-section damask-pattern" style={{ opacity: 1, backgroundColor: '#4A7C7E' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-8" style={{ color: '#F5E6D3' }}>
              Please rsvp
            </h2>
            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-full transition-all font-semibold shadow-md hover:shadow-lg cursor-pointer text-lg"
                style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#20BA5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
              >
                Click to message on WhatsApp
              </a>
            ) : (
              <button
                onClick={onRSVPClick}
                className="px-8 py-4 rounded-full transition-all font-semibold shadow-md hover:shadow-lg cursor-pointer text-lg"
                style={{ backgroundColor: '#8B4513', color: '#F5E6D3' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#A0522D'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8B4513'}
              >
                Confirm Your Attendance
              </button>
            )}
          </div>
        </section>

        {/* Things to Know Section */}
        <section className="py-20 px-4 fade-in-section floral-pattern" style={{ opacity: 1, backgroundColor: '#D4D79F' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-center" style={{ color: '#4A4A2A' }}>
              Things to know
            </h2>
            <p className="text-lg mb-12 text-center font-serif" style={{ color: '#5A5A3A' }}>
              To help you feel at ease and enjoy every moment of the celebrations, we've gathered a few thoughtful details we'd love for you to know before the big day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(74, 74, 42, 0.2)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📷</span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: '#4A4A2A' }}>Hashtag</h3>
                </div>
                <p className="text-lg font-serif" style={{ color: '#5A5A3A' }}>
                  While posting photos on social media please use the hashtag - {hashtag}
                </p>
              </div>
              
              <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(74, 74, 42, 0.2)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☀️</span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: '#4A4A2A' }}>Weather</h3>
                </div>
                <p className="text-lg font-serif" style={{ color: '#5A5A3A' }}>
                  {weather}
                </p>
              </div>
              
              <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(74, 74, 42, 0.2)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">👤</span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: '#4A4A2A' }}>Staff</h3>
                </div>
                <p className="text-lg font-serif" style={{ color: '#5A5A3A' }}>
                  {staffHotel}
                </p>
              </div>
              
              <div className="rounded-lg p-6 shadow-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(74, 74, 42, 0.2)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🚗</span>
                  <h3 className="text-2xl font-serif font-bold" style={{ color: '#4A4A2A' }}>Parking</h3>
                </div>
                <p className="text-lg font-serif" style={{ color: '#5A5A3A' }}>
                  {parking}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Follow the Action Section */}
        {instagramLink && (
          <section className="py-20 px-4 fade-in-section damask-pattern" style={{ opacity: 1, backgroundColor: '#4A7C7E' }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif mb-8" style={{ color: '#F5E6D3' }}>
                Follow the action
              </h2>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-full transition-all font-semibold shadow-md hover:shadow-lg cursor-pointer text-lg"
                style={{ background: 'linear-gradient(45deg, #E4405F, #C13584)', color: '#FFFFFF' }}
              >
                Click to open our Instagram page
              </a>
            </div>
          </section>
        )}

        {/* Countdown Section - Dark Blue Starry Sky with Fort Image Background */}
        <section className="py-20 px-4 fade-in-section relative overflow-hidden" style={{ opacity: 1, backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
          {/* Fort Image Background - Full Section */}
          <div 
            className="absolute inset-0"
            style={{ 
              zIndex: 1,
              backgroundImage: `url('/images/wedding-backgrounds/fort.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.7,
              filter: 'none',
            }}
          />
          
          {/* Dark Overlay for better text contrast - lighter so image shows */}
          <div className="absolute inset-0" style={{ zIndex: 2, backgroundColor: 'rgba(26, 26, 46, 0.4)' }} />
          
          {/* Stars - Full section */}
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  backgroundColor: '#FFFFFF',
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

           {/* Palace/Fort Illustration - Bottom half, more prominent */}
           <div 
             className="absolute bottom-0 left-0 right-0"
             style={{ 
               height: '60%',
               minHeight: '450px',
               zIndex: 4,
               backgroundImage: `url('/images/wedding-backgrounds/fort.jpg')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center bottom',
               backgroundRepeat: 'no-repeat',
               opacity: 1,
               filter: 'none',
               imageRendering: 'auto',
             }}
           />

          <div className="relative z-20 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: '#FFD700', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}>
              The countdown begins
            </h2>
            <div className="flex justify-center items-center gap-4 md:gap-6 mb-8">
              <div className="rounded-lg p-4 md:p-6 shadow-lg min-w-[80px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '2px solid #FFD700', backdropFilter: 'blur(5px)' }}>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FFD700', textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  {countdown.days}
                </div>
                <div className="text-sm md:text-base font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>D</div>
              </div>
              <div className="rounded-lg p-4 md:p-6 shadow-lg min-w-[80px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '2px solid #FFD700', backdropFilter: 'blur(5px)' }}>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FFD700', textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  {countdown.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>H</div>
              </div>
              <div className="rounded-lg p-4 md:p-6 shadow-lg min-w-[80px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '2px solid #FFD700', backdropFilter: 'blur(5px)' }}>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FFD700', textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  {countdown.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base font-serif" style={{ color: '#FFD700', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>M</div>
              </div>
            </div>
            <p className="text-lg md:text-xl font-serif px-4" style={{ color: '#FFD700', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)' }}>
              Our families are excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.
            </p>
          </div>
        </section>

        {/* Website Name - Bottom Center */}
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <p 
            className="text-xs font-serif italic"
            style={{ 
              color: '#F5E6D3',
              opacity: 0.6,
              letterSpacing: '0.5px',
              textShadow: 'none',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            cardoradigital.ca
          </p>
        </div>

        {/* CARDORA Watermark - Bottom Right */}
        <div 
          className="fixed bottom-3 right-3 z-40 pointer-events-none"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Georgia', serif",
            fontWeight: 500,
            fontSize: '15px',
            letterSpacing: '1px',
            color: 'rgba(245, 230, 211, 0.45)',
            fontStyle: 'italic',
            textShadow: 'none',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
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
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: '#8B4513', boxShadow: '0 10px 40px rgba(139, 69, 19, 0.4)' }}
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </>
  );
}
