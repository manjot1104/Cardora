'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCart, clearCart, getCartTotal } from '@/lib/cart';
import { formatCurrency } from '@/lib/countryConfig';
import api from '@/lib/api';
import LoadingScreen from '@/components/LoadingScreen';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
  const [country, setCountry] = useState('IN');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = getCart();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      router.push('/dashboard/card');
      return;
    }
    setCartItems(cart);
    // Get country from first item
    if (cart.length > 0) {
      setCountry(cart[0].country || 'IN');
    }
    setLoading(false);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cardora_cart', JSON.stringify(updatedCart));
    }
    if (updatedCart.length === 0) {
      router.push('/dashboard/card');
    }
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      if (selectedPaymentMethod === 'stripe') {
        // Create Stripe checkout session for cart
        const total = calculateTotal();
        const currency = cartItems[0]?.currency || 'INR';
        
        // Validate cart items before sending
        const validItems = cartItems.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        })).filter(item => item.price > 0 && item.quantity > 0);
        
        if (validItems.length === 0) {
          toast.error('Invalid cart items. Please add items to cart again.');
          setProcessing(false);
          return;
        }
        
        console.log('💳 Creating payment session:', {
          itemsCount: validItems.length,
          total,
          currency,
          country,
          items: validItems,
        });
        
        const response = await api.post('/payment/create-cart-session', {
          items: validItems,
          total: total,
          currency: currency,
          country: country,
        });

        if (response.data.url) {
          // Store cart items in session storage for after payment
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pending_cart', JSON.stringify(cartItems));
          }
          window.location.href = response.data.url;
        }
      } else if (selectedPaymentMethod === 'interac') {
        // Handle Interac payment
        toast.info('Interac payment will be processed after order confirmation');
        // For now, just clear cart and show success
        clearCart();
        toast.success('Order placed successfully!');
        router.push('/dashboard');
      } else {
        toast.error('Payment method not implemented yet');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to process payment';
      
      toast.error(errorMessage);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingScreen fullScreen={false} message="Loading checkout..." />
      </DashboardLayout>
    );
  }

  const total = calculateTotal();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.basePrice || 0) + (item.unitPrice * (item.quantity || 1)), 0);
  const serviceFee = cartItems.reduce((sum, item) => sum + (item.serviceFee || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
            <p className="text-gray-600 dark:text-gray-400">Review your order and proceed to payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size === 'standard' ? '3.5" x 2"' : '4" x 2.5"'}</p>
                          <p>Orientation: {item.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</p>
                          <p>Type: {item.printType === 'digital' ? 'Digital Card' : 'Standard Card'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.price || 0, item.country || 'IN')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="glass p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedPaymentMethod('stripe')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod === 'stripe'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">S</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Stripe</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Credit/Debit Card</p>
                        </div>
                      </div>
                      {selectedPaymentMethod === 'stripe' && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>

                  {country === 'CA' && (
                    <button
                      onClick={() => setSelectedPaymentMethod('interac')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPaymentMethod === 'interac'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">I</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Interac e-Transfer</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Bank Transfer</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === 'interac' && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <div className="glass p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Total</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(subtotal, country)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(serviceFee, country)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(total, country)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing || cartItems.length === 0}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : `Pay ${formatCurrency(total, country)}`}
                </button>

                <button
                  onClick={() => router.push('/dashboard/card')}
                  className="w-full mt-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
