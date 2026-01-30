'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import api from '@/lib/api';
import { getAnimatedTemplateById } from '@/lib/animatedTemplates';

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

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden">
      {/* Background Music */}
      {weddingData.music && (
        <audio ref={audioRef} autoPlay loop>
          <source src={weddingData.music} type="audio/mpeg" />
        </audio>
      )}

      {/* Render Template */}
      <TemplateComponent data={weddingData} />
    </div>
  );
}
