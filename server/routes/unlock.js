const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { sendPaymentSuccessEmail } = require('../utils/email');

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

    // Check for all completed payments with this session ID
    const payments = await Payment.find({
      userId: user._id,
      stripeSessionId: sessionId,
      status: 'completed',
    });

    if (!payments || payments.length === 0) {
      return res.status(400).json({ error: 'Payment not found or not completed' });
    }

    // Process each payment item
    const unlockedItems = {
      cardPaid: user.cardPaid,
      invitePaid: user.invitePaid,
      createdInvites: [],
    };

    for (const payment of payments) {
      // Unlock based on payment purpose
      const purpose = payment.purpose?.toLowerCase() || '';
      
      if (purpose.includes('animated') || purpose.includes('invite')) {
        user.invitePaid = true;
        unlockedItems.invitePaid = true;

        // If payment has itemData with formData, create the invite
        if (payment.itemData && payment.itemData.type === 'animated_invite' && payment.itemData.formData) {
          try {
            const { templateId, formData } = payment.itemData;
            
            // Generate slug
            const baseSlug = `${(formData.groomName || 'groom').toLowerCase().replace(/\s+/g, '-')}-${(formData.brideName || 'bride').toLowerCase().replace(/\s+/g, '-')}`;
            let inviteSlug = baseSlug;
            
            // Check if slug exists
            let counter = 1;
            while (await User.findOne({ animatedInviteSlug: inviteSlug, _id: { $ne: user._id } })) {
              inviteSlug = `${baseSlug}-${counter}`;
              counter++;
            }

            // Update user with wedding invite data
            user.animatedInviteSlug = inviteSlug;
            user.animatedTemplateId = templateId || 'luxury-hills';
            user.groomName = formData.groomName || user.groomName;
            user.brideName = formData.brideName || user.brideName;
            user.weddingDate = formData.weddingDate || user.weddingDate;
            user.venue = formData.venue || user.venue;
            user.weddingTime = formData.weddingTime || user.weddingTime;
            user.weddingStory = formData.story || user.weddingStory;

            unlockedItems.createdInvites.push({
              slug: inviteSlug,
              url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/wedding/${inviteSlug}`,
            });
          } catch (inviteError) {
            console.error('Error creating invite after payment:', inviteError);
            // Don't fail the whole process if invite creation fails
          }
        }
      } else if (purpose.includes('card') || purpose.includes('business')) {
        user.cardPaid = true;
        unlockedItems.cardPaid = true;
      }
    }

    await user.save();

    // Send payment success email with all details
    try {
      const firstPayment = payments[0];
      const paymentDetails = {
        items: payments.map(p => ({
          name: p.purpose || 'Payment',
          quantity: p.itemData?.quantity || 1,
          price: p.amount,
        })),
        createdInvites: unlockedItems.createdInvites,
      };

      // Send email (don't block response if email fails)
      sendPaymentSuccessEmail(user, firstPayment, paymentDetails).catch(emailError => {
        console.error('Failed to send payment success email:', emailError);
      });
    } catch (emailError) {
      console.error('Error preparing payment success email:', emailError);
      // Don't fail the unlock process if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified and features unlocked',
      cardPaid: user.cardPaid,
      invitePaid: user.invitePaid,
      createdInvites: unlockedItems.createdInvites,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
