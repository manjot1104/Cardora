'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RSVPsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState([]);
  const [groupedRSVPs, setGroupedRSVPs] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    declined: 0,
    totalGuests: 0,
  });
  const [selectedInvite, setSelectedInvite] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await api.get('/rsvp/dashboard/all');
      if (response.data.success) {
        setRsvps(response.data.rsvps);
        setGroupedRSVPs(response.data.groupedRSVPs || {});
        setStats(response.data.stats || {
          total: 0,
          attending: 0,
          declined: 0,
          totalGuests: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      toast.error('Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRSVP = async (rsvpId) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) {
      return;
    }

    try {
      const response = await api.delete(`/rsvp/${rsvpId}`);
      if (response.data.success) {
        toast.success('RSVP deleted successfully');
        fetchRSVPs();
      }
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast.error('Failed to delete RSVP');
    }
  };

  const inviteSlugs = Object.keys(groupedRSVPs);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading RSVPs...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ✉️ RSVPs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all RSVPs for your wedding invitations
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total RSVPs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl border-2 border-green-200 dark:border-green-800"
          >
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.attending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attending</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-2xl border-2 border-red-200 dark:border-red-800"
          >
            <div className="text-3xl mb-2">❌</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.declined}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Declined</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGuests}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Guests</div>
          </motion.div>
        </div>

        {/* RSVPs List */}
        {rsvps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No RSVPs Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Share your wedding invitation link to start receiving RSVPs!
            </p>
            <button
              onClick={() => router.push('/dashboard/animated-invite')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Create Invite
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Filter by Invite Slug */}
            {inviteSlugs.length > 1 && (
              <div className="glass p-4 rounded-2xl">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Invite:
                </label>
                <select
                  value={selectedInvite || ''}
                  onChange={(e) => setSelectedInvite(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Invites</option>
                  {inviteSlugs.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* RSVPs Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Guest Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Guests</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(selectedInvite ? groupedRSVPs[selectedInvite] || [] : rsvps).map((rsvp) => (
                      <tr
                        key={rsvp._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {rsvp.guestName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {rsvp.guestEmail || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {rsvp.phone || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              rsvp.attending
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {rsvp.attending ? '✅ Attending' : '❌ Declined'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {rsvp.attending ? rsvp.numberOfGuests || 1 : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(rsvp.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteRSVP(rsvp._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Detailed View for Selected RSVP */}
            {selectedInvite && groupedRSVPs[selectedInvite] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Invite: {selectedInvite}
                </h3>
                <div className="space-y-4">
                  {groupedRSVPs[selectedInvite].map((rsvp) => (
                    <div
                      key={rsvp._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {rsvp.guestName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {rsvp.guestEmail || 'No email'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rsvp.attending
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {rsvp.attending ? '✅ Attending' : '❌ Declined'}
                        </span>
                      </div>
                      {rsvp.attending && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <p><strong>Number of Guests:</strong> {rsvp.numberOfGuests || 1}</p>
                          {rsvp.dietaryRestrictions && (
                            <p><strong>Dietary Restrictions:</strong> {rsvp.dietaryRestrictions}</p>
                          )}
                        </div>
                      )}
                      {rsvp.message && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Message:</strong> {rsvp.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Submitted: {new Date(rsvp.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
