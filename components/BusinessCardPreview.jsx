'use client';

import { motion } from 'framer-motion';
import { getBusinessCardTemplateById } from '@/lib/businessCardTemplates';

export default function BusinessCardPreview({ user, orientation = 'horizontal', size = 'standard', templateId = null }) {
  const cardSize = size === 'standard' ? 'w-64 h-40' : 'w-80 h-52';
  const isVertical = orientation === 'vertical';
  
  // Get selected template or use default
  const template = templateId ? getBusinessCardTemplateById(templateId) : null;
  
  // Get user initials for logo
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  // Determine text color based on template
  const getTextColor = (template) => {
    if (!template) return '#FFFFFF';
    // If secondary is white or very light, use dark text, otherwise use white
    const secondary = template.colors.secondary.toLowerCase();
    if (secondary === '#ffffff' || secondary === '#fff' || secondary.includes('fef') || secondary.includes('fee')) {
      return '#1F2937'; // Dark gray for light backgrounds
    }
    return '#FFFFFF'; // White for dark backgrounds
  };
  
  // Create premium card design based on template layout
  const createPremiumDesign = (template) => {
    const baseDesign = {
      logo: getInitials(user?.name),
      company: user?.company || 'YOUR COMPANY',
      name: user?.name || 'Your Name',
      title: user?.profession || user?.company || 'Your Title',
      phone: user?.phone || '123-456-7890',
      email: user?.email || 'your.email@example.com',
      address: user?.address || 'Your Address',
      template: template,
      textColor: getTextColor(template),
    };

    // Apply different layouts based on template
    switch (template.layout) {
      case 'monogram':
        return {
          ...baseDesign,
          style: 'monogram',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.primary}dd 100%)`,
          },
        };
      case 'geometric':
        return {
          ...baseDesign,
          style: 'geometric',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          },
        };
      case 'split':
        return {
          ...baseDesign,
          style: 'split',
          bgStyle: {
            background: `linear-gradient(90deg, ${template.colors.primary} 0%, ${template.colors.primary} 50%, ${template.colors.accent} 50%, ${template.colors.accent} 100%)`,
          },
        };
      case 'minimal':
        return {
          ...baseDesign,
          style: 'minimal',
          bgStyle: {
            background: template.colors.primary,
            border: `2px solid ${template.colors.accent}`,
          },
        };
      case 'dark':
        return {
          ...baseDesign,
          style: 'dark',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, #1a1a2e 100%)`,
          },
        };
      case 'gradient':
        return {
          ...baseDesign,
          style: 'gradient',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`,
          },
        };
      case 'corporate':
        return {
          ...baseDesign,
          style: 'corporate',
          bgStyle: {
            background: `linear-gradient(180deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          },
        };
      case 'artistic':
        return {
          ...baseDesign,
          style: 'artistic',
          bgStyle: {
            background: `radial-gradient(circle at top right, ${template.colors.accent} 0%, ${template.colors.primary} 100%)`,
          },
        };
      case 'cyber':
        return {
          ...baseDesign,
          style: 'cyber',
          bgStyle: {
            background: template.colors.primary,
            boxShadow: `0 0 20px ${template.colors.accent}40`,
          },
        };
      case 'organic':
        return {
          ...baseDesign,
          style: 'organic',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          },
        };
      case 'royal':
        return {
          ...baseDesign,
          style: 'royal',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          },
        };
      case 'monochrome':
        return {
          ...baseDesign,
          style: 'monochrome',
          bgStyle: {
            background: template.colors.primary,
          },
        };
      default:
        return {
          ...baseDesign,
          style: 'default',
          bgStyle: {
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          },
        };
    }
  };

  // Create card design based on template or default
  const cardDesigns = template ? [
    createPremiumDesign(template)
  ] : [
    {
      bg: 'bg-gradient-to-br from-amber-700 to-amber-900',
      logo: getInitials(user?.name),
      company: user?.company || 'ALDENAIRE',
      name: user?.name || 'Adeline Palmerston',
      title: user?.profession || user?.company || 'Principal Lawyer',
      phone: user?.phone || '123-456-7890',
      email: user?.email || 'hello@reallygreatsite.com',
      address: user?.address || '123 George St., OH',
    },
    {
      bg: 'bg-gradient-to-br from-stone-100 to-stone-200',
      name: user?.name || 'Olivia',
      company: user?.company || 'NAIL STUDIO',
      style: 'elegant',
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="relative w-full max-w-2xl">
        {/* Card Stack Effect */}
        {cardDesigns.map((design, index) => {
          const textColor = design.textColor || '#FFFFFF';
          const isMonogram = design.style === 'monogram';
          const isMinimal = design.style === 'minimal';
          const isSplit = design.style === 'split';
          
          return (
            <motion.div
              key={templateId || index}
              initial={{ opacity: 0, y: 20, rotate: -5 + index * 5 }}
              animate={{ opacity: 1, y: 0, rotate: -5 + index * 5 }}
              transition={{ delay: index * 0.2 }}
              className={`absolute ${cardSize} ${!design.template ? design.bg : ''} rounded-lg shadow-2xl p-4 sm:p-6 ${
                index === 0 ? 'z-10' : 'z-0'
              }`}
              style={{
                left: `${index * 20}px`,
                top: `${index * 15}px`,
                transform: `rotate(${-5 + index * 5}deg)`,
                ...(design.bgStyle || {}),
              }}
            >
              {/* Monogram Style */}
              {isMonogram ? (
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-3 border-2"
                    style={{ 
                      borderColor: design.template?.colors.accent || '#D4AF37',
                      color: design.template?.colors.accent || '#D4AF37'
                    }}
                  >
                    <span className="text-4xl sm:text-5xl font-bold">{design.logo}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: textColor }}>
                    {design.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold tracking-wider opacity-90" style={{ color: textColor }}>
                    {design.title}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs opacity-80" style={{ color: textColor }}>{design.phone}</p>
                    <p className="text-xs opacity-80" style={{ color: textColor }}>{design.email}</p>
                  </div>
                </div>
              ) : isMinimal ? (
                /* Minimal Style */
                <div className="h-full flex flex-col justify-between" style={{ color: design.template?.colors.secondary || '#1F2937' }}>
                  <div>
                    <div className="w-12 h-12 border-2 flex items-center justify-center mb-3" style={{ borderColor: design.template?.colors.accent || '#3B82F6' }}>
                      <span className="text-xl font-bold">{design.logo}</span>
                    </div>
                    <h3 className="text-sm font-bold mb-1">{design.company}</h3>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1">{design.name}</h4>
                    <p className="text-xs mb-2">{design.title}</p>
                    <div className="text-xs space-y-0.5">
                      <p>{design.phone}</p>
                      <p>{design.email}</p>
                    </div>
                  </div>
                </div>
              ) : isSplit ? (
                /* Split Style */
                <div className={`h-full flex ${isVertical ? 'flex-col' : 'flex-row'} overflow-hidden`}>
                  <div className={`${isVertical ? 'h-1/2' : 'w-1/2'} flex flex-col justify-center items-center`} style={{ 
                    background: design.template?.colors.primary,
                    color: textColor 
                  }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" style={{ 
                      backgroundColor: design.template?.colors.accent || '#FFD700',
                      color: design.template?.colors.primary 
                    }}>
                      <span className="text-3xl font-bold">{design.logo}</span>
                    </div>
                    <h3 className="text-sm font-bold text-center">{design.company}</h3>
                  </div>
                  <div className={`${isVertical ? 'h-1/2' : 'w-1/2'} flex flex-col justify-center p-3`} style={{ 
                    background: design.template?.colors.accent,
                    color: design.template?.colors.primary 
                  }}>
                    <h4 className="text-sm font-semibold mb-1">{design.name}</h4>
                    <p className="text-xs mb-2">{design.title}</p>
                    <div className="text-xs space-y-0.5">
                      <p>{design.phone}</p>
                      <p>{design.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Default Premium Style */
                <div className={`h-full flex ${isVertical ? 'flex-col' : 'flex-row'} overflow-hidden relative`} style={{ color: textColor }}>
                  {/* Decorative element for premium look */}
                  {design.style === 'geometric' && (
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-20" style={{ 
                      background: `linear-gradient(135deg, transparent 0%, ${design.template?.colors.accent} 100%)`,
                      clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                    }}></div>
                  )}
                  
                  <div className={`flex-1 ${isVertical ? 'mb-2' : 'mr-3'} flex flex-col justify-center min-w-0 relative z-10`}>
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-2 flex-shrink-0 shadow-lg"
                      style={{ 
                        backgroundColor: design.template?.colors.secondary || '#FFFFFF',
                        color: design.template?.colors.primary || '#000000'
                      }}
                    >
                      <span className="text-2xl sm:text-3xl font-bold">{design.logo}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1 truncate">{design.company}</h3>
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0 relative z-10">
                    <h4 className="text-sm sm:text-base font-semibold mb-1 truncate">{design.name}</h4>
                    <p className="text-xs sm:text-sm opacity-90 mb-1 truncate">{design.title}</p>
                    <div className="space-y-0.5">
                      <p className="text-xs opacity-80 truncate">{design.phone}</p>
                      <p className="text-xs opacity-80 truncate">{design.email}</p>
                      {design.address && (
                        <p className="text-xs opacity-80 mt-1 truncate">{design.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
