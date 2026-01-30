'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getBackgroundImageUrl } from '@/lib/imageUtils';

export default function MotionVideoTemplate({ data }) {
  const containerRef = useRef(null);
  const sealRef = useRef(null);
  const contentRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);

  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  useEffect(() => {
    // Initial entrance animation - keep brightness
    gsap.from(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
    });
    
    // Ensure container stays bright
    gsap.set(containerRef.current, {
      opacity: 1,
      filter: 'brightness(1.1)',
    });

    // Continuous floating animation for seal
    if (sealRef.current && !isOpened) {
      gsap.to(sealRef.current, {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, [isOpened]);

  const handleSealClick = () => {
    if (isOpened) return;
    
    setIsOpened(true);
    const tl = gsap.timeline();
    
    // Seal breaking animation
    tl.to(sealRef.current, {
      scale: 1.2,
      rotation: 360,
      opacity: 0,
      duration: 0.8,
      ease: 'back.in(1.7)',
    })
    .from(contentRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.3')
    .set(contentRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'brightness(1.2)',
      clearProps: 'all',
    });
    
    // Ensure container and all sections stay bright and visible
    gsap.set(containerRef.current, {
      filter: 'brightness(1.1)',
    });
    
    // Lock content visibility permanently
    setTimeout(() => {
      if (contentRef.current) {
        gsap.set(contentRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'brightness(1.2)',
          clearProps: 'all',
        });
        contentRef.current.style.opacity = '1';
        contentRef.current.style.transform = 'translateY(0) scale(1)';
      }
    }, 1200);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-purple-300 via-pink-300 to-rose-300 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #e9d5ff, #fce7f3, #fecdd3)',
    }}>
      {/* Bright Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 pointer-events-none"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-yellow-200 rounded-full opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 20px rgba(255, 255, 150, 0.8), 0 0 40px rgba(255, 255, 100, 0.4)',
            }}
          />
        ))}
      </div>

      {/* Hero Section with Seal - Background Image */}
      <section className="h-screen flex items-center justify-center relative z-10">
        {/* Background Image */}
        {data.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getBackgroundImageUrl(data.backgroundImage),
              opacity: 0.7,
              zIndex: 0,
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #e9d5ff, #fce7f3, #fecdd3)',
          opacity: 0.6,
          zIndex: 1,
        }}></div>
        
        <div className="text-center relative z-10">
          {!isOpened ? (
            <div
              ref={sealRef}
              onClick={handleSealClick}
              className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
            >
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-400 to-purple-500 rounded-full shadow-2xl border-4 border-white flex items-center justify-center" style={{
                  boxShadow: '0 0 60px rgba(251, 113, 133, 0.8), 0 0 120px rgba(192, 132, 252, 0.6), 0 0 180px rgba(236, 72, 153, 0.4)',
                }}>
                  <div className="text-6xl font-serif text-white" style={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 2px 2px 8px rgba(0, 0, 0, 0.3)',
                  }}>
                    {groomName.charAt(0)}&{brideName.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 rounded-full shadow-lg" style={{
                  boxShadow: '0 4px 20px rgba(251, 113, 133, 0.7), 0 0 30px rgba(236, 72, 153, 0.5)',
                }}>
                  Tap to Open
                </div>
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="space-y-6 relative z-10" style={{ 
              opacity: 1,
              visibility: 'visible',
              display: 'block',
            }}>
              <h1 className="text-7xl font-serif text-purple-900 mb-4" style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 2px 2px 8px rgba(255, 255, 255, 0.6)',
                opacity: 1,
              }}>
                {groomName} & {brideName}
              </h1>
              <p className="text-2xl text-pink-700 mb-2 font-medium" style={{
                textShadow: '1px 1px 3px rgba(255, 255, 255, 0.9)',
                opacity: 1,
              }}>
                Are getting married
              </p>
              <p className="text-xl text-amber-700 font-semibold" style={{
                textShadow: '1px 1px 3px rgba(255, 255, 255, 0.9)',
                opacity: 1,
              }}>
                {weddingDate}
              </p>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {isOpened && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-3xl">👇</div>
          </div>
        )}
      </section>

      {/* Story Section with Couple Photo */}
      {isOpened && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center relative" style={{
          filter: 'brightness(1.15)',
          opacity: 1,
        }}>
          {/* Couple Photo Background */}
          {data.couplePhoto && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: getBackgroundImageUrl(data.couplePhoto),
                opacity: 0.85,
                zIndex: 0,
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, #e9d5ff, #fce7f3, #fecdd3)',
            opacity: 0.3,
            zIndex: 1,
          }}></div>
          
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-10"></div>
          <div className="relative z-20">
            <h2 className="text-6xl font-serif text-purple-900 mb-8" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 2px 2px 8px rgba(255, 255, 255, 0.7)',
              opacity: 1,
              filter: 'brightness(1.1)',
            }}>
              Our Story
            </h2>
            <p className="max-w-2xl text-lg text-pink-800 leading-relaxed font-medium" style={{
              textShadow: '1px 1px 3px rgba(255, 255, 255, 1)',
              opacity: 1,
              filter: 'brightness(1.1)',
            }}>
              {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
            </p>
          </div>
        </section>
      )}

      {/* Event Details with Map - Background Image */}
      {isOpened && (
        <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative" style={{
          filter: 'brightness(1.15)',
          opacity: 1,
        }}>
          {/* Background Image */}
          {data.backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: getBackgroundImageUrl(data.backgroundImage),
                opacity: 0.85,
                zIndex: 0,
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, #e9d5ff, #fce7f3, #fecdd3)',
            opacity: 0.3,
            zIndex: 1,
          }}></div>
          
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-10"></div>
          <h2 className="text-6xl font-serif text-purple-900 mb-12 relative z-20" style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 2px 2px 8px rgba(255, 255, 255, 0.7)',
            opacity: 1,
            filter: 'brightness(1.1)',
          }}>
            Wedding Ceremony
          </h2>

          <div className="w-full max-w-4xl space-y-8 relative z-20">
            <div className="bg-gradient-to-r from-rose-200/95 via-pink-200/95 to-purple-200/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-2 border-white" style={{
              boxShadow: '0 10px 50px rgba(251, 113, 133, 0.4), 0 0 80px rgba(192, 132, 252, 0.3), 0 0 100px rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(to right, rgba(251, 113, 133, 0.95), rgba(244, 114, 182, 0.95), rgba(192, 132, 252, 0.95))',
              opacity: 1,
              filter: 'brightness(1.2)',
            }}>
              <div className="text-2xl text-purple-900 mb-3 font-bold" style={{
                textShadow: '1px 1px 4px rgba(255, 255, 255, 1)',
                opacity: 1,
              }}>
                <span className="text-3xl mr-2">📍</span>
                {venue}
              </div>
              <div className="text-xl text-amber-800 font-semibold" style={{
                textShadow: '1px 1px 4px rgba(255, 255, 255, 1)',
                opacity: 1,
              }}>
                <span className="mr-2">🕕</span>
                {data.weddingTime || '6:00 PM onwards'}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-gradient-to-br from-purple-100/95 to-pink-100/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-white relative" style={{
              boxShadow: '0 10px 50px rgba(192, 132, 252, 0.4), 0 0 80px rgba(255, 255, 255, 0.3)',
              background: 'linear-gradient(to bottom right, rgba(192, 132, 252, 0.95), rgba(244, 114, 182, 0.95))',
              opacity: 1,
              filter: 'brightness(1.2)',
              minHeight: '600px',
              height: '600px',
            }}>
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white" style={{ minHeight: '600px' }}>
                {venue ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '600px' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`}
                    title={`Map location for ${venue}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Map will be displayed here</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* RSVP Section - Couple Photo Background */}
      {isOpened && (
        <section className="h-screen flex flex-col justify-center items-center relative" style={{
          filter: 'brightness(1.15)',
          opacity: 1,
        }}>
          {/* Couple Photo Background */}
          {data.couplePhoto && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: getBackgroundImageUrl(data.couplePhoto),
                opacity: 0.85,
                zIndex: 0,
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, #e9d5ff, #fce7f3, #fecdd3)',
            opacity: 0.3,
            zIndex: 1,
          }}></div>
          
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-10"></div>
          <h2 className="text-5xl font-serif text-purple-900 mb-8 relative z-20" style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 2px 2px 8px rgba(255, 255, 255, 0.7)',
            opacity: 1,
            filter: 'brightness(1.1)',
          }}>
            Will you join us?
          </h2>
          <button className="px-16 py-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 text-white rounded-full text-xl font-bold shadow-2xl hover:scale-110 transition-transform active:scale-95 relative z-20" style={{
            boxShadow: '0 10px 60px rgba(251, 191, 36, 0.8), 0 0 100px rgba(236, 72, 153, 0.6), 0 0 150px rgba(251, 191, 36, 0.4)',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(to right, #fde047, #fb923c, #f9a8d4)',
            opacity: 1,
            filter: 'brightness(1.2)',
          }}>
            Confirm Attendance
          </button>
        </section>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .fade-in {
          opacity: 1 !important;
          filter: brightness(1.2) !important;
        }
        section {
          filter: brightness(1.1) !important;
        }
      `}</style>
    </div>
  );
}
