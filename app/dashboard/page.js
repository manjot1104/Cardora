'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your digital card and payments
          </p>
        </motion.div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Profile Views', value: stats.profileViews, icon: '👁️', color: 'blue' },
              { label: 'Total Payments', value: stats.totalPayments, icon: '💳', color: 'green' },
              { label: 'Total Amount', value: `$${stats.totalAmount.toFixed(2)}`, icon: '💰', color: 'purple' },
              { label: 'Recent Views', value: stats.recentViews, icon: '📊', color: 'orange' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Your Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-8 rounded-3xl mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Digital Card</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
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
            <div className="flex gap-3">
              <Link
                href={`/u/${user?.username}`}
                target="_blank"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                View Card
              </Link>
              <Link
                href="/dashboard/card"
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Edit Card
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Link
            href="/dashboard/profile"
            className="glass p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Edit Profile</h3>
            <p className="text-gray-600 dark:text-gray-400">Update your personal information</p>
          </Link>

          <Link
            href="/dashboard/payments"
            className="glass p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Payment Settings</h3>
            <p className="text-gray-600 dark:text-gray-400">Configure payment options</p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="glass p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">View Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Track your card performance</p>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

