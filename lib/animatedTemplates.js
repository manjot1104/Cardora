// Animated Wedding Invitation Templates
// Each template is a React component with GSAP animations

import MotionVideoTemplate from '@/components/animatedTemplates/MotionVideoTemplate';
import CinematicFilmTemplate from '@/components/animatedTemplates/CinematicFilmTemplate';
import BaseAnimatedTemplate from '@/components/animatedTemplates/BaseAnimatedTemplate';
import TheaterLuxuryTemplate from '@/components/animatedTemplates/TheaterLuxuryTemplate';
import MediterraneanEleganceTemplate from '@/components/animatedTemplates/MediterraneanEleganceTemplate';

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
];

export const getAnimatedTemplateById = (templateId) => {
  return animatedTemplates.find((t) => t.id === templateId) || animatedTemplates[0];
};

export const getAnimatedTemplatesByCategory = (category) => {
  return animatedTemplates.filter((t) => t.category === category);
};
