'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

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
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
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

  const socialLinks = [
    { key: 'linkedin', icon: '💼', label: 'LinkedIn' },
    { key: 'twitter', icon: '🐦', label: 'Twitter' },
    { key: 'instagram', icon: '📷', label: 'Instagram' },
    { key: 'website', icon: '🌐', label: 'Website' },
    { key: 'github', icon: '💻', label: 'GitHub' },
  ].filter((link) => user.socialLinks?.[link.key]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl"
            >
              {user.name?.charAt(0).toUpperCase() || '👤'}
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
            {user.profession && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">{user.profession}</p>
            )}
            {user.company && (
              <p className="text-lg text-gray-500 dark:text-gray-500">{user.company}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mb-8">
            {user.email && (
              <motion.a
                href={`mailto:${user.email}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl">📧</span>
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </motion.a>
            )}

            {user.phone && (
              <motion.a
                href={`tel:${user.phone}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl">📱</span>
                <span className="text-gray-900 dark:text-white">{user.phone}</span>
              </motion.a>
            )}

            {user.whatsapp && (
              <motion.a
                href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <span className="text-gray-900 dark:text-white">{user.whatsapp}</span>
              </motion.a>
            )}

            {user.address && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                <span className="text-2xl">📍</span>
                <span className="text-gray-900 dark:text-white">{user.address}</span>
              </motion.div>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.key}
                    href={user.socialLinks[link.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-3xl mb-2">{link.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {user.paymentEnabled && (
              <Link
                href={`/pay/${user.username}`}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-center hover:shadow-xl transform hover:scale-105 transition-all"
              >
                💳 Pay Now
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
              className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              📤 Share Card
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

