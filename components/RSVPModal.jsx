'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RSVPModal({ isOpen, onClose, inviteSlug }) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    attending: true,
    numberOfGuests: 1,
    dietaryRestrictions: '',
    message: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('📝 Submitting RSVP with data:', {
        inviteSlug,
        formData
      });

      if (!inviteSlug) {
        toast.error('Error: Invite slug is missing. Please refresh the page and try again.');
        setSubmitting(false);
        return;
      }

      if (!formData.guestName || formData.guestName.trim() === '') {
        toast.error('Please enter your name.');
        setSubmitting(false);
        return;
      }

      const response = await api.post('/rsvp/submit', {
        inviteSlug,
        guestName: formData.guestName.trim(),
        guestEmail: formData.guestEmail?.trim() || '',
        attending: formData.attending,
        numberOfGuests: formData.attending ? (formData.numberOfGuests || 1) : 0,
        dietaryRestrictions: formData.dietaryRestrictions?.trim() || '',
        message: formData.message?.trim() || '',
        phone: formData.phone?.trim() || '',
      });

      console.log('✅ RSVP submission response:', response.data);

      if (response.data.success) {
        toast.success(response.data.message || 'RSVP submitted successfully!');
        setSubmitted(true);
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            guestName: '',
            guestEmail: '',
            attending: true,
            numberOfGuests: 1,
            dietaryRestrictions: '',
            message: '',
            phone: '',
          });
          onClose();
        }, 2000);
      } else {
        toast.error(response.data.error || 'Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      console.error('❌ RSVP submission error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to submit RSVP. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
            style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white p-6 rounded-t-3xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Confirm Attendance</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm mt-2 opacity-90">
                  We'd love to celebrate with you!
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your RSVP has been confirmed. We can't wait to celebrate with you!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Attending Toggle */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-700/50 dark:via-gray-700/30 dark:to-gray-700/50 rounded-xl border border-indigo-100 dark:border-gray-600/50">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          name="attending"
                          checked={formData.attending}
                          onChange={handleChange}
                          className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                        />
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          I will be attending
                        </span>
                      </label>
                    </div>

                    {/* Guest Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Number of Guests */}
                    {formData.attending && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          name="numberOfGuests"
                          value={formData.numberOfGuests}
                          onChange={handleChange}
                          min="1"
                          max="20"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                    )}

                    {/* Dietary Restrictions */}
                    {formData.attending && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Dietary Restrictions (Optional)
                        </label>
                        <textarea
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={handleChange}
                          rows="2"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="e.g., Vegetarian, Gluten-free, Allergies..."
                        />
                      </div>
                    )}

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700/50 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Leave a message for the couple..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting || !formData.guestName}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                    >
                      {submitting ? 'Submitting...' : 'Confirm RSVP'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
