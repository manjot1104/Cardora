const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      profession,
      company,
      phone,
      whatsapp,
      address,
      socialLinks,
      profileEnabled,
      paymentEnabled,
      paymentType,
      fixedAmount,
      interacEmail,
      theme,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (profession !== undefined) updateData.profession = profession;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (address !== undefined) updateData.address = address;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (profileEnabled !== undefined) updateData.profileEnabled = profileEnabled;
    if (paymentEnabled !== undefined) updateData.paymentEnabled = paymentEnabled;
    if (paymentType) updateData.paymentType = paymentType;
    if (fixedAmount !== undefined) updateData.fixedAmount = fixedAmount;
    if (interacEmail !== undefined) updateData.interacEmail = interacEmail;
    if (theme) updateData.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

