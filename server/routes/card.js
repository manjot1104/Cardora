const express = require('express');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const router = express.Router();

// Helper function to detect device type
const detectDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/desktop|windows|mac|linux/i.test(userAgent)) return 'desktop';
  return 'unknown';
};

// @route   GET /api/card/:username
// @desc    Get public card by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userAgent = req.get('user-agent');
    const referer = req.get('referer');
    const ipAddress = req.ip || req.connection.remoteAddress;

    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Track profile view
    if (user.profileEnabled) {
      await Analytics.create({
        userId: user._id,
        type: 'profile_view',
        deviceType: detectDeviceType(userAgent),
        userAgent,
        ipAddress,
        referer,
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        profession: user.profession,
        company: user.company,
        phone: user.phone,
        whatsapp: user.whatsapp,
        email: user.email,
        address: user.address,
        socialLinks: user.socialLinks,
        profileEnabled: user.profileEnabled,
        paymentEnabled: user.paymentEnabled,
        paymentType: user.paymentType,
        fixedAmount: user.fixedAmount,
        interacEmail: user.interacEmail,
        theme: user.theme,
        username: user.username,
        weddingDate: user.weddingDate,
        venue: user.venue,
        brideName: user.brideName,
        groomName: user.groomName,
        brideFatherName: user.brideFatherName,
        brideMotherName: user.brideMotherName,
        groomFatherName: user.groomFatherName,
        groomMotherName: user.groomMotherName,
        deceasedElders: user.deceasedElders,
        cardType: user.cardType,
        collection: user.collection,
        country: user.country,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

