'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getCountryByCode, formatCurrency } from '@/lib/countryConfig';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: 'general',
  });

  useEffect(() => {
    fetchCard();
  }, [params.username]);

  const fetchCard = async () => {
    try {
      const response = await api.get(`/card/${params.username}`);
      const userData = response.data.user;
      setUser(userData);
      if (userData.paymentType === 'fixed' && userData.fixedAmount) {
        setFormData({ amount: userData.fixedAmount.toString(), purpose: 'general' });
      }
    } catch (error) {
      toast.error('Card not found or payment not enabled');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStripePayment = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    setProgress(0);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await api.post('/payment/create-stripe-session', {
        username: params.username,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
      });

      // Complete progress
      setProgress(100);
      clearInterval(progressInterval);

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      toast.error(error.response?.data?.error || 'Failed to create payment session');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user || !user.paymentEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Not Available</h1>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
            >
              💳
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Send Payment</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">to {user.name}</p>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount {user?.currency && getCountryByCode(user.country || 'IN') ? `(${getCountryByCode(user.country || 'IN').symbol})` : '($)'}
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={user.paymentType === 'fixed' || processing}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-4 text-3xl font-bold text-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50"
                placeholder="0.00"
              />
              {user.paymentType === 'fixed' && user.fixedAmount && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Fixed amount: {formatCurrency(user.fixedAmount, user.country || 'IN')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Purpose
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                disabled={processing}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50"
              >
                <option value="general">General Payment</option>
                <option value="tip">Tip</option>
                <option value="consultation">Consultation</option>
                <option value="donation">Donation</option>
                <option value="wedding-gift">Wedding Gift</option>
                <option value="advance">Advance Payment</option>
              </select>
            </div>

            {/* Progress Bar Animation */}
            <AnimatePresence>
              {processing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Completing your connection...
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleStripePayment}
                disabled={processing || !formData.amount}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? 'Processing...' : '💳 Pay with Stripe'}
              </button>

              {user.interacEmail && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    💸 Interac / E-Transfer
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                    Send an e-transfer to:
                  </p>
                  <p className="font-mono text-lg font-bold text-blue-900 dark:text-blue-300 break-all">
                    {user.interacEmail}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
                    After sending, the recipient will be notified.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/u/${user.username}`}
                className="block text-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                ← View Profile Instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

