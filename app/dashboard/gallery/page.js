'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getAuthToken } from '@/lib/auth';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

export default function GalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get('/download/gallery');
      if (response.data.success) {
        setGallery(response.data.gallery || []);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingScreen fullScreen={false} message="Loading your gallery..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📸 My Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your downloaded cards and invitations
          </p>
        </motion.div>

        {gallery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your gallery is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Download your cards and invitations to see them here
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/card"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Create Card
              </Link>
              <Link
                href="/dashboard/animated-invite"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
              >
                Create Invite
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {item.type === 'card' ? '💳' : '🎬'}
                    </span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(item.downloadedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {item.type === 'card' 
                      ? (item.data?.name || 'Card')
                      : `${item.data?.groomName || 'Groom'} & ${item.data?.brideName || 'Bride'}`
                    }
                  </h3>
                  {item.type === 'card' && item.data?.profession && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.data.profession}
                    </p>
                  )}
                  {item.type === 'invite' && item.data?.weddingDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.data.weddingDate}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {item.type === 'card' && item.slug && (
                    <Link
                      href={`/u/${item.slug}`}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center text-sm font-semibold transition-all"
                    >
                      View
                    </Link>
                  )}
                  {item.type === 'invite' && item.slug && (
                    <Link
                      href={`/wedding/${item.slug}`}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center text-sm font-semibold transition-all"
                    >
                      View
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
