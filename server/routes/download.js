const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/download/card
// @desc    Download card to gallery
// @access  Private
router.post('/card', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has paid
    if (!user.cardPaid) {
      return res.status(403).json({ error: 'Please complete payment to download your card' });
    }

    // Get card data
    const cardData = {
      name: user.name,
      profession: user.profession,
      company: user.company,
      phone: user.phone,
      whatsapp: user.whatsapp,
      email: user.email,
      address: user.address,
      socialLinks: user.socialLinks,
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
      theme: user.theme,
      profileImage: user.profileImage,
      cardBackgroundImage: user.cardBackgroundImage,
      cardImages: user.cardImages,
    };

    // Add to gallery
    if (!user.gallery) {
      user.gallery = [];
    }

    user.gallery.push({
      type: 'card',
      templateId: user.theme || 'default',
      slug: user.username,
      downloadedAt: new Date(),
      data: cardData,
    });

    await user.save();

    res.json({
      success: true,
      message: 'Card downloaded to gallery',
      gallery: user.gallery,
    });
  } catch (error) {
    console.error('Download card error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/download/invite
// @desc    Download invite to gallery
// @access  Private
router.post('/invite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has paid
    if (!user.invitePaid) {
      return res.status(403).json({ error: 'Please complete payment to download your invite' });
    }

    // Get invite data
    const inviteData = {
      groomName: user.groomName,
      brideName: user.brideName,
      weddingDate: user.weddingDate,
      venue: user.venue,
      weddingTime: user.weddingTime,
      story: user.weddingStory,
      couplePhoto: user.couplePhoto,
      backgroundImage: user.cardBackgroundImage,
      music: user.weddingMusic,
      brideFatherName: user.brideFatherName,
      brideMotherName: user.brideMotherName,
      groomFatherName: user.groomFatherName,
      groomMotherName: user.groomMotherName,
      deceasedElders: user.deceasedElders,
    };

    // Add to gallery
    if (!user.gallery) {
      user.gallery = [];
    }

    user.gallery.push({
      type: 'invite',
      templateId: user.animatedTemplateId || 'luxury-hills',
      slug: user.animatedInviteSlug,
      downloadedAt: new Date(),
      data: inviteData,
    });

    await user.save();

    res.json({
      success: true,
      message: 'Invite downloaded to gallery',
      gallery: user.gallery,
    });
  } catch (error) {
    console.error('Download invite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/download/gallery
// @desc    Get user's gallery
// @access  Private
router.get('/gallery', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('gallery');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      gallery: user.gallery || [],
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
