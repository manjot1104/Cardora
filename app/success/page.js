'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import api from '@/lib/api';
import { clearCart } from '@/lib/cart';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

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
      verifyPayment(sessionId, type);
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId, type, retryCount = 0) => {
    const maxRetries = 2;
    const retryDelay = 3000; // 3 seconds
    
    try {
      console.log(`🔍 Verifying payment with sessionId: ${sessionId} (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });
      
      // Race between API call and timeout
      const response = await Promise.race([
        api.post('/payment/verify', { sessionId }),
        timeoutPromise
      ]);
      
      console.log('✅ Payment verification response:', response.data);
      
      if (response.data.success) {
        setPayment(response.data.payment);
        
        // Verify payment and unlock features (only if user is logged in)
        // Wait a bit to ensure payment is fully updated in database
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          // Check if user has auth token
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (token) {
            console.log('🔓 User is authenticated, unlocking features...');
            console.log('🔓 Calling unlock with sessionId:', sessionId);
            
            try {
              // Also add timeout for unlock call
              const unlockTimeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Unlock request timeout')), 30000);
              });
              
              const unlockResponse = await Promise.race([
                api.post('/unlock/verify-payment', { sessionId }),
                unlockTimeoutPromise
              ]);
              
              console.log('✅ Unlock response:', unlockResponse.data);
              
              if (unlockResponse.data && unlockResponse.data.success) {
                console.log('Features unlocked:', unlockResponse.data);
                
                // Only clear cart AFTER successful payment verification and unlock
                if (type === 'cart') {
                  clearCart();
                  console.log('✅ Cart cleared after successful payment');
                }
              } else {
                console.warn('⚠️ Unlock response indicates failure:', unlockResponse.data);
                // Still clear cart if payment was successful
                if (type === 'cart' && response.data.success) {
                  clearCart();
                  console.log('✅ Cart cleared (unlock failed but payment successful)');
                }
              }
            } catch (unlockApiError) {
              console.error('❌ Unlock API error:', unlockApiError);
              console.error('❌ Unlock error message:', unlockApiError.message);
              console.error('❌ Unlock error response:', unlockApiError.response?.data);
              console.error('❌ Unlock error status:', unlockApiError.response?.status);
              console.error('❌ Unlock error code:', unlockApiError.code);
              
              // If it's a timeout, don't fail completely - webhook will handle it
              if (unlockApiError.message === 'Unlock request timeout') {
                console.warn('⚠️ Unlock timed out, but payment was successful. Webhook will handle feature unlock.');
                // Still clear cart since payment was successful
                if (type === 'cart' && response.data.success) {
                  clearCart();
                  console.log('✅ Cart cleared (unlock timed out but payment successful)');
                }
              } else if (unlockApiError.response?.status === 400) {
                // 400 error means payment not found yet - this is OK, webhook will handle it
                const errorData = unlockApiError.response?.data;
                console.warn('⚠️ Unlock returned 400:', errorData);
                console.warn('⚠️ This usually means payment is still processing. Webhook will handle feature unlock automatically.');
                
                // Still clear cart since payment was successful (Stripe confirmed it)
                if (type === 'cart' && response.data.success) {
                  clearCart();
                  console.log('✅ Cart cleared (unlock 400 error but payment successful - webhook will handle unlock)');
                }
              } else {
                // Other errors
                console.error('❌ Unlock error (non-timeout, non-400):', unlockApiError);
                
                // If payment was successful, still clear cart
                if (type === 'cart' && response.data.success) {
                  clearCart();
                  console.log('✅ Cart cleared (unlock failed but payment successful)');
                }
              }
            }
          } else {
            console.warn('⚠️ User not authenticated, skipping unlock. User should login to unlock features.');
            // Still clear cart if payment was successful
            if (type === 'cart') {
              clearCart();
              console.log('✅ Cart cleared after successful payment (user not logged in)');
            }
          }
        } catch (unlockError) {
          console.error('❌ Error in unlock process:', unlockError);
          // Don't clear cart if unlock fails, but payment was successful
          if (type === 'cart' && response.data.success) {
            clearCart();
            console.log('✅ Cart cleared (unlock error but payment successful)');
          }
        }
      } else {
        console.warn('⚠️ Payment verification failed, keeping cart');
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      
      // Handle timeout or network errors with retry
      const isTimeout = error.message === 'Request timeout' || error.code === 'ECONNABORTED';
      const isNetworkError = !error.response && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK');
      
      if ((isTimeout || isNetworkError) && retryCount < maxRetries) {
        console.log(`⏳ Retrying payment verification in ${retryDelay / 1000} seconds... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return verifyPayment(sessionId, type, retryCount + 1);
      }
      
      // If all retries failed or it's a different error, still show success
      // because Stripe webhook will handle the verification
      console.warn('⚠️ Payment verification failed after retries, but payment was successful via Stripe.');
      console.warn('⚠️ Webhook will handle verification and feature unlock in the background.');
      
      // Clear cart anyway since payment was successful (Stripe confirmed it)
      if (type === 'cart') {
        clearCart();
        console.log('✅ Cart cleared (verification timed out but payment was successful)');
      }
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

        {verifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span className="text-sm">Verifying payment and unlocking features...</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              This may take a few moments. Your features will be unlocked automatically.
            </p>
          </motion.div>
        )}

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
            href="/dashboard"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Verifying your payment..." />}>
      <SuccessContent />
    </Suspense>
  );
}
