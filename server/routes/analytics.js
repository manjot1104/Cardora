const express = require('express');
const Analytics = require('../models/Analytics');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/analytics/track
// @desc    Track an event
// @access  Public (can be called from frontend)
router.post('/track', async (req, res) => {
  try {
    const { userId, type, deviceType, userAgent, ipAddress, referer } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ error: 'UserId and type are required' });
    }

    await Analytics.create({
      userId,
      type,
      deviceType: deviceType || 'unknown',
      userAgent,
      ipAddress,
      referer,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/summary
// @desc    Get analytics summary for logged-in user
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get analytics counts
    const profileViews = await Analytics.countDocuments({
      userId,
      type: 'profile_view',
    });

    const paymentViews = await Analytics.countDocuments({
      userId,
      type: 'payment_view',
    });

    const paymentSuccesses = await Analytics.countDocuments({
      userId,
      type: 'payment_success',
    });

    // Get payment statistics
    const payments = await Payment.find({
      userId,
      status: 'completed',
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPayments = payments.length;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentViews = await Analytics.countDocuments({
      userId,
      type: 'profile_view',
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentPayments = await Analytics.countDocuments({
      userId,
      type: 'payment_success',
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get views by device type
    const deviceStats = await Analytics.aggregate([
      { $match: { userId, type: 'profile_view' } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
    ]);

    res.json({
      profileViews,
      paymentViews,
      paymentSuccesses,
      totalAmount,
      totalPayments,
      recentViews,
      recentPayments,
      deviceStats: deviceStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

