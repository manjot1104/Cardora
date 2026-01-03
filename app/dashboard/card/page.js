'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

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
  });

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
      setFormData({
        profileEnabled: userData.profileEnabled !== false,
        paymentEnabled: userData.paymentEnabled || false,
        paymentType: userData.paymentType || 'custom',
        fixedAmount: userData.fixedAmount || '',
        interacEmail: userData.interacEmail || '',
        theme: userData.theme || 'default',
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/user/profile', {
        ...formData,
        fixedAmount: formData.fixedAmount ? parseFloat(formData.fixedAmount) : undefined,
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Card Settings</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Form */}
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configure Your Card</h2>

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
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your QR Code</h2>

              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 bg-white rounded-2xl shadow-lg animate-glow">
                  <QRCodeSVG
                    value={cardUrl}
                    size={200}
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

