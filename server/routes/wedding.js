const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { demoInviteData } = require('../../lib/demoData');

// @route   GET /api/wedding/:slug
// @desc    Get animated wedding invite by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ animatedInviteSlug: req.params.slug }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Wedding invite not found' });
    }

    // Check if user has paid for invite - if not, show demo data
    const isPaid = user.invitePaid || false;
    const displayData = isPaid ? {
      groomName: user.groomName || user.name?.split(' & ')[0] || 'Groom',
      brideName: user.brideName || user.name?.split(' & ')[1] || user.name?.split(' & ')[0] || 'Bride',
      weddingDate: user.weddingDate || 'Date TBA',
      venue: user.venue || 'Venue TBA',
      weddingTime: user.weddingTime || '6:00 PM onwards',
      story: user.weddingStory || '',
      couplePhoto: user.couplePhoto || user.profileImage || null,
      backgroundImage: user.cardBackgroundImage || null,
      music: user.weddingMusic || null,
      brideFatherName: user.brideFatherName || '',
      brideMotherName: user.brideMotherName || '',
      groomFatherName: user.groomFatherName || '',
      groomMotherName: user.groomMotherName || '',
      deceasedElders: user.deceasedElders || '',
    } : {
      ...demoInviteData,
    };

    // Return wedding data in format expected by animated templates
    res.json({
      slug: user.animatedInviteSlug,
      templateId: user.animatedTemplateId || 'luxury-hills',
      ...displayData,
      invitePaid: isPaid, // Include payment status
      isDemo: !isPaid, // Flag to indicate demo mode
    });
  } catch (error) {
    console.error('Get wedding invite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/wedding/create
// @desc    Create or update animated wedding invite
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const {
      templateId,
      groomName,
      brideName,
      weddingDate,
      venue,
      weddingTime,
      story,
      couplePhoto,
      backgroundImage,
      music,
      slug,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate slug if not provided
    let inviteSlug = slug;
    if (!inviteSlug) {
      const baseSlug = `${(groomName || 'groom').toLowerCase().replace(/\s+/g, '-')}-${(brideName || 'bride').toLowerCase().replace(/\s+/g, '-')}`;
      inviteSlug = baseSlug;
      
      // Check if slug exists for another user
      let counter = 1;
      while (await User.findOne({ animatedInviteSlug: inviteSlug, _id: { $ne: user._id } })) {
        inviteSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    } else {
      // Check if slug exists for another user
      const existingUser = await User.findOne({ animatedInviteSlug: inviteSlug, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ error: 'This slug is already taken' });
      }
    }

    // Update user with wedding invite data
    user.animatedInviteSlug = inviteSlug;
    user.animatedTemplateId = templateId || 'luxury-hills';
    user.groomName = groomName || user.groomName;
    user.brideName = brideName || user.brideName;
    user.weddingDate = weddingDate || user.weddingDate;
    user.venue = venue || user.venue;
    user.weddingTime = weddingTime || user.weddingTime;
    user.weddingStory = story || user.weddingStory;
    if (couplePhoto) user.couplePhoto = couplePhoto;
    if (backgroundImage) user.cardBackgroundImage = backgroundImage;
    if (music) user.weddingMusic = music;

    await user.save();

    res.json({
      message: 'Wedding invite created successfully',
      slug: inviteSlug,
      url: `${req.protocol}://${req.get('host')}/wedding/${inviteSlug}`,
    });
  } catch (error) {
    console.error('Create wedding invite error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   GET /api/wedding/user/current
// @desc    Get current user's wedding invite data
// @access  Private
router.get('/user/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      slug: user.animatedInviteSlug,
      templateId: user.animatedTemplateId || 'luxury-hills',
      groomName: user.groomName,
      brideName: user.brideName,
      weddingDate: user.weddingDate,
      venue: user.venue,
      weddingTime: user.weddingTime,
      story: user.weddingStory,
      couplePhoto: user.couplePhoto,
      backgroundImage: user.cardBackgroundImage,
      music: user.weddingMusic,
    });
  } catch (error) {
    console.error('Get user wedding invite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
