'use client';

import { motion } from 'framer-motion';
import { getTemplateById } from '@/lib/templates';
import { getSignatureTemplateById } from '@/lib/signatureTemplates';

export default function WeddingTemplate({ user, templateId = 'elegant-rose-gold', cardType: propCardType }) {
  // Try to get template from both collections
  let template = getTemplateById(templateId);
  if (!template) {
    template = getSignatureTemplateById(templateId);
  }
  
  if (!template) {
    template = getTemplateById('elegant-rose-gold'); // Fallback
  }

  // Use dedicated wedding fields if available, otherwise fall back to name splitting
  const brideName = user.brideName || (user.name?.split('&').map((n) => n.trim())[1]) || user.name?.split('&').map((n) => n.trim())[0] || 'Bride';
  const groomName = user.groomName || (user.name?.split('&').map((n) => n.trim())[0]) || 'Groom';

  // Event date (use dedicated field if available, otherwise fallback)
  const eventDate = user.weddingDate || user.address || 'Date TBA';
  const venue = user.venue || user.company || 'Venue TBA';
  
  // Determine card type - use prop first, then user.cardType, then default
  const cardType = propCardType || user.cardType || 'wedding';

  const styles = {
    container: {
      background: `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary} 100%)`,
      color: template.colors.text,
    },
    accent: {
      color: template.colors.accent,
    },
    primary: {
      color: template.colors.primary,
    },
    text: {
      color: template.colors.text,
    },
  };

  // Different template layouts based on template ID and card type
  const renderTemplate = () => {
    // Check if it's a signature collection template
    const isSignature = template.collection === 'signature';
    
    if (cardType === 'engagement') {
      // Different engagement templates based on template ID - Each with unique premium design
      switch (template.id) {
        case 'royal-engagement-gold':
          return renderRoyalEngagementGold(template, styles, brideName, groomName, eventDate, venue);
        case 'diamond-ring':
          return renderDiamondRing(template, styles, brideName, groomName, eventDate, venue);
        case 'rose-gold-romance':
          return renderRoseGoldRomance(template, styles, brideName, groomName, eventDate, venue);
        case 'emerald-elegance':
          return renderEmeraldElegance(template, styles, brideName, groomName, eventDate, venue);
        case 'sapphire-serenity':
          return renderSapphireSerenity(template, styles, brideName, groomName, eventDate, venue);
        case 'pearl-perfection':
          return renderPearlPerfection(template, styles, brideName, groomName, eventDate, venue);
        case 'amethyst-dreams':
          return renderAmethystDreams(template, styles, brideName, groomName, eventDate, venue);
        case 'coral-bliss':
          return renderCoralBliss(template, styles, brideName, groomName, eventDate, venue);
        case 'ivory-classic':
          return renderIvoryClassic(template, styles, brideName, groomName, eventDate, venue);
        default:
          return renderEngagementTemplate(template, styles, brideName, groomName, eventDate, venue);
      }
    } else if (cardType === 'anniversary') {
      // Different anniversary templates based on template ID - Each with unique premium design
      switch (template.id) {
        case 'golden-jubilee':
          return renderGoldenJubilee(template, styles, brideName, groomName, eventDate, venue);
        case 'silver-celebration':
          return renderSilverCelebration(template, styles, brideName, groomName, eventDate, venue);
        case 'platinum-perfection':
          return renderPlatinumPerfection(template, styles, brideName, groomName, eventDate, venue);
        case 'ruby-romance':
          return renderRubyRomance(template, styles, brideName, groomName, eventDate, venue);
        case 'crystal-celebration':
          return renderCrystalCelebration(template, styles, brideName, groomName, eventDate, venue);
        case 'copper-charm':
          return renderCopperCharm(template, styles, brideName, groomName, eventDate, venue);
        case 'lavender-love':
          return renderLavenderLove(template, styles, brideName, groomName, eventDate, venue);
        case 'sunset-glow':
          return renderSunsetGlow(template, styles, brideName, groomName, eventDate, venue);
        case 'midnight-elegance':
          return renderMidnightElegance(template, styles, brideName, groomName, eventDate, venue);
        default:
          return renderAnniversaryTemplate(template, styles, brideName, groomName, eventDate, venue);
      }
    }
    
    // Wedding templates
    switch (template.id) {
      case 'elegant-rose-gold':
      case 'golden-luxury':
      case 'champagne-gold':
      case 'royal-maharaja':
      case 'pearl-palace':
        return renderElegantTemplate(template, styles, brideName, groomName, eventDate, venue);
      case 'modern-minimalist':
      case 'blush-nude':
      case 'copper-rose':
        return renderModernTemplate(template, styles, brideName, groomName, eventDate, venue);
      case 'romantic-blush':
      case 'cherry-blossom':
      case 'lavender-dreams':
      case 'sakura-pink':
        return renderRomanticTemplate(template, styles, brideName, groomName, eventDate, venue);
      case 'vintage-floral':
      case 'rustic-barn':
      case 'ivory-cream':
        return renderVintageTemplate(template, styles, brideName, groomName, eventDate, venue);
      case 'beach-sunset':
      case 'ocean-blue':
      case 'coral-reef':
        return renderDestinationTemplate(template, styles, brideName, groomName, eventDate, venue);
      default:
        return renderClassicTemplate(template, styles, brideName, groomName, eventDate, venue);
    }
  };

  return (
    <div className="min-h-screen w-full" style={styles.container}>
      {renderTemplate()}
    </div>
  );
}

// Elegant Template Layout - Premium Version
function renderElegantTemplate(template, styles, brideName, groomName, weddingDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Premium decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl animate-pulse">{template.preview}</div>
        <div className="absolute bottom-10 right-10 text-9xl rotate-180 animate-pulse" style={{ animationDelay: '1s' }}>{template.preview}</div>
        <div className="absolute top-1/2 left-1/4 text-7xl opacity-30">{template.preview}</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-20">{template.preview}</div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="mb-12"
        >
          <div className="text-7xl md:text-8xl font-serif mb-6 font-bold tracking-wide" style={styles.primary}>
            {groomName}
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-5xl mb-6"
          >
            💍
          </motion.div>
          <div className="text-7xl md:text-8xl font-serif font-bold tracking-wide" style={styles.primary}>
            {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-8"
        >
          <div className="relative border-t-4 border-b-4 py-8 backdrop-blur-sm bg-white/10 rounded-3xl" style={{ borderColor: template.colors.accent }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: template.colors.accent, color: 'white' }}>
                ✨
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-light mb-4 mt-4" style={{ color: styles.text.color }}>
              Together with their families
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-6 tracking-wide" style={styles.accent}>
              {weddingDate}
            </div>
            <div className="text-xl md:text-2xl font-light">{venue}</div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-16 text-xl md:text-2xl italic font-serif"
            style={{ color: styles.text.color }}
          >
            "Two souls, one heart, forever united"
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Modern Template Layout
function renderModernTemplate(template, styles, brideName, groomName, weddingDate, venue) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="text-7xl font-bold mb-4" style={styles.primary}>
              {groomName.split(' ')[0]}
            </div>
            <div className="text-5xl font-light mb-8">&</div>
            <div className="text-7xl font-bold" style={styles.primary}>
              {brideName.split(' ')[0]}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 border-l-4 pl-8"
            style={{ borderColor: template.colors.accent }}
          >
            <div>
              <div className="text-sm uppercase tracking-wider mb-2 opacity-70">Date</div>
              <div className="text-3xl font-semibold" style={styles.accent}>
                {weddingDate}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider mb-2 opacity-70">Venue</div>
              <div className="text-2xl">{venue}</div>
            </div>
            <div className="pt-4">
              <div className="text-sm uppercase tracking-wider opacity-70">Please join us</div>
              <div className="text-xl mt-2">as we celebrate our special day</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Romantic Template Layout - Premium Version
function renderRomanticTemplate(template, styles, brideName, groomName, weddingDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-9xl"
        >
          {template.preview}
        </motion.div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {template.preview}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0, scale: 0 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="text-8xl md:text-9xl mb-8"
        >
          {template.preview}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-6xl font-serif mb-6 font-bold tracking-wide" 
          style={styles.primary}
        >
          {groomName} & {brideName}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-48 h-1 mx-auto my-8 rounded-full" 
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6 text-xl md:text-2xl"
        >
          <div className="font-light" style={{ color: styles.text.color }}>{weddingDate}</div>
          <div className="text-3xl md:text-4xl font-bold tracking-wide" style={styles.accent}>
            {venue}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-xl md:text-2xl italic font-serif space-y-2"
          style={{ color: styles.text.color }}
        >
          <div>Our hearts are entwined forever</div>
          <div className="text-4xl">💕</div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Vintage Template Layout
function renderVintageTemplate(template, styles, brideName, groomName, weddingDate, venue) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative" style={styles.container}>
      <div className="absolute inset-0 border-8" style={{ borderColor: template.colors.accent, opacity: 0.3 }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center z-10"
      >
        <div className="mb-8">
          <div className="text-4xl mb-4">{template.preview}</div>
          <div className="text-6xl font-serif italic mb-2" style={styles.primary}>
            {groomName}
          </div>
          <div className="text-3xl mb-2">and</div>
          <div className="text-6xl font-serif italic" style={styles.primary}>
            {brideName}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="flex-1 h-px" style={{ backgroundColor: template.colors.accent }} />
          <div className="text-2xl" style={styles.accent}>
            ✦
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: template.colors.accent }} />
        </div>

        <div className="space-y-3 text-xl mb-6">
          <div className="font-semibold" style={styles.accent}>
            {weddingDate}
          </div>
          <div>{venue}</div>
        </div>

        <div className="mt-12 text-sm uppercase tracking-widest opacity-70">
          Request the honor of your presence
        </div>
      </motion.div>
    </div>
  );
}

// Destination Template Layout
function renderDestinationTemplate(template, styles, brideName, groomName, weddingDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl">{template.preview}</div>
        <div className="absolute bottom-20 right-10 text-6xl">{template.preview}</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-7xl mb-6"
        >
          {template.preview}
        </motion.div>

        <div className="text-6xl font-bold mb-6" style={styles.primary}>
          {groomName} <span className="text-4xl">&</span> {brideName}
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 my-8" style={{ color: styles.text.color }}>
          <div className="text-3xl font-semibold mb-4" style={styles.accent}>
            {weddingDate}
          </div>
          <div className="text-xl">{venue}</div>
        </div>

        <div className="text-lg italic mt-8">
          Join us for a celebration in paradise
        </div>
      </motion.div>
    </div>
  );
}

// Engagement Template Layout
function renderEngagementTemplate(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl">{template.preview}</div>
        <div className="absolute bottom-10 right-10 text-9xl rotate-180">{template.preview}</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-8xl mb-8"
        >
          {template.preview}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-6xl md:text-7xl font-serif mb-6 font-bold" 
          style={styles.primary}
        >
          {groomName} & {brideName}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-48 h-1 mx-auto my-8 rounded-full" 
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6 text-xl md:text-2xl"
        >
          <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
          <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
            {venue}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "We're engaged! Join us in celebration"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Anniversary Template Layout (Default)
function renderAnniversaryTemplate(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-8xl">{template.preview}</div>
        <div className="absolute bottom-20 right-20 text-8xl">{template.preview}</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-3xl"
      >
        <motion.div
          initial={{ rotate: 360, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-7xl mb-8"
        >
          {template.preview}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-6xl font-serif mb-6 font-bold" 
          style={styles.primary}
        >
          {groomName} & {brideName}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-3xl md:text-4xl font-light mb-8 italic"
          style={{ color: styles.text.color }}
        >
          Celebrating {eventDate}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl font-semibold mb-6" 
          style={styles.accent}
        >
          {venue}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Years of love, memories, and togetherness"
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== PREMIUM ENGAGEMENT TEMPLATES ==========

// Royal Engagement Gold - Premium Majestic Design
function renderRoyalEngagementGold(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Royal Gold Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${template.colors.primary} 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, ${template.colors.accent} 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Crown and Ring Decorations */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-9xl"
        >
          👑
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Crown Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="text-8xl mb-6"
        >
          👑
        </motion.div>

        {/* Names with Royal Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider" style={styles.primary}>
            {groomName}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="text-6xl mb-4"
          >
            💍
          </motion.div>
          <div className="text-5xl md:text-6xl font-serif font-bold tracking-wider" style={styles.primary}>
            {brideName}
          </div>
        </motion.div>

        {/* Royal Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Event Details in Royal Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "A Royal Engagement Celebration"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Diamond Ring - Premium Elegant Design
function renderDiamondRing(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Diamond Sparkle Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 360],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        {/* Large Diamond Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="text-9xl mb-8"
        >
          💍✨
        </motion.div>

        {/* Names in Elegant Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-4xl md:text-5xl font-light mb-4" style={{ color: styles.text.color }}>
            Together with their families
          </div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wide mb-4" style={styles.primary}>
            {groomName}
          </div>
          <div className="text-5xl mb-4" style={styles.accent}>&</div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wide" style={styles.primary}>
            {brideName}
          </div>
        </motion.div>

        {/* Elegant Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-48 h-0.5 mx-auto my-8"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Minimalist Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 text-lg md:text-xl"
        >
          <div className="font-light uppercase tracking-widest" style={{ color: styles.text.color }}>
            {eventDate}
          </div>
          <div className="text-2xl md:text-3xl font-light" style={styles.accent}>
            {venue}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-lg md:text-xl italic font-light"
          style={{ color: styles.text.color }}
        >
          "We're engaged!"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Rose Gold Romance - Premium Romantic Design
function renderRoseGoldRomance(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Rose Petals Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${10 + i * 6}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Rose and Ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-8xl mb-8"
        >
          🌹💍
        </motion.div>

        {/* Romantic Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        {/* Romantic Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Romantic Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border-2"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light italic" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-semibold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "A romantic beginning to forever"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Emerald Elegance - Premium Luxurious Design
function renderEmeraldElegance(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Emerald Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${template.colors.primary} 0px, transparent 50px, ${template.colors.accent} 100px)`
        }}></div>
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl opacity-20"
            style={{
              left: `${15 + i * 7}%`,
              top: `${10 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            💚
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Emerald Ring */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💚💍
        </motion.div>

        {/* Elegant Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-4xl md:text-5xl font-light mb-4" style={{ color: styles.text.color }}>
            Together with their families
          </div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wider mb-4" style={styles.primary}>
            {groomName}
          </div>
          <div className="text-5xl mb-4" style={styles.accent}>&</div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wider" style={styles.primary}>
            {brideName}
          </div>
        </motion.div>

        {/* Elegant Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Luxurious Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/25 backdrop-blur-md rounded-3xl p-10 border-4 shadow-2xl"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light uppercase tracking-wider" style={{ color: styles.text.color }}>
              {eventDate}
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Elegant engagement celebration"
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== PREMIUM ANNIVERSARY TEMPLATES ==========

// Golden Jubilee - Premium Celebration Design
function renderGoldenJubilee(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Golden Celebration Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, ${template.colors.primary} 0%, transparent 70%)`
        }}></div>
      </div>

      {/* Floating Gold Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl opacity-20"
            style={{
              left: `${10 + i * 6}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -60, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            🥇
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Golden Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🥇
        </motion.div>

        {/* Celebration Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="text-3xl md:text-4xl font-light mb-4 uppercase tracking-widest" style={styles.accent}>
            Celebrating
          </div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wide mb-4" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        {/* Golden Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Golden Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4 shadow-2xl"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Golden moments, endless love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Silver Celebration - Premium Elegant Design
function renderSilverCelebration(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Silver Sparkle Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: template.colors.primary,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        {/* Silver Medal */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🥈
        </motion.div>

        {/* Elegant Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
          <div className="text-2xl md:text-3xl font-light italic" style={{ color: styles.text.color }}>
            Celebrating {eventDate}
          </div>
        </motion.div>

        {/* Silver Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-48 h-0.5 mx-auto my-8"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Minimalist Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl font-light" style={styles.accent}>
          {venue}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-lg md:text-xl italic font-light"
          style={{ color: styles.text.color }}
        >
          "Elegant celebration of love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Platinum Perfection - Premium Timeless Design
function renderPlatinumPerfection(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Platinum Gradient Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`
        }}></div>
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + (i % 2) * 70}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            💠
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Platinum Gem */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💠
        </motion.div>

        {/* Timeless Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-4xl md:text-5xl font-light mb-4 uppercase tracking-widest" style={{ color: styles.text.color }}>
            Timeless Love
          </div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wide mb-4" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        {/* Platinum Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Platinum Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light uppercase tracking-wider" style={{ color: styles.text.color }}>
              {eventDate}
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Platinum perfection, eternal love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Ruby Romance - Premium Passionate Design
function renderRubyRomance(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Ruby Hearts Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${5 + i * 5}%`,
              top: `${5 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        {/* Ruby Heart and Diamond */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💎❤️
        </motion.div>

        {/* Passionate Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
          <div className="text-2xl md:text-3xl font-light italic" style={{ color: styles.text.color }}>
            Celebrating {eventDate}
          </div>
        </motion.div>

        {/* Ruby Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        {/* Details in Passionate Frame */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/25 backdrop-blur-md rounded-3xl p-10 border-4 shadow-2xl"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Passionate love, endless romance"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Classic Template Layout (default)
function renderClassicTemplate(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-2xl"
      >
        <div className="text-6xl font-serif mb-8" style={styles.primary}>
          {groomName}
        </div>
        <div className="text-4xl mb-8">💍</div>
        <div className="text-6xl font-serif mb-12" style={styles.primary}>
          {brideName}
        </div>

        <div className="space-y-6 text-xl mb-8">
          <div className="font-semibold" style={styles.accent}>
            {eventDate}
          </div>
          <div>{venue}</div>
        </div>

        <div className="text-lg mt-12">
          We cordially invite you to celebrate our union
        </div>
      </motion.div>
    </div>
  );
}

// ========== ADDITIONAL PREMIUM ENGAGEMENT TEMPLATES ==========

// Sapphire Serenity - Premium Calm Design
function renderSapphireSerenity(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Sapphire Waves Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(180deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`
        }}></div>
      </div>

      {/* Floating Waves */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-15"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            💙
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💙💍
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/25 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Calm serenity, eternal love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Pearl Perfection - Premium Classic Design
function renderPearlPerfection(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Pearl Shimmer Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: template.colors.primary,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🤍💍
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-6xl md:text-7xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-48 h-0.5 mx-auto my-8"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 text-lg md:text-xl"
        >
          <div className="font-light uppercase tracking-widest" style={{ color: styles.text.color }}>
            {eventDate}
          </div>
          <div className="text-2xl md:text-3xl font-light" style={styles.accent}>
            {venue}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-lg md:text-xl italic font-light"
          style={{ color: styles.text.color }}
        >
          "Classic elegance, timeless beauty"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Amethyst Dreams - Premium Mystical Design
function renderAmethystDreams(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Amethyst Stars Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 360],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💜💍
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Mystical dreams, magical moments"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Coral Bliss - Premium Vibrant Design
function renderCoralBliss(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Coral Flowers Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${8 + i * 5}%`,
              top: `${8 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            🧡
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🧡💍
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/25 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Vibrant bliss, joyful celebration"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Ivory Classic - Premium Timeless Design
function renderIvoryClassic(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Ivory Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${template.colors.accent} 0px, transparent 2px, transparent 10px, ${template.colors.accent} 12px)`
        }}></div>
      </div>

      {/* Gold Accents */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${15 + i * 8}%`,
              top: `${10 + (i % 2) * 80}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            👑
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🤍👑
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-4xl md:text-5xl font-light mb-4" style={{ color: styles.text.color }}>
            Together with their families
          </div>
          <div className="text-6xl md:text-7xl font-serif font-bold mb-4 tracking-wider" style={styles.primary}>
            {groomName}
          </div>
          <div className="text-5xl mb-4" style={styles.accent}>&</div>
          <div className="text-6xl md:text-7xl font-serif font-bold tracking-wider" style={styles.primary}>
            {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light uppercase tracking-wider" style={{ color: styles.text.color }}>
              {eventDate}
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Timeless elegance, classic beauty"
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== ADDITIONAL PREMIUM ANNIVERSARY TEMPLATES ==========

// Crystal Celebration - Premium Sparkling Design
function renderCrystalCelebration(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Crystal Sparkles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-3xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💎✨
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
          <div className="text-2xl md:text-3xl font-light italic" style={{ color: styles.text.color }}>
            Celebrating {eventDate}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-48 h-0.5 mx-auto my-8"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl font-light" style={styles.accent}>
          {venue}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-lg md:text-xl italic font-light"
          style={{ color: styles.text.color }}
        >
          "Sparkling moments, crystal clear love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Copper Charm - Premium Warm Design
function renderCopperCharm(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Copper Glow Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, ${template.colors.primary} 0%, transparent 50%),
                           radial-gradient(circle at 70% 50%, ${template.colors.accent} 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Warm Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl opacity-15"
            style={{
              left: `${10 + i * 6}%`,
              top: `${8 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            🟤
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🟤💝
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Warm charm, cozy celebration"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Lavender Love - Premium Soft Design
function renderLavenderLove(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Lavender Flowers Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${5 + i * 5}%`,
              top: `${5 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [0, -45, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            🌺
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          💜🌺
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-56 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Soft lavender, gentle love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Sunset Glow - Premium Warm Design
function renderSunsetGlow(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Sunset Gradient Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(180deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`
        }}></div>
      </div>

      {/* Sunset Rays */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-15"
            style={{
              left: `${10 + i * 7}%`,
              top: `${5 + (i % 2) * 90}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            🌅
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🌅💕
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light" style={{ color: styles.text.color }}>{eventDate}</div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Warm glow, endless love"
        </motion.div>
      </motion.div>
    </div>
  );
}

// Midnight Elegance - Premium Sophisticated Design
function renderMidnightElegance(template, styles, brideName, groomName, eventDate, venue) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Midnight Stars Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: template.colors.secondary,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Moon Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + (i % 2) * 70}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            🌙
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-9xl mb-8"
        >
          🌙💙
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide" style={styles.primary}>
            {groomName} & {brideName}
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
          className="w-64 h-1 mx-auto my-8 rounded-full"
          style={{ backgroundColor: template.colors.accent }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-10 border-4"
          style={{ borderColor: template.colors.accent }}
        >
          <div className="space-y-6 text-xl md:text-2xl">
            <div className="font-light uppercase tracking-wider" style={{ color: styles.text.color }}>
              {eventDate}
            </div>
            <div className="text-3xl md:text-4xl font-bold" style={styles.accent}>
              {venue}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 text-xl md:text-2xl italic font-serif"
          style={{ color: styles.text.color }}
        >
          "Sophisticated elegance, midnight beauty"
        </motion.div>
      </motion.div>
    </div>
  );
}

