'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setEmailSent(true);
      
      // If reset link is provided (email not configured or failed)
      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
        if (response.data.emailDelayed) {
          toast.success('Reset link generated! Email may be delayed - use the link below.', { 
            duration: 10000,
            icon: '⚠️'
          });
        } else if (response.data.emailError) {
          toast.warning(`Email issue: ${response.data.emailError}. Use the link below.`, { 
            duration: 10000 
          });
        } else {
          toast.success('Password reset link generated!', { duration: 5000 });
        }
      } else {
        toast.success('Password reset link sent! Check your email (may take a few minutes).');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Failed to send reset email. Please try again.';
      toast.error(errorMessage, { duration: 8000 });
      
      // If there's a reset link in the error response, show it
      if (error.response?.data?.resetLink) {
        setResetLink(error.response.data.resetLink);
        setEmailSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {emailSent 
              ? 'Check your email for password reset instructions'
              : 'Enter your email address and we\'ll send you a link to reset your password'
            }
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ Password reset link {resetLink ? 'generated' : 'has been sent'} {resetLink ? '' : `to ${email}`}
              </p>
            </div>
            
            {resetLink ? (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold text-center">
                  ⚠️ Email not configured - Use this link to reset your password:
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <a
                    href={resetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm block text-center font-mono"
                  >
                    {resetLink}
                  </a>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resetLink);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                >
                  Copy Link
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  This link will expire in 1 hour.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Please check your email inbox (and spam folder) for the password reset link.
                The link will expire in 1 hour.
              </p>
            )}
          </div>
        )}

        <div className="mt-4 sm:mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
