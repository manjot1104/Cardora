'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import LoadingScreen from '@/components/LoadingScreen';

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitorsLoading, setVisitorsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAnalytics();
    fetchVisitors();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/analytics/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setVisitorsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingScreen fullScreen={false} message="Loading analytics..." />
      </DashboardLayout>
    );
  }

  const deviceData = stats?.deviceStats
    ? Object.entries(stats.deviceStats).map(([device, count]) => ({
        device: device.charAt(0).toUpperCase() + device.slice(1),
        views: count,
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Analytics</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Profile Views',
                value: stats?.profileViews || 0,
                icon: '👁️',
                color: 'blue',
              },
              {
                label: 'Payment Page Views',
                value: stats?.paymentViews || 0,
                icon: '💳',
                color: 'purple',
              },
              {
                label: 'Successful Payments',
                value: stats?.paymentSuccesses || 0,
                icon: '✅',
                color: 'green',
              },
              {
                label: 'Total Revenue',
                value: `$${stats?.totalAmount?.toFixed(2) || '0.00'}`,
                icon: '💰',
                color: 'yellow',
              },
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
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Device Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Views by Device</h2>
              {deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="device" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No device data available
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity (30 Days)</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Profile Views</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{stats?.recentViews || 0}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Payments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{stats?.recentPayments || 0}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visitor Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6 rounded-3xl mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visitor Insights</h2>
              {visitors && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {visitors.totalVisitors} visitors
                </span>
              )}
            </div>

            {visitorsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600 dark:text-gray-400">Loading visitors...</div>
              </div>
            ) : visitors && visitors.visitors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Device</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Browser</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">IP Address</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Referer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Visited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.visitors.map((visitor, index) => (
                      <motion.tr
                        key={visitor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getDeviceIcon(visitor.deviceType)}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {visitor.deviceType}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                          {visitor.browser}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {visitor.ipAddress}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {visitor.referer}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(visitor.visitedAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No visitors yet</p>
                  <p className="text-sm">Your profile views will appear here</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

