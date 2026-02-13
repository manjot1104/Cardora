'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

export default function PublicCardPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
  }, [params.username]);

  const fetchCard = async () => {
    try {
      const response = await api.get(`/card/${params.username}`);
      const userData = response.data.user;
      console.log('🔍 Fetched User Data:', {
        brideFatherName: userData?.brideFatherName,
        brideMotherName: userData?.brideMotherName,
        groomFatherName: userData?.groomFatherName,
        groomMotherName: userData?.groomMotherName,
        deceasedElders: userData?.deceasedElders,
      });
      setUser(userData);
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your beautiful card..." />;
  }

  if (!user || !user.profileEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Card Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">This card is not available.</p>
        </div>
      </div>
    );
  }

  // Always show user profile card at /u/[username] route
  // Wedding templates are shown at /wedding/[slug] route

  const socialLinks = [
    { key: 'linkedin', icon: '💼', label: 'LinkedIn' },
    { key: 'twitter', icon: '🐦', label: 'Twitter' },
    { key: 'instagram', icon: '📷', label: 'Instagram' },
    { key: 'website', icon: '🌐', label: 'Website' },
    { key: 'github', icon: '💻', label: 'GitHub' },
  ].filter((link) => user.socialLinks?.[link.key]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-6 sm:py-8 md:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50"
        >
          {/* Premium Header with gradient */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4 sm:mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-white shadow-2xl">
                {user.name?.charAt(0).toUpperCase() || '👤'}
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-2"
            >
              {user.name}
            </motion.h1>
            {user.profession && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 px-2"
              >
                {user.profession}
              </motion.p>
            )}
            {user.company && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium px-2"
              >
                {user.company}
              </motion.p>
            )}
          </div>

          {/* Premium Contact Info */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {user.email && (
              <motion.a
                href={`mailto:${user.email}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-blue-100 dark:border-gray-600"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  📧
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex-1 break-all">{user.email}</span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">→</span>
              </motion.a>
            )}

            {user.phone && (
              <motion.a
                href={`tel:${user.phone}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-purple-100 dark:border-gray-600"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  📱
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex-1 break-all">{user.phone}</span>
                <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">→</span>
              </motion.a>
            )}

            {user.whatsapp && (
              <motion.a
                href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-green-100 dark:border-gray-600"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  💬
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex-1 break-all">{user.whatsapp}</span>
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">→</span>
              </motion.a>
            )}

            {user.address && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl border border-amber-100 dark:border-gray-600 shadow-md"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
                  📍
                </div>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{user.address}</span>
              </motion.div>
            )}
          </div>

          {/* Premium Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center"
              >
                Connect With Me
              </motion.h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.key}
                    href={user.socialLinks[link.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="group flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{link.icon}</div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Premium Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            {user.paymentEnabled && (
              <Link
                href={`/pay/${user.username}`}
                className="flex-1 group relative py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl sm:rounded-2xl font-bold text-center hover:shadow-2xl transform hover:scale-105 transition-all overflow-hidden text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  💳 Pay Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${user.name}'s Cardora Card`,
                    text: `Check out ${user.name}'s digital card`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex-1 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl font-bold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:border-blue-400 dark:hover:border-purple-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              📤 Share Card
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

