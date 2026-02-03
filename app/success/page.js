'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import api from '@/lib/api';
import { clearCart } from '@/lib/cart';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const type = searchParams.get('type');
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerifying(false);
    }

    // Clear cart if it's a cart payment
    if (type === 'cart') {
      clearCart();
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId) => {
    try {
      const response = await api.post('/payment/verify', { sessionId });
      if (response.data.success) {
        setPayment(response.data.payment);
        
        // Verify payment and unlock features
        try {
          const unlockResponse = await api.post('/unlock/verify-payment', { sessionId });
          if (unlockResponse.data.success) {
            console.log('Features unlocked:', unlockResponse.data);
          }
        } catch (unlockError) {
          console.error('Error unlocking features:', unlockError);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={1000}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="glass p-12 rounded-3xl max-w-md w-full text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl"
        >
          ✓
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-8"
        >
          Your payment has been processed successfully.
        </motion.p>

        {payment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-8"
          >
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                </span>
              </div>
              {payment.purpose && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Purpose:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {payment.purpose.replace('-', ' ')}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Badge Unlock Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl mb-8"
        >
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-bold text-white">Milestone Unlocked!</div>
          <div className="text-sm text-yellow-100">First Payment Received</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <Link
            href="/"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
