'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Cardora
        </motion.div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Cardora
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            One Tap. Endless Connections.
          </p>
          <p className="text-xl md:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            One Tap. Endless Connections.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            The modern way to share your professional identity using NFC and QR.
            <br />
            <span className="text-base text-gray-500 dark:text-gray-500">
              Expand your business digitally, update details instantly, and connect effortlessly.
            </span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Create Your Smart Card
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose Us?
          </h2>
          <p className="text-2xl font-semibold text-center mb-12 text-gray-700 dark:text-gray-300">
            Paper cards get lost
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Expand Digitally',
                description: 'Expand your business digitally with instant sharing',
                icon: '📈',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Update Instantly',
                description: 'Updating details is expensive with paper cards',
                icon: '🔄',
                color: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Track Connections',
                description: 'Hard to track who actually connects with you',
                icon: '📊',
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Eco-Friendly',
                description: 'Not eco-friendly - go digital and save the planet',
                icon: '🌱',
                color: 'from-orange-500 to-red-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity`}></div>
                <div className="relative glass p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-300 dark:hover:border-purple-500">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What We Offer Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            What We Offer?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Sales/Real Estate Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
              <div className="relative glass p-8 rounded-3xl hover:shadow-2xl transition-all border-2 border-blue-200 dark:border-blue-800">
                <div className="text-6xl mb-6 text-center">💼</div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                  Sales / Real Estate Card
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Professional digital business card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Instant contact sharing via NFC/QR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Payment integration for deposits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Track profile views & connections</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Digital Wedding Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
              <div className="relative glass p-8 rounded-3xl hover:shadow-2xl transition-all border-2 border-pink-200 dark:border-pink-800">
                <div className="text-6xl mb-6 text-center">💍</div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                  Digital Wedding Cards
                </h3>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full">
                    30 Premium Templates
                  </span>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>25-30 premium wedding templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Modern & elegant designs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Save paper & time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Easy to share via link/QR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Payment integration for gifts</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Physical NFC Smart Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
              <div className="relative glass p-8 rounded-3xl hover:shadow-2xl transition-all border-2 border-purple-200 dark:border-purple-800">
                <div className="text-6xl mb-6 text-center">📱</div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                  Physical NFC Smart Card
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Premium metal or PVC card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Linked to your digital profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Lifetime updates included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>QR code for payment link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tap to share instantly</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Signature Collection Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-24 mb-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative max-w-6xl mx-auto glass p-12 rounded-3xl border-4 border-gradient-to-r from-purple-500 to-pink-500 border-purple-300 dark:border-purple-700">
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold mb-4">
                👑 SIGNATURE COLLECTION
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Your Most Premium & Exclusive Cards
              </h2>
              <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 italic">
                "Where unforgettable moments begin"
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {/* Luxury Wedding Invitations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-purple-200 dark:border-purple-800"
              >
                <div className="text-5xl mb-4">💍</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Luxury Wedding Invitations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium designs for your special day
                </p>
              </motion.div>

              {/* Royal Engagement Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-rose-200 dark:border-rose-800"
              >
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Royal Engagement Cards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Celebrate your engagement in royal style
                </p>
              </motion.div>

              {/* Designer Anniversary Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-amber-200 dark:border-amber-800"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Designer Anniversary Cards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mark milestones with designer elegance
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Dual Platform Support */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-20 mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Available in India & Canada
          </h2>
          <p className="text-center text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Perfect for Large Events & Weddings
          </p>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            In countries like India where weddings and large events are common, sending physical invitations can be challenging and expensive. 
            Digital cards save paper, time, and money while making it easy to invite large groups of people instantly.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass p-8 rounded-3xl text-center border-2 border-orange-200 dark:border-orange-800">
              <div className="text-6xl mb-4">🇮🇳</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">India</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Perfect for Indian weddings and large events
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ UPI & Razorpay payments</li>
                <li>✓ Support for large guest lists</li>
                <li>✓ Save on printing costs</li>
                <li>✓ Easy sharing via WhatsApp</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl text-center border-2 border-red-200 dark:border-red-800">
              <div className="text-6xl mb-4">🇨🇦</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Canada</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Modern digital solutions for Canadian events
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✓ Interac & Stripe payments</li>
                <li>✓ CAD currency support</li>
                <li>✓ Eco-friendly digital cards</li>
                <li>✓ Instant sharing & updates</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-20 mb-20"
        >
          <div className="max-w-4xl mx-auto glass p-8 rounded-3xl border-2 border-green-200 dark:border-green-800">
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
              💳 Easy Payment Integration
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                <div className="text-4xl mb-4">🏦</div>
                <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Interac / E-Transfer</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Accept payments via Interac e-transfer with email integration
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                <div className="text-4xl mb-4">💳</div>
                <h4 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Stripe Payments</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Secure credit card payments with Stripe integration
                </p>
              </div>
            </div>
            <p className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm">
              QR code on your card directs users to your payment link instantly
            </p>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-24 mb-20"
        >
          <div className="max-w-4xl mx-auto text-center glass p-12 rounded-3xl border-2 border-purple-200 dark:border-purple-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Go Digital?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of professionals who have made the switch to digital business cards
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Create Your Card Now
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cardora</span>. 
              One Tap. Endless Connections.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

