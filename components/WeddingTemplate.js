'use client';

import { useState } from 'react';
import { getTemplateById } from '@/lib/templates';
import { getSignatureTemplateById } from '@/lib/signatureTemplates';

export default function WeddingTemplate({ user, templateId, cardType = 'wedding' }) {
  // Get template data - check signature templates first, then regular templates
  const signatureTemplate = getSignatureTemplateById(templateId);
  const regularTemplate = getTemplateById(templateId);
  const template = signatureTemplate || regularTemplate;

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Template not found</p>
        </div>
      </div>
    );
  }

  // Extract user data with fallbacks
  const groomName = user?.groomName || user?.name?.split(' & ')[0] || 'John';
  const brideName = user?.brideName || user?.name?.split(' & ')[1] || user?.name?.split(' & ')[0] || 'Jane';
  const weddingDate = user?.weddingDate || user?.address || 'December 15, 2024';
  const venue = user?.venue || user?.company || 'Grand Ballroom';
  const brideFatherName = user?.brideFatherName || '';
  const brideMotherName = user?.brideMotherName || '';
  const groomFatherName = user?.groomFatherName || '';
  const groomMotherName = user?.groomMotherName || '';
  const deceasedElders = user?.deceasedElders || '';

  // Determine event type emoji and title
  const eventType = cardType || 'wedding';
  const eventEmoji = eventType === 'engagement' ? '💍' : eventType === 'anniversary' ? '🎉' : '💒';
  const eventTitle = eventType === 'engagement' ? 'Engagement' : eventType === 'anniversary' ? 'Anniversary' : 'Wedding';

  return (
    <div 
      className="w-screen h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary} 100%)`,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Premium Background Decorations - Flowers, Leaves & Couple Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Decorative Leaves - Top */}
        <div className="absolute top-0 left-0 w-48 h-48 opacity-15 animate-float">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.accent }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-56 h-56 opacity-12 animate-float animation-delay-2000 transform rotate-180">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.primary }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        
        {/* Bottom Leaves */}
        <div className="absolute bottom-0 left-0 w-52 h-52 opacity-15 animate-float animation-delay-4000 transform rotate-90">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.accent }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-12 animate-float transform -rotate-90">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.primary }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        
        {/* Side Leaves */}
        <div className="absolute top-1/4 left-5 w-32 h-32 opacity-10 animate-float animation-delay-2000 transform -rotate-45">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.accent }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-5 w-36 h-36 opacity-10 animate-float animation-delay-4000 transform rotate-45">
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: template.colors.primary }}>
            <path d="M100 20 Q120 60 140 80 Q160 100 180 140 Q160 160 140 180 Q120 160 100 200 Q80 160 60 180 Q40 160 20 140 Q40 100 60 80 Q80 60 100 20 Z" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>
        
        {/* Floating Flowers */}
        <div className="absolute top-10 left-10 text-5xl opacity-20 animate-float" style={{ color: template.colors.accent }}>
          🌸
        </div>
        <div className="absolute top-20 right-20 text-4xl opacity-15 animate-float animation-delay-2000" style={{ color: template.colors.primary }}>
          🌺
        </div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float animation-delay-4000" style={{ color: template.colors.accent }}>
          🌷
        </div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-15 animate-float" style={{ color: template.colors.primary }}>
          🌹
        </div>
        
        {/* Small Sparkles */}
        <div className="absolute top-1/2 left-5 text-3xl opacity-10 animate-sparkle animation-delay-2000" style={{ color: template.colors.accent }}>
          ✨
        </div>
        <div className="absolute top-1/3 right-5 text-3xl opacity-10 animate-sparkle animation-delay-4000" style={{ color: template.colors.primary }}>
          ✨
        </div>
        <div className="absolute bottom-1/3 left-10 text-2xl opacity-10 animate-sparkle" style={{ color: template.colors.accent }}>
          ✨
        </div>
        <div className="absolute top-1/4 right-10 text-2xl opacity-10 animate-sparkle animation-delay-2000" style={{ color: template.colors.primary }}>
          ✨
        </div>
        
        {/* Decorative Circles */}
        <div 
          className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl animate-blob"
          style={{ backgroundColor: template.colors.primary }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl animate-blob animation-delay-2000"
          style={{ backgroundColor: template.colors.accent }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl animate-blob animation-delay-4000"
          style={{ backgroundColor: template.colors.accent }}
        ></div>
        
        {/* Floral Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M75 10 L85 40 L110 40 L95 60 L100 90 L75 75 L50 90 L55 60 L40 40 L65 40 Z' fill='${encodeURIComponent(template.colors.primary)}' opacity='0.3'/%3E%3Cpath d='M75 80 Q85 85 90 95 Q85 105 75 110 Q65 105 60 95 Q65 85 75 80' fill='${encodeURIComponent(template.colors.accent)}' opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
            backgroundRepeat: 'repeat',
          }}
        ></div>
        
        {/* Heart Patterns for Couple Theme */}
        <div className="absolute top-1/5 left-1/4 text-6xl opacity-8 animate-float" style={{ color: template.colors.accent }}>
          💕
        </div>
        <div className="absolute bottom-1/5 right-1/4 text-5xl opacity-8 animate-float animation-delay-2000" style={{ color: template.colors.primary }}>
          💕
        </div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-6 animate-float animation-delay-4000" style={{ color: template.colors.accent }}>
          💑
        </div>
        <div className="absolute top-2/3 right-1/3 text-4xl opacity-6 animate-float" style={{ color: template.colors.primary }}>
          💑
        </div>
        
        {/* Vine/Branch Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg viewBox="0 0 1200 800" className="w-full h-full" style={{ color: template.colors.accent }}>
            <path d="M0 200 Q150 150 250 200 T500 200 T750 200 T1000 200 T1200 200" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.4"/>
            <path d="M200 0 Q200 100 200 200 T200 400 T200 600 T200 800" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.3"/>
            <path d="M1000 0 Q1000 100 1000 200 T1000 400 T1000 600 T1000 800" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Main Card - Full Width & Full Height */}
      <div 
        className="w-full h-full relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md overflow-hidden border-0"
        style={{ 
          borderColor: template.colors.accent,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Premium Header Section with Decorative Elements */}
        <div 
          className="text-center py-4 sm:py-5 px-4 sm:px-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          }}
        >
          {/* Header Background Decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 text-2xl">🌿</div>
            <div className="absolute top-2 right-2 text-2xl">🌿</div>
            <div className="absolute bottom-2 left-2 text-2xl">🌿</div>
            <div className="absolute bottom-2 right-2 text-2xl">🌿</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl">✨</div>
          </div>

          <div className="relative z-10">
            <div className="text-3xl sm:text-4xl mb-1 animate-float">{eventEmoji}</div>
            <h1 
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 drop-shadow-lg"
              style={{ color: template.colors.text }}
            >
              {eventTitle} Invitation
            </h1>
            <div 
              className="text-base sm:text-lg md:text-xl font-semibold mt-1 drop-shadow-md"
              style={{ color: template.colors.text }}
            >
              {groomName} & {brideName}
            </div>
            
            {/* Decorative Divider in Header */}
            <div className="flex items-center justify-center mt-1.5 gap-1.5">
              <div className="text-base">💐</div>
              <div 
                className="h-0.5 w-12 rounded-full"
                style={{ backgroundColor: template.colors.text, opacity: 0.3 }}
              ></div>
              <div className="text-base">💐</div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width with Proper Spacing */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-2 sm:py-3 md:py-4 relative flex-1 flex flex-col justify-center">
          {/* Decorative Corner Elements */}
          <div className="absolute top-2 left-2 text-xl opacity-10" style={{ color: template.colors.primary }}>🌺</div>
          <div className="absolute top-2 right-2 text-xl opacity-10" style={{ color: template.colors.primary }}>🌺</div>
          <div className="absolute bottom-2 left-2 text-xl opacity-10" style={{ color: template.colors.accent }}>🌸</div>
          <div className="absolute bottom-2 right-2 text-xl opacity-10" style={{ color: template.colors.accent }}>🌸</div>

          {/* Date and Venue Section */}
          <div className="text-center mb-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md">
                <span className="text-lg sm:text-xl">📅</span>
                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {weddingDate}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md">
                <span className="text-lg sm:text-xl">📍</span>
                <button
                  onClick={() => {
                    const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
                    window.open(googleMapsSearchUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 hover:underline cursor-pointer transition-all hover:scale-105"
                  style={{
                    color: template.colors.primary,
                  }}
                  title="Click to open in Google Maps"
                >
                  {venue}
                </button>
              </div>
            </div>
          </div>

          {/* Parents Information (Traditional Indian Style) */}
          <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-2 mt-2 relative">
            {/* Decorative Elements */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="text-sm" style={{ color: template.colors.accent }}>💐</div>
            </div>
            
            <div className="text-center space-y-1.5 mt-2">
              {deceasedElders && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 px-2 py-0.5 rounded-lg mb-1">
                  {deceasedElders}
                </p>
              )}
              
              {/* Bride's Parents Section */}
              <div className="mb-1 bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-gray-800/50 dark:to-gray-700/50 p-1.5 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-0.5">
                  🌸 Bride's Parents
                </p>
                {(brideFatherName?.trim() || brideMotherName?.trim()) ? (
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {brideFatherName?.trim() && brideMotherName?.trim() 
                      ? `${brideFatherName.trim()} & ${brideMotherName.trim()}`
                      : (brideFatherName?.trim() || brideMotherName?.trim() || '')}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    (Name not provided)
                  </p>
                )}
              </div>

              {/* Groom's Parents Section */}
              <div className="mb-1 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-700/50 p-1.5 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-0.5">
                  🌺 Groom's Parents
                </p>
                {(groomFatherName?.trim() || groomMotherName?.trim()) ? (
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {groomFatherName?.trim() && groomMotherName?.trim() 
                      ? `${groomFatherName.trim()} & ${groomMotherName.trim()}`
                      : (groomFatherName?.trim() || groomMotherName?.trim() || '')}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    (Name not provided)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center my-1.5">
            <div className="text-sm opacity-20" style={{ color: template.colors.primary }}>🌿</div>
            <div 
              className="h-0.5 w-12 rounded-full mx-1"
              style={{ backgroundColor: template.colors.accent }}
            ></div>
            <div 
              className="mx-1 text-base animate-pulse"
              style={{ color: template.colors.primary }}
            >
              ✨
            </div>
            <div 
              className="h-0.5 w-12 rounded-full mx-1"
              style={{ backgroundColor: template.colors.accent }}
            ></div>
            <div className="text-sm opacity-20" style={{ color: template.colors.primary }}>🌿</div>
          </div>

          {/* Invitation Message */}
          <div className="text-center bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-rose-50/50 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50 p-2 sm:p-2.5 rounded-lg border border-dashed" style={{ borderColor: template.colors.accent, opacity: 0.3 }}>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic mb-1 font-medium">
              "You are cordially invited to celebrate this special day with us"
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm">💕</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We look forward to sharing this joyous occasion with you
              </p>
              <span className="text-sm">💕</span>
            </div>
          </div>
        </div>

        {/* Premium Footer */}
        <div 
          className="text-center py-1 sm:py-1.5 px-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${template.colors.accent} 0%, ${template.colors.primary} 100%)`,
          }}
        >
          {/* Footer Decorations */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center gap-2">
            <span className="text-sm">🌺</span>
            <span className="text-xs">✨</span>
            <span className="text-sm">🌺</span>
          </div>
          <p 
            className="text-xs font-semibold relative z-10 drop-shadow-md"
            style={{ color: template.colors.text }}
          >
            {template.name}
          </p>
        </div>
      </div>

      {/* Additional Floating Decorative Elements Outside Card */}
      <div className="absolute top-10 right-10 text-5xl opacity-10 animate-float pointer-events-none hidden md:block">
        🌸
      </div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-10 animate-float animation-delay-2000 pointer-events-none hidden md:block">
        🌹
      </div>
    </div>
  );
}
