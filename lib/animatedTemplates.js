// Animated Wedding Invitation Templates
// Each template is a React component with GSAP animations

import MotionVideoTemplate from '@/components/animatedTemplates/MotionVideoTemplate';
import CinematicFilmTemplate from '@/components/animatedTemplates/CinematicFilmTemplate';
import BaseAnimatedTemplate from '@/components/animatedTemplates/BaseAnimatedTemplate';
import TheaterLuxuryTemplate from '@/components/animatedTemplates/TheaterLuxuryTemplate';
import MediterraneanEleganceTemplate from '@/components/animatedTemplates/MediterraneanEleganceTemplate';
import RaabtaTemplate from '@/components/animatedTemplates/RaabtaTemplate';
import MountainsTemplate from '@/components/animatedTemplates/MountainsTemplate';
import BeachTemplate from '@/components/animatedTemplates/BeachTemplate';
import CityTemplate from '@/components/animatedTemplates/CityTemplate';
import LaavanTemplate from '@/components/animatedTemplates/LaavanTemplate';

export const animatedTemplates = [
  {
    id: 'motion-video',
    name: 'Motion Video',
    category: 'Luxury',
    description: 'Video-like motion with tap-to-open seal and smooth animations',
    preview: '/templates/motion-video.jpg',
    component: MotionVideoTemplate,
    hasEnvelope: true,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'cinematic-film',
    name: 'Cinematic Film',
    category: 'Luxury',
    description: 'Premium auto-play cinematic experience - feels like a movie',
    preview: '/templates/cinematic-film.jpg',
    component: CinematicFilmTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'mountain-peak',
    name: 'Mountain Peak',
    category: 'Luxury',
    description: 'Majestic mountain backdrop',
    preview: '/templates/mountain-peak.jpg',
    component: (props) => <BaseAnimatedTemplate {...props} config={{
      backgroundImage: props.data.backgroundImage || '/images/wedding-backgrounds/fortified-city.jpg',
      gradientColors: ['#E3F2FD', '#BBDEFB', '#FFFFFF'],
      accentColor: '#2196F3',
      textColor: '#1565C0',
      overlayOpacity: 0.3,
    }} />,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'theater-luxury',
    name: 'Theater Luxury',
    category: 'Luxury',
    description: 'Premium theater-inspired invitation with animated curtains and scratch reveal',
    preview: '🎭',
    component: TheaterLuxuryTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'mediterranean-elegance',
    name: 'Mediterranean Elegance',
    category: 'Elegant',
    description: 'Watercolor-inspired elegant invitation with envelope opening and detailed event sections',
    preview: '🌿',
    component: MediterraneanEleganceTemplate,
    hasEnvelope: true,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'raabta',
    name: 'Raabta',
    category: 'Traditional',
    description: 'Elegant traditional invitation with Arabic text, multiple events (Mehendi, Sangeet, Nikah, Walima), and comprehensive details',
    preview: '💐',
    component: RaabtaTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'mountains',
    name: 'Mountains',
    category: 'Luxury',
    description: 'Inspired by Missing Piece - Dark teal background with golden stars, Ganesha blessings, multiple events (Mehendi, Haldi, Cocktail, Pre-Wedding, Shaadi, Reception), and comprehensive details',
    preview: '🏔️',
    component: MountainsTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'beach',
    name: 'Beach',
    category: 'Luxury',
    description: 'Inspired by Missing Piece - Beach sunset theme with floating lanterns, ocean waves, Ganesha blessings, multiple events (Mehendi, Haldi, Cocktail, Pre-wedding, Shaadi, Reception), and comprehensive details',
    preview: '🏖️',
    component: BeachTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'city',
    name: 'City',
    category: 'Luxury',
    description: 'Inspired by Missing Piece - Vintage car and palace theme with light green event cards, floral decorations, Ganesha blessings, multiple events (Mehendi, Haldi, Cocktail, Engagement, Shaadi, Reception), WhatsApp RSVP, and comprehensive details',
    preview: '🏛️',
    component: CityTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
  {
    id: 'laavan',
    name: 'Laavan',
    category: 'Traditional',
    description: 'Inspired by Missing Piece - Sikh wedding template with Gurmukhi text (Mool Mantar), Khanda symbol, diagonal orange/purple background, floating lanterns, Anand Karaj ceremony, multiple events (Mehendi, Haldi, Cocktail, Pre-wedding, Anand Karaj, Reception), and comprehensive details',
    preview: '🕉️',
    component: LaavanTemplate,
    hasEnvelope: false,
    hasMusic: true,
    hasParallax: true,
  },
];

export const getAnimatedTemplateById = (templateId) => {
  return animatedTemplates.find((t) => t.id === templateId) || animatedTemplates[0];
};

export const getAnimatedTemplatesByCategory = (category) => {
  return animatedTemplates.filter((t) => t.category === category);
};
