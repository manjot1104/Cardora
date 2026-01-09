'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payment/history');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">Payment History</h1>

          {payments.length === 0 ? (
            <div className="glass p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💳</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">No Payments Yet</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Payments you receive will appear here
              </p>
            </div>
          ) : (
            <div className="glass p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Date
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Purpose
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Method
                      </th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {payment.purpose?.replace('-', ' ') || 'General'}
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {payment.paymentMethod}
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

