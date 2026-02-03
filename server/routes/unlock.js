const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @route   POST /api/unlock/card
// @desc    Unlock card after payment verification
// @access  Private
router.post('/card', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has completed payment
    const completedPayment = await Payment.findOne({
      userId: user._id,
      status: 'completed',
    });

    if (!completedPayment) {
      return res.status(400).json({ error: 'No completed payment found. Please complete payment first.' });
    }

    // Unlock card
    user.cardPaid = true;
    await user.save();

    res.json({
      success: true,
      message: 'Card unlocked successfully',
      cardPaid: user.cardPaid,
    });
  } catch (error) {
    console.error('Unlock card error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/unlock/invite
// @desc    Unlock invite after payment verification
// @access  Private
router.post('/invite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has completed payment for animated invite
    const completedPayment = await Payment.findOne({
      userId: user._id,
      status: 'completed',
      purpose: { $regex: /animated.*invite/i },
    });

    if (!completedPayment) {
      return res.status(400).json({ error: 'No completed payment found. Please complete payment first.' });
    }

    // Unlock invite
    user.invitePaid = true;
    await user.save();

    res.json({
      success: true,
      message: 'Invite unlocked successfully',
      invitePaid: user.invitePaid,
    });
  } catch (error) {
    console.error('Unlock invite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/unlock/verify-payment
// @desc    Verify payment and unlock based on cart items
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for completed payment
    const payment = await Payment.findOne({
      userId: user._id,
      stripeSessionId: sessionId,
      status: 'completed',
    });

    if (!payment) {
      return res.status(400).json({ error: 'Payment not found or not completed' });
    }

    // Unlock based on payment purpose
    const purpose = payment.purpose?.toLowerCase() || '';
    
    if (purpose.includes('animated') || purpose.includes('invite')) {
      user.invitePaid = true;
    } else if (purpose.includes('card') || purpose.includes('business')) {
      user.cardPaid = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Payment verified and features unlocked',
      cardPaid: user.cardPaid,
      invitePaid: user.invitePaid,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
