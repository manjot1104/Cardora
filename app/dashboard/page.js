'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/analytics/summary'),
      ]);
      setUser(userRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingScreen fullScreen={false} message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${user?.username}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your digital card and payments
          </p>
        </motion.div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {[
              { label: 'Profile Views', value: stats.profileViews, icon: '👁️', color: 'blue' },
              { label: 'Total Payments', value: stats.totalPayments, icon: '💳', color: 'green' },
              { label: 'Total Amount', value: `$${stats.totalAmount.toFixed(2)}`, icon: '💰', color: 'purple' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl">{stat.icon}</span>
                  <span className={`text-lg sm:text-xl md:text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Your Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Your Digital Card</h2>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Your card is live at:</p>
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
              >
                {cardUrl}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href={`/u/${user?.username}`}
                target="_blank"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-center text-sm sm:text-base"
              >
                View Card
              </Link>
              <Link
                href="/dashboard/card"
                className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-center text-sm sm:text-base"
              >
                Edit Card
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Create Your Card - Merged Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Create Your Card</h2>
          
          {/* Choose Card Type */}
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">Choose Card Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              <Link
                href="/dashboard/card"
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  user?.cardType === 'business'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💼</div>
                  {user?.cardType === 'business' && (
                    <span className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Business Card</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Professional digital business card
                </p>
              </Link>

              <Link
                href="/dashboard/card"
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  user?.cardType === 'wedding'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💍</div>
                  {user?.cardType === 'wedding' && (
                    <span className="px-2 sm:px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Wedding Card</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Beautiful digital wedding invitations with Traditional Indian style
                </p>
              </Link>

              <Link
                href="/dashboard/animated-invite"
                className="p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left border-purple-500 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-600 dark:hover:border-purple-500"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">🎬</div>
                  <span className="px-2 sm:px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">New</span>
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Animated Invites</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Premium cinematic auto-play wedding invitations - Movie-like experience
                </p>
              </Link>

              <Link
                href="/dashboard/card"
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  user?.cardType === 'engagement'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">💎</div>
                  {user?.cardType === 'engagement' && (
                    <span className="px-2 sm:px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Engagement Card</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Royal engagement celebrations
                </p>
              </Link>

              <Link
                href="/dashboard/card"
                className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                  user?.cardType === 'anniversary'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl">🎉</div>
                  {user?.cardType === 'anniversary' && (
                    <span className="px-2 sm:px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">Active</span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">Anniversary Card</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Designer anniversary cards
                </p>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <Link
            href="/dashboard/profile"
            className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">Edit Profile</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Update your personal information</p>
          </Link>

          <Link
            href="/dashboard/payments"
            className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">Payment Settings</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Configure payment options</p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">View Analytics</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track your card performance</p>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

