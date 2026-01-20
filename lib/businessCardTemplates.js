// Premium Business Card Templates - Canva Style

export const businessCardTemplates = [
  {
    id: 'premium-monogram',
    name: 'Premium Monogram',
    description: 'Elegant monogram design with sophisticated typography',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#D4AF37',
    },
    preview: '👤',
    category: 'Premium',
    layout: 'monogram',
    style: 'elegant',
  },
  {
    id: 'geometric-modern',
    name: 'Geometric Modern',
    description: 'Bold geometric shapes with modern layout',
    colors: {
      primary: '#1E3A8A',
      secondary: '#FFFFFF',
      accent: '#EF4444',
    },
    preview: '🔷',
    category: 'Modern',
    layout: 'geometric',
    style: 'bold',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Opulent gold accents with premium feel',
    colors: {
      primary: '#92400E',
      secondary: '#FEF3C7',
      accent: '#FFD700',
    },
    preview: '✨',
    category: 'Luxury',
    layout: 'split',
    style: 'luxury',
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    description: 'Clean white space with subtle accents',
    colors: {
      primary: '#FFFFFF',
      secondary: '#1F2937',
      accent: '#3B82F6',
    },
    preview: '⚪',
    category: 'Minimal',
    layout: 'minimal',
    style: 'clean',
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    description: 'Sophisticated dark theme with gold highlights',
    colors: {
      primary: '#0F172A',
      secondary: '#FFFFFF',
      accent: '#D4AF37',
    },
    preview: '🌑',
    category: 'Premium',
    layout: 'dark',
    style: 'elegant',
  },
  {
    id: 'colorful-gradient',
    name: 'Colorful Gradient',
    description: 'Vibrant gradient with modern design',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
    },
    preview: '🌈',
    category: 'Creative',
    layout: 'gradient',
    style: 'vibrant',
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue with clean lines',
    colors: {
      primary: '#1E40AF',
      secondary: '#FFFFFF',
      accent: '#3B82F6',
    },
    preview: '💼',
    category: 'Professional',
    layout: 'corporate',
    style: 'professional',
  },
  {
    id: 'artistic-splash',
    name: 'Artistic Splash',
    description: 'Creative design with artistic elements',
    colors: {
      primary: '#DC2626',
      secondary: '#FFFFFF',
      accent: '#F59E0B',
    },
    preview: '🎨',
    category: 'Creative',
    layout: 'artistic',
    style: 'creative',
  },
  {
    id: 'tech-cyber',
    name: 'Tech Cyber',
    description: 'Futuristic tech design with cyber aesthetics',
    colors: {
      primary: '#000000',
      secondary: '#00FF00',
      accent: '#06B6D4',
    },
    preview: '💻',
    category: 'Tech',
    layout: 'cyber',
    style: 'futuristic',
  },
  {
    id: 'nature-organic',
    name: 'Nature Organic',
    description: 'Earthy tones with organic shapes',
    colors: {
      primary: '#166534',
      secondary: '#D1FAE5',
      accent: '#10B981',
    },
    preview: '🌿',
    category: 'Nature',
    layout: 'organic',
    style: 'natural',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Regal purple with elegant typography',
    colors: {
      primary: '#6B21A8',
      secondary: '#F3E8FF',
      accent: '#A855F7',
    },
    preview: '👑',
    category: 'Luxury',
    layout: 'royal',
    style: 'elegant',
  },
  {
    id: 'premium-black',
    name: 'Premium Black',
    description: 'Sophisticated black with white contrast',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#6B7280',
    },
    preview: '⚫',
    category: 'Premium',
    layout: 'monochrome',
    style: 'sophisticated',
  },
];

export const getBusinessCardTemplateById = (id) => {
  return businessCardTemplates.find(t => t.id === id);
};

export const getBusinessCardTemplatesByCategory = (category) => {
  if (category === 'All') return businessCardTemplates;
  return businessCardTemplates.filter(t => t.category === category);
};

export const getBusinessCardCategories = () => {
  const categories = ['All', ...new Set(businessCardTemplates.map(t => t.category))];
  return categories;
};
