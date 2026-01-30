// Animated Wedding Invitation Templates
// Each template is a React component with GSAP animations

import MotionVideoTemplate from '@/components/animatedTemplates/MotionVideoTemplate';
import CinematicFilmTemplate from '@/components/animatedTemplates/CinematicFilmTemplate';
import BaseAnimatedTemplate from '@/components/animatedTemplates/BaseAnimatedTemplate';

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
];

export const getAnimatedTemplateById = (templateId) => {
  return animatedTemplates.find((t) => t.id === templateId) || animatedTemplates[0];
};

export const getAnimatedTemplatesByCategory = (category) => {
  return animatedTemplates.filter((t) => t.category === category);
};
