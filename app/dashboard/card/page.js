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
import BusinessCardPreview from '@/components/BusinessCardPreview';
import ImageUpload from '@/components/ImageUpload';
import { countries, detectUserCountry, formatCurrency } from '@/lib/countryConfig';
import { businessCardTemplates, getBusinessCardTemplateById, getBusinessCardCategories } from '@/lib/businessCardTemplates';
import { addToCart, getCartCount } from '@/lib/cart';

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
    // Parent names (optional)
    brideFatherName: '',
    brideMotherName: '',
    groomFatherName: '',
    groomMotherName: '',
    // Deceased elders (optional)
    deceasedElders: '',
    cardType: 'business',
    collection: 'standard',
    country: 'IN',
    currency: 'INR',
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  // Business card customization options
  const [cardSize, setCardSize] = useState('standard'); // 'standard' or 'large'
  const [cardOrientation, setCardOrientation] = useState('horizontal'); // 'horizontal' or 'vertical'
  const [deliveryOption, setDeliveryOption] = useState('instant'); // 'instant', 'standard', 'express'
  const [printType, setPrintType] = useState('digital'); // 'digital' or 'standard'
  const [quantity, setQuantity] = useState(100);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedBusinessTemplate, setSelectedBusinessTemplate] = useState(null);
  const [selectedEventTemplate, setSelectedEventTemplate] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [templateCategory, setTemplateCategory] = useState('All');
  const [eventTemplateCategory, setEventTemplateCategory] = useState('All');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, []);

  useEffect(() => {
    // Update cart count on mount and when cart changes
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };
    updateCartCount();
    // Listen for storage changes (when cart is updated from other tabs)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', updateCartCount);
      return () => window.removeEventListener('storage', updateCartCount);
    }
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
        brideFatherName: userData.brideFatherName || '',
        brideMotherName: userData.brideMotherName || '',
        groomFatherName: userData.groomFatherName || '',
        groomMotherName: userData.groomMotherName || '',
        deceasedElders: userData.deceasedElders || '',
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
    setSelectedEventTemplate(templateId);
    toast.success('Template selected! Preview updated.');
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

  const filteredBusinessTemplates = templateCategory === 'All'
    ? businessCardTemplates
    : businessCardTemplates.filter(t => t.category === templateCategory);

  const handleCreateNow = () => {
    if (!user) {
      toast.error('Please save your card settings first');
      return;
    }
    setShowTemplatesModal(true);
  };

  const handleBusinessTemplateSelect = (templateId) => {
    const template = getBusinessCardTemplateById(templateId);
    if (template) {
      setSelectedBusinessTemplate(templateId);
      setFormData({ ...formData, theme: templateId });
      toast.success(`Template "${template.name}" selected! Preview updated.`);
    }
  };

  const getCardBasePrice = (country) => {
    return country === 'CA' ? 20 : 500; // $20 for Canada, ₹500 for India
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please save your card settings first');
      return;
    }

    let cartItem;
    const unitPrice = 0.19;
    const basePrice = getCardBasePrice(formData.country || 'IN');
    const serviceFee = 2.99;
    const totalPrice = basePrice + (unitPrice * quantity) + serviceFee;

    if (formData.cardType === 'business') {
      if (!selectedBusinessTemplate) {
        toast.error('Please select a template first');
        return;
      }
      cartItem = {
        type: 'business_card',
        name: `${quantity} Business Cards - ${getBusinessCardTemplateById(selectedBusinessTemplate)?.name || 'Custom'}`,
        quantity: quantity,
        size: cardSize,
        orientation: cardOrientation,
        printType: printType,
        templateId: selectedBusinessTemplate,
        unitPrice: unitPrice,
        basePrice: basePrice,
        serviceFee: serviceFee,
        price: totalPrice,
        currency: formData.currency || 'INR',
        country: formData.country || 'IN',
        userId: user._id,
        username: user.username,
      };
    } else {
      // Wedding, Engagement, or Anniversary
      const selectedTemplate = selectedEventTemplate || previewTemplate;
      if (!selectedTemplate) {
        toast.error('Please select a template first');
        return;
      }
      
      const template = getTemplateById(selectedTemplate) || getSignatureTemplateById(selectedTemplate);
      const cardTypeName = formData.cardType === 'wedding' ? 'Wedding' : 
                          formData.cardType === 'engagement' ? 'Engagement' : 'Anniversary';
      
      cartItem = {
        type: `${formData.cardType}_card`,
        name: `${quantity} ${cardTypeName} Cards - ${template?.name || 'Custom'}`,
        quantity: quantity,
        size: cardSize,
        orientation: cardOrientation,
        printType: printType,
        templateId: selectedTemplate,
        cardType: formData.cardType,
        unitPrice: unitPrice,
        basePrice: basePrice,
        serviceFee: serviceFee,
        price: totalPrice,
        currency: formData.currency || 'INR',
        country: formData.country || 'IN',
        userId: user._id,
        username: user.username,
      };
    }

    addToCart(cartItem);
    setCartCount(getCartCount());
    toast.success(`${quantity} cards added to cart!`);
    setShowTemplatesModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare update data - explicitly include all fields
      const updateData = {
        profileEnabled: formData.profileEnabled,
        paymentEnabled: formData.paymentEnabled,
        paymentType: formData.paymentType || 'custom',
        fixedAmount: formData.fixedAmount ? parseFloat(formData.fixedAmount) : undefined,
        interacEmail: formData.interacEmail || '',
        theme: formData.theme || 'default',
        weddingDate: formData.weddingDate || '',
        venue: formData.venue || '',
        brideName: formData.brideName || '',
        groomName: formData.groomName || '',
        brideFatherName: formData.brideFatherName || '',
        brideMotherName: formData.brideMotherName || '',
        groomFatherName: formData.groomFatherName || '',
        groomMotherName: formData.groomMotherName || '',
        deceasedElders: formData.deceasedElders || '',
        cardType: formData.cardType || 'business',
        collection: formData.collection || 'standard',
        country: formData.country || undefined,
        currency: formData.currency || undefined,
      };

      await api.put('/user/profile', updateData);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
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
                  // Set Traditional Indian as default for Indian-style weddings
                  const traditionalIndianTemplate = weddingTemplates.find(t => t.id === 'traditional-indian')?.id || weddingTemplates[0].id;
                  setFormData({ ...formData, theme: traditionalIndianTemplate, cardType: 'wedding', collection: 'standard' });
                  setPreviewTemplate(traditionalIndianTemplate);
                  toast.success('Wedding Card mode selected - Traditional Indian template loaded!');
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
                  Beautiful digital wedding invitations with Traditional Indian style
                </p>
              </button>

              <button
                onClick={() => {
                  router.push('/dashboard/animated-invite');
                }}
                className="p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left border-purple-500 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-600 dark:hover:border-purple-500"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">🎬</div>
                  <span className="px-2 sm:px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">New</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Animated Invites</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Premium cinematic auto-play wedding invitations - Movie-like experience
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

          {/* Business Card Customization Section - Staples-like Interface */}
          {formData.cardType === 'business' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Side - Card Preview */}
                <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Business Card Preview
                  </h3>
                  <div className="relative h-96 sm:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <BusinessCardPreview 
                      user={user} 
                      orientation={cardOrientation}
                      size={cardSize}
                      templateId={selectedBusinessTemplate}
                    />
                  </div>
                </div>

                {/* Right Side - Customization Options */}
                <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Business Cards
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Powered by</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Cardora</span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(getCardBasePrice(formData.country || 'IN'), formData.country || 'IN')}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">*</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <span>*</span>Service fee up to {formatCurrency(2.99, formData.country || 'IN')} per order
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>

                  {/* Delivery/Pickup Options */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Instant digital delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Share via QR code or link</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Update anytime without reprinting</span>
                    </div>
                  </div>

                  {/* Print Type Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Digital Card Type
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPrintType('digital')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                          printType === 'digital'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        Digital Card
                      </button>
                      <button
                        onClick={() => setPrintType('standard')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                          printType === 'standard'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        Standard Card
                      </button>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Size
                    </p>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {cardSize === 'standard' ? '3.5" x 2"' : '4" x 2.5"'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setCardSize('standard')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          cardSize === 'standard'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => setCardSize('large')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          cardSize === 'large'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>

                  {/* Orientation Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Orientation
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCardOrientation('horizontal')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          cardOrientation === 'horizontal'
                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Horizontal
                      </button>
                      <button
                        onClick={() => setCardOrientation('vertical')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          cardOrientation === 'vertical'
                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-4-4h8" />
                        </svg>
                        Vertical
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Sharing Capacity
                    </p>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {quantity} shares ({quantity} shares x 1 pack)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(50, quantity - 50))}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                        min="50"
                        step="50"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 50)}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Unit price: {formatCurrency(0.19, formData.country || 'IN')}
                    </p>
                  </div>

                  {/* Price Summary */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(getCardBasePrice(formData.country || 'IN'), formData.country || 'IN')}
                      </span>
                    </div>
                  </div>

                  {/* Create Now Button */}
                  <button
                    onClick={handleCreateNow}
                    disabled={saving || !user}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Now
                  </button>
                  {cartCount > 0 && (
                    <button
                      onClick={() => router.push('/dashboard/checkout')}
                      className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      View Cart ({cartCount} items)
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

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
                <div className="h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden relative">
                  <div 
                    className="h-full overflow-y-auto overflow-x-hidden scroll-smooth" 
                    style={{ 
                      scrollBehavior: 'smooth',
                    }}
                  >
                    <div className="flex justify-center items-start min-h-full w-full">
                      <div 
                        className="relative mx-auto"
                        style={{ 
                          width: '100%',
                          maxWidth: '450px',
                          margin: '0 auto',
                        }}
                      >
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
                      // Parents information
                      brideFatherName: formData.brideFatherName || '',
                      brideMotherName: formData.brideMotherName || '',
                      groomFatherName: formData.groomFatherName || '',
                      groomMotherName: formData.groomMotherName || '',
                      deceasedElders: formData.deceasedElders || '',
                    }}
                    templateId={previewTemplate}
                    cardType={formData.cardType || 'wedding'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Tip:</strong> Fill in the {formData.cardType === 'engagement' ? 'engagement' : formData.cardType === 'anniversary' ? 'anniversary' : 'wedding'} details below to see them in the preview above!
                </p>
              </div>
            </motion.div>
          )}

          {/* Event Card Customization Section - Similar to Business Cards */}
          {formData.cardType !== 'business' && previewTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.cardType === 'wedding' ? '💍 Wedding' : formData.cardType === 'engagement' ? '💎 Engagement' : '🎉 Anniversary'} Cards
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Powered by</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Cardora</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(getCardBasePrice(formData.country || 'IN'), formData.country || 'IN')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">*</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <span>*</span>Service fee up to {formatCurrency(2.99, formData.country || 'IN')} per order
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </p>
                </div>

                {/* Delivery Options */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant digital delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Share via QR code or link</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Update anytime without reprinting</span>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Sharing Capacity
                  </p>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {quantity} shares ({quantity} shares x 1 pack)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(50, quantity - 50))}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                      min="50"
                      step="50"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 50)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unit price: {formatCurrency(0.19, formData.country || 'IN')}
                  </p>
                </div>

                {/* Price Summary */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(getCardBasePrice(formData.country || 'IN'), formData.country || 'IN')}
                    </span>
                  </div>
                </div>

                {/* Create Now Button */}
                <button
                  onClick={handleCreateNow}
                  disabled={saving || !user}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  Create Now
                </button>
                
                {cartCount > 0 && (
                  <button
                    onClick={() => router.push('/dashboard/checkout')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Cart ({cartCount} items)
                  </button>
                )}
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
                    {!user?.cardPaid ? (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6 text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Complete Payment to Unlock
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Complete your payment to fill in your {formData.cardType === 'engagement' ? 'engagement' : formData.cardType === 'anniversary' ? 'anniversary' : 'wedding'} details
                        </p>
                        <button
                          onClick={() => router.push('/dashboard/checkout')}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          💳 Complete Payment
                        </button>
                      </div>
                    ) : (
                      <>
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

                      {/* Parents Information Section - Only for Wedding and Engagement, not Anniversary */}
                      {formData.cardType !== 'anniversary' && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            👨‍👩‍👧‍👦 Parents' Names (Optional - Traditional Indian Style)
                          </h4>
                          
                          {/* Deceased Elders */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Deceased Elders (Optional)
                            </label>
                            <input
                              type="text"
                              name="deceasedElders"
                              value={formData.deceasedElders}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Late S. Inderjeet Singh & Late Smt. Surjeet Kaur"
                            />
                            <p className="text-xs text-gray-500 mt-1">e.g., "Late S. Father Name & Late Smt. Mother Name"</p>
                          </div>

                          {/* Bride's Parents */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Bride's Parents
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                name="brideFatherName"
                                value={formData.brideFatherName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Father Name"
                              />
                              <input
                                type="text"
                                name="brideMotherName"
                                value={formData.brideMotherName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Mother Name"
                              />
                            </div>
                          </div>

                          {/* Groom's Parents */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Groom's Parents
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                name="groomFatherName"
                                value={formData.groomFatherName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Father Name"
                              />
                              <input
                                type="text"
                                name="groomMotherName"
                                value={formData.groomMotherName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Mother Name"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                      </>
                    )}
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

        {/* Templates Selection Modal */}
        <AnimatePresence>
          {showTemplatesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowTemplatesModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formData.cardType === 'business' 
                        ? 'Select Business Card Template'
                        : formData.cardType === 'wedding'
                        ? 'Select Wedding Card Template'
                        : formData.cardType === 'engagement'
                        ? 'Select Engagement Card Template'
                        : 'Select Anniversary Card Template'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formData.cardType === 'business'
                        ? 'Choose a template for your business cards'
                        : `Choose a template for your ${formData.cardType} cards`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTemplatesModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Category Filter */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {formData.cardType === 'business' ? (
                      getBusinessCardCategories().map((category) => (
                        <button
                          key={category}
                          onClick={() => setTemplateCategory(category)}
                          className={`px-4 py-2 rounded-full font-medium transition-all ${
                            templateCategory === category
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={() => setEventTemplateCategory('All')}
                          className={`px-4 py-2 rounded-full font-medium transition-all ${
                            eventTemplateCategory === 'All'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          All
                        </button>
                        {getCategories().map((category) => (
                          <button
                            key={category}
                            onClick={() => setEventTemplateCategory(category)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              eventTemplateCategory === category
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.cardType === 'business' ? (
                      // Business Card Templates
                      filteredBusinessTemplates.map((template) => {
                        const isSelected = selectedBusinessTemplate === template.id;
                        return (
                          <motion.button
                            key={template.id}
                            onClick={() => handleBusinessTemplateSelect(template.id)}
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
                          </motion.button>
                        );
                      })
                    ) : (
                      // Event Card Templates (Wedding/Engagement/Anniversary)
                      (() => {
                        let eventTemplates = [];
                        if (formData.cardType === 'wedding') {
                          eventTemplates = eventTemplateCategory === 'All' 
                            ? weddingTemplates 
                            : weddingTemplates.filter(t => t.category === eventTemplateCategory);
                        } else if (formData.cardType === 'engagement') {
                          eventTemplates = getSignatureTemplatesByType('engagement');
                        } else if (formData.cardType === 'anniversary') {
                          eventTemplates = getSignatureTemplatesByType('anniversary');
                        }
                        
                        return eventTemplates.map((template) => {
                          const isSelected = selectedEventTemplate === template.id || previewTemplate === template.id;
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
                            </motion.button>
                          );
                        });
                      })()
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                  <div>
                    {formData.cardType === 'business' ? (
                      selectedBusinessTemplate && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Selected: <span className="font-semibold text-gray-900 dark:text-white">
                            {getBusinessCardTemplateById(selectedBusinessTemplate)?.name}
                          </span>
                        </p>
                      )
                    ) : (
                      (selectedEventTemplate || previewTemplate) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Selected: <span className="font-semibold text-gray-900 dark:text-white">
                            {(() => {
                              const template = getTemplateById(selectedEventTemplate || previewTemplate) || 
                                            getSignatureTemplateById(selectedEventTemplate || previewTemplate);
                              return template?.name || 'Template';
                            })()}
                          </span>
                        </p>
                      )
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTemplatesModal(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        formData.cardType === 'business' 
                          ? !selectedBusinessTemplate 
                          : !selectedEventTemplate && !previewTemplate
                      }
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

