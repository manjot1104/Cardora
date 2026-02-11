'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingQuotes = [
  "Creating something beautiful takes time... ✨",
  "Good things come to those who wait... 🌟",
  "We're preparing something special for you... 💫",
  "Almost there, just a moment... ⏳",
  "Crafting perfection, one moment at a time... 🎨",
  "Your digital card is being prepared... 📇",
  "Loading your memories... 📸",
  "Setting the stage for your story... 🎭",
  "Weaving magic into your invitation... ✨",
  "Polishing every detail... 💎",
  "Bringing your vision to life... 🌈",
  "Just a few more seconds... ⚡",
  "Something wonderful is loading... 🌸",
  "Preparing your personalized experience... 🎯",
  "Almost ready to amaze you... 🚀",
];

const loadingIcons = [
  { emoji: '💍', name: 'Ring' },
  { emoji: '🌹', name: 'Rose' },
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '🎉', name: 'Celebration' },
  { emoji: '💐', name: 'Bouquet' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '💫', name: 'Dizzy' },
  { emoji: '🎨', name: 'Artist' },
  { emoji: '🕊️', name: 'Dove' },
  { emoji: '🌙', name: 'Moon' },
  { emoji: '☀️', name: 'Sun' },
  { emoji: '💝', name: 'Gift' },
  { emoji: '🎊', name: 'Confetti' },
  { emoji: '🌟', name: 'Glowing Star' },
];

export default function LoadingScreen({ message = null, fullScreen = true }) {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentIcon, setCurrentIcon] = useState({ emoji: '💍', name: 'Ring' });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    // Set initial quote and icon
    const initialQuoteIndex = Math.floor(Math.random() * loadingQuotes.length);
    const initialIconIndex = Math.floor(Math.random() * loadingIcons.length);
    setCurrentQuote(loadingQuotes[initialQuoteIndex]);
    setCurrentIcon(loadingIcons[initialIconIndex]);
    setQuoteIndex(initialQuoteIndex);
    setIconIndex(initialIconIndex);

    // Rotate quotes every 3 seconds
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => {
        const next = (prev + 1) % loadingQuotes.length;
        setCurrentQuote(loadingQuotes[next]);
        return next;
      });
    }, 3000);

    // Rotate icons every 2 seconds
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => {
        const next = (prev + 1) % loadingIcons.length;
        setCurrentIcon(loadingIcons[next]);
        return next;
      });
    }, 2000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const containerClass = fullScreen
    ? 'min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={`${containerClass} relative`}>
      <div className="text-center px-4 relative z-10">
        {/* Classic 3 Dots Loading Animation */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full"
              animate={{
                y: [0, -12, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Quote Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 max-w-md mx-auto"
          >
            {message || currentQuote}
          </motion.p>
        </AnimatePresence>

      </div>
    </div>
  );
}
