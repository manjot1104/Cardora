'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { weddingTemplates, getTemplateById, getCategories } from '@/lib/templates';
import { getAllSignatureTemplates, getSignatureTemplateById, getSignatureTemplatesByType } from '@/lib/signatureTemplates';
import WeddingTemplate from '@/components/WeddingTemplate';
import { countries, detectUserCountry, formatCurrency } from '@/lib/countryConfig';

export default function CardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    profileEnabled: true,
    paymentEnabled: false,
    paymentType: 'custom',
    fixedAmount: '',
    interacEmail: '',
    theme: 'default',
    weddingDate: '',
    venue: '',
    brideName: '',
    groomName: '',
    cardType: 'business',
    collection: 'standard',
    country: 'IN',
    currency: 'INR',
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile');
      const userData = response.data;
      setUser(userData);
      const detectedCountry = detectUserCountry();
      
      setFormData({
        profileEnabled: userData.profileEnabled !== false,
        paymentEnabled: userData.paymentEnabled || false,
        paymentType: userData.paymentType || 'custom',
        fixedAmount: userData.fixedAmount || '',
        interacEmail: userData.interacEmail || '',
        theme: userData.theme || 'default',
        weddingDate: userData.weddingDate || '',
        venue: userData.venue || '',
        brideName: userData.brideName || '',
        groomName: userData.groomName || '',
        cardType: userData.cardType || 'business',
        collection: userData.collection || 'standard',
        country: userData.country || detectedCountry.code,
        currency: userData.currency || detectedCountry.currency,
      });
      // Set preview template if theme is a wedding/engagement/anniversary template
      if (userData.theme && userData.theme !== 'default') {
        const template = getTemplateById(userData.theme);
        const sigTemplate = getSignatureTemplateById(userData.theme);
        if (template || sigTemplate) {
          setPreviewTemplate(userData.theme);
        }
      }
    } catch (error) {
      toast.error('Failed to load card settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTemplateSelect = (templateId) => {
    const signatureTemplate = getSignatureTemplateById(templateId);
    const isSignature = signatureTemplate !== undefined;
    
    // Determine card type based on template
    let newCardType = formData.cardType;
    if (isSignature) {
      if (signatureTemplate.category === 'Royal Engagement') {
        newCardType = 'engagement';
      } else if (signatureTemplate.category === 'Designer Anniversary') {
        newCardType = 'anniversary';
      } else if (signatureTemplate.category === 'Luxury Wedding') {
        newCardType = 'wedding';
      }
    }
    
    setFormData({
      ...formData,
      theme: templateId,
      cardType: newCardType,
      collection: isSignature ? 'signature' : 'standard',
    });
    setPreviewTemplate(templateId);
    toast.success('Template selected! Don\'t forget to save.');
  };

  // Get templates based on card type
  const getTemplatesForCardType = () => {
    if (formData.cardType === 'engagement') {
      return getSignatureTemplatesByType('engagement');
    } else if (formData.cardType === 'anniversary') {
      return getSignatureTemplatesByType('anniversary');
    } else {
      return weddingTemplates;
    }
  };

  const availableTemplates = getTemplatesForCardType();
  const filteredTemplates = selectedCategory === 'All' 
    ? availableTemplates 
    : availableTemplates.filter(t => t.category === selectedCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/user/profile', {
        ...formData,
        fixedAmount: formData.fixedAmount ? parseFloat(formData.fixedAmount) : undefined,
        weddingDate: formData.weddingDate || undefined,
        venue: formData.venue || undefined,
        brideName: formData.brideName || undefined,
        groomName: formData.groomName || undefined,
        cardType: formData.cardType || undefined,
        collection: formData.collection || undefined,
        country: formData.country || undefined,
        currency: formData.currency || undefined,
      });
      toast.success('Card settings updated successfully!');
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update card settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${user?.username}`;
  const paymentUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${user?.username}`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Card Settings</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Create and customize your digital card</p>
            </div>
          </div>

          {/* Country Selector */}
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 border-2 border-indigo-200 dark:border-indigo-800">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Select Your Country</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">Choose your country for currency and payment methods</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {Object.values(countries).map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setFormData({ ...formData, country: country.code, currency: country.currency });
                    toast.success(`${country.name} selected - Currency: ${country.currency}`);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    formData.country === country.code
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{country.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{country.currency} {country.symbol}</p>
                      </div>
                    </div>
                    {formData.country === country.code && (
                      <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">Active</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Type Selector */}
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Choose Card Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <button
                onClick={() => {
                  setFormData({ ...formData, theme: 'default', cardType: 'business', collection: 'standard' });
                  setPreviewTemplate(null);
                  toast.success('Business Card mode selected');
                }}
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  formData.cardType === 'business'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💼</div>
                  {formData.cardType === 'business' && (
                    <span className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Business Card</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Professional digital business card
                </p>
              </button>

              <button
                onClick={() => {
                  const firstWeddingTemplate = weddingTemplates[0].id;
                  setFormData({ ...formData, theme: firstWeddingTemplate, cardType: 'wedding', collection: 'standard' });
                  setPreviewTemplate(firstWeddingTemplate);
                  toast.success('Wedding Card mode selected');
                }}
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  formData.cardType === 'wedding'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💍</div>
                  {formData.cardType === 'wedding' && (
                    <span className="px-2 sm:px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Wedding Card</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Beautiful digital wedding invitations
                </p>
              </button>

              <button
                onClick={() => {
                  const firstEngagementTemplate = getSignatureTemplatesByType('engagement')[0].id;
                  setFormData({ ...formData, theme: firstEngagementTemplate, cardType: 'engagement', collection: 'signature' });
                  setPreviewTemplate(firstEngagementTemplate);
                  toast.success('Engagement Card mode selected');
                }}
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  formData.cardType === 'engagement'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💎</div>
                  {formData.cardType === 'engagement' && (
                    <span className="px-2 sm:px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Engagement Card</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Royal engagement celebrations
                </p>
              </button>

              <button
                onClick={() => {
                  const firstAnniversaryTemplate = getSignatureTemplatesByType('anniversary')[0].id;
                  setFormData({ ...formData, theme: firstAnniversaryTemplate, cardType: 'anniversary', collection: 'signature' });
                  setPreviewTemplate(firstAnniversaryTemplate);
                  toast.success('Anniversary Card mode selected');
                }}
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  formData.cardType === 'anniversary'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">🎉</div>
                  {formData.cardType === 'anniversary' && (
                    <span className="px-2 sm:px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Anniversary Card</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Designer anniversary cards
                </p>
              </button>
            </div>
          </div>

          {/* Signature Collection Section - Only show for Engagement or Anniversary */}
          {(formData.cardType === 'engagement' || formData.cardType === 'anniversary') && (
            <div className="glass p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 border-2 sm:border-4 border-purple-300 dark:border-purple-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold mb-2">
                      👑 SIGNATURE COLLECTION
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Premium & Exclusive Templates
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">
                      "Where unforgettable moments begin"
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {getSignatureTemplatesByType(formData.cardType === 'engagement' ? 'engagement' : formData.cardType === 'anniversary' ? 'anniversary' : 'wedding').map((template) => {
                    const isSelected = formData.theme === template.id;
                    return (
                      <motion.button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 shadow-xl ring-4 ring-purple-200 dark:ring-purple-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                        }`}
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary}20 100%)`
                            : `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary}10 100%)`,
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        <div className="text-4xl mb-2">{template.preview}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {template.description}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Premium Wedding Templates Section - Only show when Wedding Card mode */}
          {formData.cardType === 'wedding' && (
            <div className="glass p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    💍 Premium Wedding Card Templates
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Choose from {weddingTemplates.length} beautifully designed digital wedding invitations
                  </p>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs sm:text-sm font-semibold">
                  Premium Collection
                </div>
              </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {getCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-h-96 overflow-y-auto p-2">
              {filteredTemplates.map((template) => {
                const isSelected = formData.theme === template.id;
                return (
                  <motion.button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 shadow-xl ring-4 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary}20 100%)`
                        : `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary}10 100%)`,
                    }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <div className="text-4xl mb-2">{template.preview}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {Object.values(template.colors).slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            </div>
          )}

          {/* Premium Preview Section - Show for all Event Cards (Wedding, Engagement, Anniversary) */}
          {previewTemplate && formData.cardType !== 'business' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 md:mb-8 border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {(() => {
                      const sigTemplate = getSignatureTemplateById(previewTemplate);
                      const regTemplate = getTemplateById(previewTemplate);
                      return sigTemplate ? sigTemplate.name : (regTemplate ? regTemplate.name : 'Template');
                    })()}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Live Preview - See how your invitation will look
                  </p>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs font-bold">
                  PREVIEW
                </div>
              </div>
              <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-gray-200 dark:border-gray-700">
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-[400px] sm:h-[500px] md:h-[600px] overflow-y-auto">
                  <WeddingTemplate
                    key={`${previewTemplate}-${formData.cardType}`}
                    user={{
                      name: `${formData.groomName || 'John'} & ${formData.brideName || 'Jane'}`,
                      groomName: formData.groomName || 'John',
                      brideName: formData.brideName || 'Jane',
                      weddingDate: formData.weddingDate || 'December 15, 2024',
                      venue: formData.venue || 'Grand Ballroom',
                      company: formData.venue || 'Grand Ballroom',
                      address: formData.weddingDate || 'December 15, 2024',
                    }}
                    templateId={previewTemplate}
                    cardType={formData.cardType || 'wedding'}
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Tip:</strong> Fill in the {formData.cardType === 'engagement' ? 'engagement' : formData.cardType === 'anniversary' ? 'anniversary' : 'wedding'} details below to see them in the preview above!
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Settings Form */}
            <div className="glass p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Configure Your Card</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900 dark:text-white">Profile Enabled</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow people to view your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    name="profileEnabled"
                    checked={formData.profileEnabled}
                    onChange={handleChange}
                    className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900 dark:text-white">Payment Enabled</label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable payments on your card</p>
                  </div>
                  <input
                    type="checkbox"
                    name="paymentEnabled"
                    checked={formData.paymentEnabled}
                    onChange={handleChange}
                    className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                {formData.paymentEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Type
                      </label>
                      <select
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="custom">Custom Amount</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    {formData.paymentType === 'fixed' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Fixed Amount ($)
                        </label>
                        <input
                          type="number"
                          name="fixedAmount"
                          value={formData.fixedAmount}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Interac Email (for e-transfer)
                      </label>
                      <input
                        type="email"
                        name="interacEmail"
                        value={formData.interacEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="payments@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email for Interac/e-transfer payments</p>
                    </div>
                  </>
                )}

                {/* Event Template Fields - Show for Wedding, Engagement, Anniversary */}
                {formData.cardType && ['wedding', 'engagement', 'anniversary'].includes(formData.cardType) && (
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      {formData.cardType === 'engagement' ? '💎' : formData.cardType === 'anniversary' ? '🎉' : '💍'} {formData.cardType === 'engagement' ? 'Engagement' : formData.cardType === 'anniversary' ? 'Anniversary' : 'Wedding'} Details
                      <span className="text-xs font-normal text-gray-500">(Optional but recommended)</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Groom Name
                        </label>
                        <input
                          type="text"
                          name="groomName"
                          value={formData.groomName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bride Name
                        </label>
                        <input
                          type="text"
                          name="brideName"
                          value={formData.brideName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Wedding Date
                        </label>
                        <input
                          type="text"
                          name="weddingDate"
                          value={formData.weddingDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="December 15, 2024"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter your wedding date (e.g., "December 15, 2024")</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Venue
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Grand Ballroom, Hotel Name"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>

            {/* QR Code Preview */}
            <div className="glass p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Your QR Code</h2>

              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg animate-glow">
                  <QRCodeSVG
                    value={cardUrl}
                    size={typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="text-center w-full">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Card URL:</p>
                  <p className="text-blue-600 dark:text-blue-400 font-mono text-sm break-all">{cardUrl}</p>
                </div>

                {formData.paymentEnabled && (
                  <div className="text-center w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Payment URL:</p>
                    <p className="text-purple-600 dark:text-purple-400 font-mono text-sm break-all">{paymentUrl}</p>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg w-full">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>💡 NFC Card Tip:</strong> Store this URL on your NFC chip. When someone taps your card,
                    they'll be redirected here. You can update your profile anytime without reprogramming the NFC chip!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

