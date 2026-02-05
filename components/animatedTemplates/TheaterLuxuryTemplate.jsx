'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getBackgroundImageUrl, getImageUrl, getAudioUrl } from '@/lib/imageUtils';

export default function TheaterLuxuryTemplate({ data, onRSVPClick }) {
  const containerRef = useRef(null);
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const audioRef = useRef(null);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [dateRevealed, setDateRevealed] = useState(false);
  const [revealedCircles, setRevealedCircles] = useState([false, false, false]);
  const scratchRefs = [useRef(null), useRef(null), useRef(null)];
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'December 15, 2024';
  const venue = data.venue || 'Grand Ballroom';
  const weddingTime = data.weddingTime || '6:00 PM';
  const musicUrl = data.music ? getAudioUrl(data.music) : null;

  // Handle music playback
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (musicPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Auto-play prevented:', err);
          // User interaction required for autoplay in some browsers
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, musicUrl]);

  // Auto-play music when curtains open
  useEffect(() => {
    if (curtainsOpen && audioRef.current && musicUrl && musicPlaying) {
      audioRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, [curtainsOpen, musicUrl, musicPlaying]);

  // Parse wedding date for countdown
  useEffect(() => {
    const calculateCountdown = () => {
      if (!weddingDate) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      let targetDate;
      
      try {
        // Try to parse as Date object first
        targetDate = new Date(weddingDate);
        
        // If invalid, try to parse common formats
        if (isNaN(targetDate.getTime())) {
          // Try formats like "December 15, 2024" or "15 December 2024"
          const dateStr = weddingDate.trim();
          
          // Extract day, month, year
          const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
          const yearMatch = dateStr.match(/\b(20\d{2}|19\d{2})\b/);
          
          let day = dayMatch ? parseInt(dayMatch[1]) : 15;
          let year = yearMatch ? parseInt(yearMatch[1]) : 2024;
          
          // Extract month
          const monthMap = {
            'january': 0, 'jan': 0,
            'february': 1, 'feb': 1,
            'march': 2, 'mar': 2,
            'april': 3, 'apr': 3,
            'may': 4,
            'june': 5, 'jun': 5,
            'july': 6, 'jul': 6,
            'august': 7, 'aug': 7,
            'september': 8, 'sept': 8, 'sep': 8,
            'october': 9, 'oct': 9,
            'november': 10, 'nov': 10,
            'december': 11, 'dec': 11,
          };
          
          const lowerStr = dateStr.toLowerCase();
          let month = 11; // Default to December
          
          for (const [key, value] of Object.entries(monthMap)) {
            if (lowerStr.includes(key)) {
              month = value;
              break;
            }
          }
          
          targetDate = new Date(year, month, day);
        }
        
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setCountdown({ days, hours, minutes, seconds });
        } else {
          // Date has passed
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error('Countdown calculation error:', error);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  // Curtain opening animation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const tl = gsap.timeline({ onComplete: () => setCurtainsOpen(true) });
    
    // Initial curtain position
    if (leftCurtainRef.current && rightCurtainRef.current) {
      gsap.set([leftCurtainRef.current, rightCurtainRef.current], {
        x: 0,
      });
      
      // Open curtains
      tl.to(leftCurtainRef.current, {
        x: '-100%',
        duration: 2,
        ease: 'power2.inOut',
      })
      .to(rightCurtainRef.current, {
        x: '100%',
        duration: 2,
        ease: 'power2.inOut',
      }, '-=2');
    }
  }, []);

  // Scratch reveal handler
  const handleScratch = (index) => {
    if (revealedCircles[index]) return;
    
    const newRevealed = [...revealedCircles];
    newRevealed[index] = true;
    setRevealedCircles(newRevealed);
    
    // Animate reveal
    gsap.from(scratchRefs[index].current, {
      scale: 0,
      rotation: 360,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });
    
    // Check if all revealed
    if (newRevealed.every(r => r)) {
      setDateRevealed(true);
      // Confetti animation
      setTimeout(() => {
        createConfetti();
      }, 500);
    }
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#8B0000', '#DAA520', '#F5F5DC'][Math.floor(Math.random() * 3)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      document.body.appendChild(confetti);
      
      gsap.to(confetti, {
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 3 + Math.random() * 2,
        ease: 'power2.out',
        onComplete: () => confetti.remove(),
      });
    }
  };

  // Parse date for reveal circles
  const parseDate = () => {
    const dateStr = weddingDate;
    let day = '15', month = 'Dec', year = '2024';
    
    try {
      // Try to parse as Date object first
      const dateObj = new Date(dateStr);
      if (!isNaN(dateObj.getTime())) {
        day = String(dateObj.getDate());
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        month = monthNames[dateObj.getMonth()];
        year = String(dateObj.getFullYear());
      } else {
        // Fallback: try to extract from string
        const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
        if (dayMatch) day = dayMatch[1];
        
        const yearMatch = dateStr.match(/\b(20\d{2})\b/);
        if (yearMatch) year = yearMatch[1];
        
        // Extract month name
        const monthMap = {
          'january': 'Jan', 'jan': 'Jan',
          'february': 'Feb', 'feb': 'Feb',
          'march': 'Mar', 'mar': 'Mar',
          'april': 'Apr', 'apr': 'Apr',
          'may': 'May',
          'june': 'Jun', 'jun': 'Jun',
          'july': 'Jul', 'jul': 'Jul',
          'august': 'Aug', 'aug': 'Aug',
          'september': 'Sept', 'sept': 'Sept', 'sep': 'Sept',
          'october': 'Oct', 'oct': 'Oct',
          'november': 'Nov', 'nov': 'Nov',
          'december': 'Dec', 'dec': 'Dec',
        };
        
        const lowerStr = dateStr.toLowerCase();
        for (const [key, value] of Object.entries(monthMap)) {
          if (lowerStr.includes(key)) {
            month = value;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }
    
    return [day, month, year];
  };

  const [day, month, year] = parseDate();

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F5F5DC] relative overflow-hidden">
      {/* Background Music */}
      {musicUrl && (
        <audio
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => setMusicPlaying(true)}
          onPause={() => setMusicPlaying(false)}
        >
          <source src={musicUrl} type="audio/mpeg" />
          <source src={musicUrl} type="audio/wav" />
          <source src={musicUrl} type="audio/ogg" />
        </audio>
      )}

      {/* Music Toggle */}
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
          style={{ boxShadow: '0 10px 40px rgba(139, 0, 0, 0.4)' }}
          aria-label={musicPlaying ? 'Pause music' : 'Play music'}
        >
          {musicPlaying ? '🔊' : '🔇'}
        </button>
      )}

      {/* Curtains */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          ref={leftCurtainRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#8B0000] to-[#6B0000]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
            boxShadow: 'inset -10px 0 30px rgba(0, 0, 0, 0.5)',
          }}
        />
        <div
          ref={rightCurtainRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#8B0000] to-[#6B0000]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            )`,
            boxShadow: 'inset 10px 0 30px rgba(0, 0, 0, 0.5)',
          }}
        />
        {/* Curtain hem */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-[#8B0000] opacity-80" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%, 2% 60%, 4% 50%, 6% 60%, 8% 50%, 10% 60%, 12% 50%, 14% 60%, 16% 50%, 18% 60%, 20% 50%, 22% 60%, 24% 50%, 26% 60%, 28% 50%, 30% 60%, 32% 50%, 34% 60%, 36% 50%, 38% 60%, 40% 50%, 42% 60%, 44% 50%, 46% 60%, 48% 50%, 50% 60%, 52% 50%, 54% 60%, 56% 50%, 58% 60%, 60% 50%, 62% 60%, 64% 50%, 66% 60%, 68% 50%, 70% 60%, 72% 50%, 74% 60%, 76% 50%, 78% 60%, 80% 50%, 82% 60%, 84% 50%, 86% 60%, 88% 50%, 90% 60%, 92% 50%, 94% 60%, 96% 50%, 98% 60%, 100% 50%, 100% 100%)',
        }} />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 bg-[#F5F5DC]" style={{
        backgroundImage: data.backgroundImage ? getBackgroundImageUrl(data.backgroundImage) : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dark Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        {/* Light Overlay for Better Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30 z-0"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: curtainsOpen ? 1 : 0, y: curtainsOpen ? 0 : 50 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center px-6 relative z-10"
        >
          <p className="text-sm sm:text-base text-white mb-4 tracking-widest uppercase font-light drop-shadow-lg" style={{
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
          }}>
            YOU ARE CORDIALLY INVITED TO CELEBRATE THE WEDDING OF
          </p>
          <h1 className="mb-4">
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold italic mb-2 text-white" style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7), 0 0 50px rgba(139, 0, 0, 0.5)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              transform: 'translateZ(0)',
            }}>
              {groomName.toUpperCase()}
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-light italic my-3 text-white" style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
            }}>
              &
            </div>
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold italic mt-2 text-white" style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7), 0 0 50px rgba(139, 0, 0, 0.5)',
            }}>
              {brideName.toUpperCase()}
            </div>
          </h1>
          <p className="text-sm sm:text-base text-white mt-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg" style={{
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
          }}>
            WE WOULD LIKE TO INVITE YOU TO CELEBRATE WITH US THE MOST SPECIAL DAY OF OUR LIVES. 
            IT WOULD BE AN HONOR TO HAVE YOU PRESENT AT THIS IMPORTANT MOMENT.
          </p>
        </motion.div>
      </section>

      {/* Scratch Reveal Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <div className="text-4xl mb-4">👆</div>
            <p className="text-sm sm:text-base text-[#8B0000] mb-4">Scratch all three circles to continue</p>
            <h2 className="text-5xl sm:text-6xl font-serif mb-4" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
              Reveal
            </h2>
            <p className="text-sm sm:text-base text-[#8B0000] uppercase tracking-wider mb-8">
              SCRATCH TO DISCOVER THE DATE
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-12">
            {[day, month, year].map((value, index) => (
              <motion.div
                key={index}
                ref={scratchRefs[index]}
                onClick={() => handleScratch(index)}
                className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold cursor-pointer transition-all overflow-hidden ${
                  revealedCircles[index]
                    ? 'bg-[#DAA520] text-[#8B0000] shadow-2xl scale-110'
                    : 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] hover:scale-105'
                }`}
                style={{
                  background: revealedCircles[index] 
                    ? '#DAA520'
                    : 'radial-gradient(circle at 30% 30%, #F4D03F 0%, #D4AF37 30%, #B8860B 100%)',
                  boxShadow: revealedCircles[index] 
                    ? '0 10px 40px rgba(218, 165, 32, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
                    : '0 5px 20px rgba(0, 0, 0, 0.3), inset 0 -2px 10px rgba(0, 0, 0, 0.2)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {!revealedCircles[index] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#8B6914] opacity-90" 
                    style={{
                      backgroundImage: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, transparent 20%, rgba(0,0,0,0.1) 100%)`,
                    }}
                  />
                )}
                {revealedCircles[index] ? (
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-[#8B0000] z-10 relative"
                  >
                    {value}
                  </motion.span>
                ) : (
                  <span className="text-white/30 text-3xl">?</span>
                )}
              </motion.div>
            ))}
          </div>

          {dateRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-serif" style={{
                fontFamily: 'Brush Script MT, cursive',
                color: '#8B0000',
              }}>
                We're getting married!
              </p>
            </motion.div>
          )}
        </section>
      )}

      {/* Countdown Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl font-serif mb-12" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
            Countdown
          </motion.h2>
          
          <div ref={countdownRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { label: 'DAYS', value: countdown.days },
              { label: 'HOURS', value: String(countdown.hours).padStart(2, '0') },
              { label: 'MIN', value: String(countdown.minutes).padStart(2, '0') },
              { label: 'SEC', value: String(countdown.seconds).padStart(2, '0') },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-[#8B0000] p-6 sm:p-8 text-center bg-white/50 rounded-lg"
                style={{
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  transform: 'translateZ(0)',
                }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-[#8B0000] mb-2">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm text-[#8B0000] uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-sm sm:text-base text-[#8B0000]">until the big day</p>
        </section>
      )}

      {/* Venue Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl w-full"
          >
            <p className="text-sm sm:text-base text-[#8B0000] mb-2 uppercase tracking-wider">
              THE CELEBRATION WILL TAKE PLACE
            </p>
            <p className="text-sm sm:text-base text-[#8B0000] mb-8 uppercase tracking-wider">AT</p>
            
            {/* Venue Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 p-6 sm:p-8 bg-white/90 rounded-lg border-2 border-[#8B0000] relative"
            >
              {/* Hand-drawn style venue illustration */}
              <svg viewBox="0 0 400 300" className="w-full h-auto mb-6" style={{ maxHeight: '300px' }}>
                {/* Building structure */}
                <rect x="100" y="100" width="200" height="150" fill="none" stroke="#8B0000" strokeWidth="3" rx="5"/>
                {/* Windows */}
                <rect x="120" y="120" width="30" height="40" fill="none" stroke="#8B0000" strokeWidth="2"/>
                <rect x="170" y="120" width="30" height="40" fill="none" stroke="#8B0000" strokeWidth="2"/>
                <rect x="220" y="120" width="30" height="40" fill="none" stroke="#8B0000" strokeWidth="2"/>
                <rect x="270" y="120" width="30" height="40" fill="none" stroke="#8B0000" strokeWidth="2"/>
                {/* Door */}
                <rect x="180" y="200" width="40" height="50" fill="none" stroke="#8B0000" strokeWidth="3"/>
                {/* Roof */}
                <polygon points="90,100 200,50 310,100" fill="none" stroke="#8B0000" strokeWidth="3"/>
                {/* Columns */}
                <line x1="150" y1="100" x2="150" y2="250" stroke="#8B0000" strokeWidth="2"/>
                <line x1="250" y1="100" x2="250" y2="250" stroke="#8B0000" strokeWidth="2"/>
                {/* Trees */}
                <circle cx="80" cy="220" r="20" fill="#8B0000" opacity="0.3"/>
                <circle cx="320" cy="220" r="20" fill="#8B0000" opacity="0.3"/>
                {/* Path */}
                <ellipse cx="200" cy="260" rx="80" ry="20" fill="#8B0000" opacity="0.2"/>
              </svg>
              
              <div className="text-center text-[#8B0000]">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4" style={{
                  fontFamily: 'Georgia, serif',
                }}>
                  {venue}
                </h3>
                <p className="text-sm sm:text-base mb-6 font-medium">{weddingTime}</p>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#8B0000] text-white rounded-full hover:bg-[#6B0000] transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  View on Map →
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Gallery / Love Story Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-serif mb-12 text-center" style={{
              fontFamily: 'Georgia, serif',
              color: '#8B0000',
            }}>
            Our Story
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl w-full"
          >
            <div className="w-full h-96 sm:h-[500px] rounded-lg overflow-hidden shadow-2xl mb-8 bg-gray-200 relative">
              <img
                src={getImageUrl(data.couplePhoto || '/images/wedding-backgrounds/traditional-wedding-couple.jpg')}
                alt="Couple"
                className="w-full h-full object-cover"
                style={{
                  imageRendering: 'auto',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = '/images/wedding-backgrounds/traditional-wedding-couple.jpg';
                }}
              />
            </div>
            {data.story && (
              <p className="text-base sm:text-lg text-[#8B0000] leading-relaxed text-center max-w-2xl mx-auto">
                {data.story}
              </p>
            )}
          </motion.div>
        </section>
      )}

      {/* Dress Code */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl"
          >
            <p className="text-sm sm:text-base text-[#8B0000] mb-4 italic">
              We invite you to dress elegantly and formally to celebrate this special day with us.
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif mb-4" style={{
              fontFamily: 'Georgia, serif',
              color: '#8B0000',
            }}>
              Formal Attire
            </h2>
            <p className="text-xl sm:text-2xl font-serif mb-8" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
              Please avoid wearing white
            </p>
          </motion.div>
        </section>
      )}

      {/* Gifts / RSVP Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl w-full"
          >
            <h2 className="text-3xl sm:text-4xl font-serif mb-4" style={{
              fontFamily: 'Georgia, serif',
              color: '#8B0000',
            }}>
              WEDDING REGISTRY
            </h2>
            
            {/* Wedding car illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ maxHeight: '200px' }}>
                {/* Car body */}
                <rect x="100" y="120" width="200" height="60" rx="5" fill="none" stroke="#8B0000" strokeWidth="3"/>
                {/* Car roof */}
                <polygon points="120,120 200,80 280,120" fill="none" stroke="#8B0000" strokeWidth="3"/>
                {/* Wheels */}
                <circle cx="150" cy="180" r="20" fill="none" stroke="#8B0000" strokeWidth="3"/>
                <circle cx="250" cy="180" r="20" fill="none" stroke="#8B0000" strokeWidth="3"/>
                {/* Veil */}
                <path d="M 100 120 Q 150 100 200 120" fill="none" stroke="#8B0000" strokeWidth="2" strokeDasharray="5,5"/>
                {/* Cans */}
                <circle cx="80" cy="150" r="8" fill="#8B0000" opacity="0.5"/>
                <circle cx="320" cy="150" r="8" fill="#8B0000" opacity="0.5"/>
              </svg>
            </motion.div>
            
            <h3 className="text-3xl sm:text-4xl font-serif mb-6" style={{
              fontFamily: 'Georgia, serif',
              color: '#8B0000',
            }}>
              Gifts
            </h3>
            <p className="text-sm sm:text-base text-[#8B0000] mb-8 leading-relaxed max-w-2xl mx-auto">
              Your presence is the best gift we could receive. However, if you wish to contribute to our new life together, you can do so via bank transfer.
            </p>
            
            <div className="space-y-4 mb-8">
              <button 
                onClick={onRSVPClick}
                className="px-8 py-4 bg-[#8B0000] text-white rounded-full hover:bg-[#6B0000] transition-all font-semibold shadow-lg hover:shadow-xl cursor-pointer"
              >
                Confirm Attendance
              </button>
            </div>
            
            <p className="text-2xl sm:text-3xl font-serif" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
              With all our love
            </p>
          </motion.div>
        </section>
      )}

      {/* Thank You Section */}
      {curtainsOpen && (
        <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#F5F5DC] relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border-4 border-[#8B0000] rounded-lg p-12 bg-white/90 max-w-md w-full text-center relative"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 30px, 30px 30px, 30px 0)',
            }}
          >
            <h2 className="text-5xl sm:text-6xl font-serif mb-6" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
              Thank You
            </h2>
            <p className="text-sm sm:text-base text-[#8B0000] mb-8 leading-relaxed">
              For joining us on this special day. Your presence is the best gift we could receive.
            </p>
            <p className="text-3xl sm:text-4xl font-serif" style={{
              fontFamily: 'Brush Script MT, cursive',
              color: '#8B0000',
            }}>
              {groomName} & {brideName}
            </p>
          </motion.div>
        </section>
      )}

      {/* CARDORA Watermark - Bottom Right */}
      <div 
        className="fixed bottom-20 right-6 z-40 pointer-events-none"
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontWeight: 700,
          fontSize: '20px',
          letterSpacing: '2px',
          color: 'rgba(139, 0, 0, 0.5)',
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
            color: '#8B0000',
            textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
          }}
        >
          cardoradigital.ca
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
