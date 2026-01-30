'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { animatedTemplates, getAnimatedTemplateById } from '@/lib/animatedTemplates';
import ImageUpload from '@/components/ImageUpload';
import { countries, formatCurrency, detectUserCountry } from '@/lib/countryConfig';
import { addToCart, getCartCount } from '@/lib/cart';

export default function AnimatedInvitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    templateId: 'cinematic-film',
    groomName: '',
    brideName: '',
    weddingDate: '',
    venue: '',
    weddingTime: '6:00 PM',
    story: '',
    slug: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inviteUrl, setInviteUrl] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [country, setCountry] = useState('IN');
  const [showActionModal, setShowActionModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    const detectedCountry = detectUserCountry();
    setCountry(detectedCountry);
    fetchUser();
    setCartCount(getCartCount());
  }, []);

  const fetchUser = async () => {
    try {
      const [userRes, inviteRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/wedding/user/current').catch(() => null),
      ]);
      
      const userData = userRes.data;
      setUser(userData);

      if (inviteRes?.data) {
        setFormData({
          templateId: inviteRes.data.templateId || 'luxury-hills',
          groomName: inviteRes.data.groomName || userData.groomName || '',
          brideName: inviteRes.data.brideName || userData.brideName || '',
          weddingDate: inviteRes.data.weddingDate || userData.weddingDate || '',
          venue: inviteRes.data.venue || userData.venue || '',
          weddingTime: inviteRes.data.weddingTime || '6:00 PM',
          story: inviteRes.data.story || '',
          slug: inviteRes.data.slug || '',
        });
        if (inviteRes.data.slug) {
          setInviteUrl(`${window.location.origin}/wedding/${inviteRes.data.slug}`);
        }
      } else {
        // Use existing user data
        setFormData({
          templateId: 'luxury-hills',
          groomName: userData.groomName || '',
          brideName: userData.brideName || '',
          weddingDate: userData.weddingDate || '',
          venue: userData.venue || '',
          weddingTime: '6:00 PM',
          story: '',
          slug: '',
        });
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTemplateSelect = (templateId) => {
    setFormData({
      ...formData,
      templateId,
    });
    toast.success('Template selected!');
  };

  const handleCreateInvite = async () => {
    if (!formData.groomName || !formData.brideName) {
      toast.error('Please fill in groom and bride names');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/wedding/create', {
        ...formData,
        couplePhoto: user?.couplePhoto || user?.profileImage,
        backgroundImage: user?.cardBackgroundImage,
        music: user?.weddingMusic,
      });

      const newUrl = `${window.location.origin}/wedding/${response.data.slug}`;
      setInviteUrl(newUrl);
      return { success: true, slug: response.data.slug, url: newUrl };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create invite');
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    const result = await handleCreateInvite();
    if (result.success) {
      setShowActionModal(false);
      window.open(result.url, '_blank');
      toast.success('Invitation opened in new tab!');
    }
  };

  const getAnimatedInviteBasePrice = (country) => {
    return country === 'CA' ? 50 : 2000; // $50 for Canada, ₹2000 for India
  };

  const handleAddToCart = async () => {
    if (!formData.groomName || !formData.brideName) {
      toast.error('Please fill in groom and bride names');
      setShowActionModal(false);
      return;
    }

    if (!user) {
      toast.error('Please save your card settings first');
      setShowActionModal(false);
      return;
    }

    // First create the invite to get slug
    const result = await handleCreateInvite();
    if (!result.success) {
      setShowActionModal(false);
      return;
    }

    // Add to cart
    const unitPrice = 0.19;
    const basePrice = getAnimatedInviteBasePrice(country);
    const serviceFee = 2.99;
    const totalPrice = basePrice + (unitPrice * quantity) + serviceFee;

    const template = getAnimatedTemplateById(formData.templateId);
    
    const cartItem = {
      type: 'animated_invite',
      name: `${quantity} Animated Wedding Invites - ${template?.name || 'Custom'}`,
      quantity: quantity,
      templateId: formData.templateId,
      slug: result.slug,
      unitPrice: unitPrice,
      basePrice: basePrice,
      serviceFee: serviceFee,
      price: totalPrice,
      currency: country === 'CA' ? 'CAD' : 'INR',
      country: country,
      userId: user._id,
      username: user.username,
      // Store form data for later use
      formData: {
        groomName: formData.groomName,
        brideName: formData.brideName,
        weddingDate: formData.weddingDate,
        venue: formData.venue,
        weddingTime: formData.weddingTime,
        story: formData.story,
      },
    };

    addToCart(cartItem);
    setCartCount(getCartCount());
    toast.success(`${quantity} animated invites added to cart!`);
    setShowActionModal(false);
  };

  const handleCreateNow = () => {
    if (!formData.groomName || !formData.brideName) {
      toast.error('Please fill in groom and bride names');
      return;
    }
    setShowActionModal(true);
  };

  const filteredTemplates = selectedCategory === 'All'
    ? animatedTemplates
    : animatedTemplates.filter(t => t.category === selectedCategory);

  const categories = ['All', ...new Set(animatedTemplates.map(t => t.category))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎬 Animated Wedding Invites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create cinematic, Instagram-worthy animated wedding invitations
          </p>
        </motion.div>

        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 sm:p-6 rounded-2xl mb-6 border-2 border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Select Your Country</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">Choose your country for currency and payment methods</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {Object.values(countries).map((countryOption) => (
              <button
                key={countryOption.code}
                onClick={() => {
                  setCountry(countryOption.code);
                  toast.success(`${countryOption.name} selected - Currency: ${countryOption.currency}`);
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  country === countryOption.code
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{countryOption.flag}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{countryOption.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{countryOption.currency} {countryOption.symbol}</p>
                    </div>
                  </div>
                  {country === countryOption.code && (
                    <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Template Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-6 border-2 border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Template
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => {
              const isSelected = formData.templateId === template.id;
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
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className="text-4xl mb-2">{template.name.charAt(0)}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {template.description}
                  </div>
                  <div className="flex gap-1 mt-2 text-xs">
                    {template.hasEnvelope && <span>✉️</span>}
                    {template.hasMusic && <span>🎵</span>}
                    {template.hasParallax && <span>✨</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-6 border-2 border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Fill Your Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Groom Name *
              </label>
              <input
                type="text"
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Bride Name *
              </label>
              <input
                type="text"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Jane"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Wedding Date
              </label>
              <input
                type="text"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="August 26, 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Wedding Time
              </label>
              <input
                type="text"
                name="weddingTime"
                value={formData.weddingTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="6:00 PM onwards"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tuscany, Italy"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Your Story (Optional)
              </label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Two souls. One destiny. A love written in the stars..."
              />
            </div>

          </div>

          {/* Image Uploads */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Couple Photo
              </label>
              <ImageUpload
                imageType="couplePhoto"
                currentImage={user?.couplePhoto || user?.profileImage}
                onImageUploaded={(url) => {
                  setUser({ ...user, couplePhoto: url });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Background Image
              </label>
              <ImageUpload
                imageType="background"
                currentImage={user?.cardBackgroundImage}
                onImageUploaded={(url) => {
                  setUser({ ...user, cardBackgroundImage: url });
                }}
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                🎬 Animated Wedding Invites
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Powered by</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">Cardora</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(getAnimatedInviteBasePrice(country), country)}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">*</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start sm:items-center gap-1 flex-wrap">
                <span>*</span>Service fee up to {formatCurrency(2.99, country)} per order
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
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
              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">
                Sharing Capacity
              </p>
              <div className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 overflow-hidden w-full">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words block overflow-wrap-anywhere">
                  {quantity} shares ({quantity} shares x 1 pack)
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <button
                  onClick={() => setQuantity(Math.max(50, quantity - 50))}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex-shrink-0 min-w-[44px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                  min="50"
                  step="50"
                  className="flex-1 min-w-0 px-2 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-sm sm:text-base font-medium"
                />
                <button
                  onClick={() => setQuantity(quantity + 50)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex-shrink-0 min-w-[44px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Unit price: {formatCurrency(0.19, country)}
              </p>
            </div>

            {/* Price Summary */}
            <div className="mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(getAnimatedInviteBasePrice(country), country)}
                </span>
              </div>
            </div>

            {/* Create Now Button */}
            <button
              onClick={handleCreateNow}
              disabled={saving}
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
        </motion.div>

        {/* Invite URL & QR Code */}
        {inviteUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl border-2 border-green-200 dark:border-green-800"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎉 Your Invite is Ready!
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteUrl);
                      toast.success('Link copied!');
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <a
                  href={inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Open Invite →
                </a>
              </div>
              <div className="flex flex-col items-center">
                <QRCodeSVG value={inviteUrl} size={200} />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Scan to open
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Choose an Action
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                What would you like to do with your animated invite?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handlePreview}
                  disabled={saving}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview Invitation
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={saving}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
              
              <button
                onClick={() => setShowActionModal(false)}
                className="mt-4 w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
