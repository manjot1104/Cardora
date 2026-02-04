'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import api from '@/lib/api';
import { getAnimatedTemplateById } from '@/lib/animatedTemplates';
import Link from 'next/link';
import { getAudioUrl } from '@/lib/imageUtils';
import RSVPModal from '@/components/RSVPModal';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedWeddingInvite() {
  const params = useParams();
  const containerRef = useRef(null);
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const audioRef = useRef(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  useEffect(() => {
    fetchWeddingData();
  }, [params.slug]);

  useEffect(() => {
    if (weddingData && template) {
      initAnimations();
    }
  }, [weddingData, template]);

  const fetchWeddingData = async () => {
    try {
      // Fetch wedding data by slug
      const response = await api.get(`/wedding/${params.slug}`);
      const data = response.data;
      setWeddingData(data);
      
      // Get template
      const templateData = getAnimatedTemplateById(data.templateId || 'luxury-hills');
      setTemplate(templateData);
    } catch (error) {
      console.error('Error fetching wedding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initAnimations = () => {
    // Initialize smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Animate elements on scroll
    gsap.utils.toArray('.fade-up').forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Parallax background
    gsap.utils.toArray('.parallax-bg').forEach((element) => {
      gsap.to(element, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Envelope opening animation (if template has it)
    if (template?.hasEnvelope) {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from('.envelope', {
        scale: 0.8,
        rotation: -5,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
      })
        .to('.envelope-flap', {
          rotationX: -180,
          transformOrigin: 'top center',
          duration: 1,
          ease: 'power2.in',
        }, '-=0.3')
        .from('.envelope-content', {
          y: 50,
          opacity: 0,
          duration: 1,
        }, '-=0.5');
    }
  };

  if (loading || !weddingData || !template) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading your invitation...</div>
      </div>
    );
  }

  const TemplateComponent = template.component;
  const isDemo = weddingData.isDemo || !weddingData.invitePaid;

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 text-center shadow-lg">
          <p className="text-sm font-semibold">
            🎭 Demo Mode - Complete payment to unlock your personalized invitation
          </p>
        </div>
      )}

      {/* Background Music */}
      {weddingData.music && (
        <audio ref={audioRef} autoPlay loop>
          <source src={getAudioUrl(weddingData.music)} type="audio/mpeg" />
          <source src={getAudioUrl(weddingData.music)} type="audio/wav" />
          <source src={getAudioUrl(weddingData.music)} type="audio/ogg" />
        </audio>
      )}

      {/* Render Template */}
      <TemplateComponent 
        data={weddingData} 
        onRSVPClick={() => setShowRSVPModal(true)}
      />

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        inviteSlug={params.slug}
      />

      {/* Website Name - Below Action Buttons */}
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <p 
          className="text-xs opacity-70 font-serif italic text-center"
          style={{ 
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
          }}
        >
          cardoradigital.ca
        </p>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-2 sm:gap-4 px-4 w-full sm:w-auto max-w-sm sm:max-w-none">
        {isDemo ? (
          <a
            href={`/dashboard/animated-invite`}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            💳 Unlock Your Invite
          </a>
        ) : (
          <button
            onClick={async () => {
              try {
                const response = await api.post('/download/invite');
                if (response.data.success) {
                  alert('Invite downloaded to your gallery!');
                }
              } catch (error) {
                console.error('Download error:', error);
                alert('Failed to download invite');
              }
            }}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            💾 Download to Gallery
          </button>
        )}
      </div>
    </div>
  );
}
