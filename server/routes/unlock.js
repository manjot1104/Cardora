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
    console.log('🔓 [Unlock] verify-payment called');
    console.log('🔓 [Unlock] User ID:', req.user?.id);
    console.log('🔓 [Unlock] Request body:', req.body);
    console.log('🔓 [Unlock] Request headers:', req.headers);
    
    const { sessionId } = req.body;
    
    if (!sessionId) {
      console.error('❌ [Unlock] Session ID is missing');
      return res.status(400).json({ 
        success: false,
        error: 'Session ID is required' 
      });
    }

    console.log('🔓 [Unlock] Session ID:', sessionId);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('❌ [Unlock] User not found:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('🔓 [Unlock] User found:', user.email);

    // Check for all completed payments with this session ID
    // Try multiple times with delay in case payment is still being updated
    let payments = await Payment.find({
      userId: user._id,
      stripeSessionId: sessionId,
      status: 'completed',
    });

    console.log('🔓 [Unlock] Payments found (first attempt):', payments.length);

    // Retry logic with multiple attempts and increasing delays
    const maxRetries = 4;
    let retryCount = 0;
    
    while ((!payments || payments.length === 0) && retryCount < maxRetries) {
      const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s, 8s
      console.log(`⏳ [Unlock] No payments found, waiting ${delay/1000} seconds and retrying... (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Try to find completed payments
      payments = await Payment.find({
        userId: user._id,
        stripeSessionId: sessionId,
        status: 'completed',
      });
      
      console.log(`🔓 [Unlock] Payments found (retry ${retryCount + 1}):`, payments.length);
      
      // If still no payments, check all payments (including pending)
      if (!payments || payments.length === 0) {
        const allPayments = await Payment.find({
          userId: user._id,
          stripeSessionId: sessionId,
        });
        console.log('🔓 [Unlock] All payments (any status):', allPayments.length);
        
        if (allPayments.length > 0) {
          console.log('🔓 [Unlock] Payment statuses:', allPayments.map(p => ({ id: p._id, status: p.status })));
          console.log('⏳ [Unlock] Payments exist but not completed, updating status...');
          
          // Update all payments to completed
          await Payment.updateMany(
            { userId: user._id, stripeSessionId: sessionId },
            { status: 'completed' }
          );
          
          // Try again after update
          payments = await Payment.find({
            userId: user._id,
            stripeSessionId: sessionId,
            status: 'completed',
          });
          console.log('🔓 [Unlock] Payments found (after update):', payments.length);
        }
      }
      
      retryCount++;
    }

    // Final check: If still no payments, verify with Stripe directly
    if (!payments || payments.length === 0) {
      console.error('❌ [Unlock] No completed payments found after all retries');
      console.error('❌ [Unlock] Verifying with Stripe directly...');
      
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        
        console.log('🔓 [Unlock] Stripe session status:', stripeSession.payment_status);
        
        if (stripeSession.payment_status === 'paid') {
          // Payment is confirmed in Stripe, create/update payment record
          console.log('✅ [Unlock] Payment confirmed in Stripe, creating/updating payment record...');
          
          // Try to find or create payment
          let payment = await Payment.findOne({
            userId: user._id,
            stripeSessionId: sessionId,
          });
          
          if (!payment) {
            // Create new payment record
            console.log('🔓 [Unlock] Creating new payment record...');
            payment = await Payment.create({
              userId: user._id,
              amount: stripeSession.amount_total / 100, // Convert from cents
              currency: stripeSession.currency || 'usd',
              paymentMethod: 'stripe',
              stripeSessionId: sessionId,
              stripePaymentIntentId: stripeSession.payment_intent,
              status: 'completed',
              payerEmail: stripeSession.customer_details?.email,
              purpose: stripeSession.metadata?.purpose || 'cart',
              itemData: stripeSession.metadata?.itemData ? JSON.parse(stripeSession.metadata.itemData) : undefined,
            });
            console.log('✅ [Unlock] Payment record created');
          } else {
            // Update existing payment
            console.log('🔓 [Unlock] Updating existing payment record...');
            payment = await Payment.findOneAndUpdate(
              { userId: user._id, stripeSessionId: sessionId },
              {
                status: 'completed',
                stripePaymentIntentId: stripeSession.payment_intent,
                payerEmail: stripeSession.customer_details?.email,
              },
              { new: true }
            );
            console.log('✅ [Unlock] Payment record updated');
          }
          
          // Get all payments for this session
          payments = await Payment.find({
            userId: user._id,
            stripeSessionId: sessionId,
            status: 'completed',
          });
          console.log('🔓 [Unlock] Payments found (after Stripe verification):', payments.length);
        } else {
          console.error('❌ [Unlock] Stripe session payment status is not paid:', stripeSession.payment_status);
        }
      } catch (stripeError) {
        console.error('❌ [Unlock] Error verifying with Stripe:', stripeError);
      }
    }

    // Final check after all attempts
    if (!payments || payments.length === 0) {
      console.error('❌ [Unlock] Final check: No payments found after all attempts');
      console.error('❌ [Unlock] Session ID:', sessionId);
      console.error('❌ [Unlock] User ID:', user._id);
      
      // Check if payment exists for any user with this sessionId (for debugging)
      const anyPaymentAnyUser = await Payment.findOne({ stripeSessionId: sessionId });
      if (anyPaymentAnyUser) {
        console.error('⚠️ [Unlock] Payment found but for different user:', anyPaymentAnyUser.userId);
        console.error('⚠️ [Unlock] Expected user:', user._id);
      } else {
        console.error('⚠️ [Unlock] No payment found with this sessionId at all');
      }
      
      // Ensure response is always JSON
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ 
        success: false,
        error: 'Payment not found or not completed',
        details: 'No completed payment found for this session. Payment might still be processing. The webhook will handle this automatically.',
        sessionId: sessionId,
        userId: user._id.toString(),
        message: 'Please wait a few moments and refresh. The payment will be processed automatically.'
      });
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
      console.log('📧 [Unlock] Preparing to send payment success email...');
      console.log('📧 [Unlock] User email:', user.email);
      const firstPayment = payments[0];
      const paymentDetails = {
        items: payments.map(p => ({
          name: p.purpose || 'Payment',
          quantity: p.itemData?.quantity || 1,
          price: p.amount,
        })),
        createdInvites: unlockedItems.createdInvites,
      };

      console.log('📧 [Unlock] Payment details:', JSON.stringify(paymentDetails, null, 2));
      console.log('📧 [Unlock] Calling sendPaymentSuccessEmail...');

      // Send email (don't block response if email fails)
      sendPaymentSuccessEmail(user, firstPayment, paymentDetails)
        .then(result => {
          if (result.success) {
            console.log('✅ [Unlock] Payment success email sent successfully!');
            console.log('📧 [Unlock] Message ID:', result.messageId);
          } else {
            console.error('❌ [Unlock] Payment success email failed:', result.error || result.message);
            console.error('❌ [Unlock] Email configured:', result.emailConfigured);
          }
        })
        .catch(emailError => {
          console.error('❌ [Unlock] Exception sending payment success email:', emailError);
          console.error('❌ [Unlock] Error stack:', emailError.stack);
        });
    } catch (emailError) {
      console.error('❌ [Unlock] Error preparing payment success email:', emailError);
      console.error('❌ [Unlock] Error stack:', emailError.stack);
      // Don't fail the unlock process if email fails
    }

    console.log('✅ [Unlock] Successfully processed unlock');
    console.log('✅ [Unlock] Card paid:', user.cardPaid);
    console.log('✅ [Unlock] Invite paid:', user.invitePaid);
    console.log('✅ [Unlock] Created invites:', unlockedItems.createdInvites.length);

    res.status(200).json({
      success: true,
      message: 'Payment verified and features unlocked',
      cardPaid: user.cardPaid,
      invitePaid: user.invitePaid,
      createdInvites: unlockedItems.createdInvites,
    });
  } catch (error) {
    console.error('❌ [Unlock] Verify payment error:', error);
    console.error('❌ [Unlock] Error stack:', error.stack);
    console.error('❌ [Unlock] Error message:', error.message);
    console.error('❌ [Unlock] Error name:', error.name);
    
    // Always return JSON, never HTML or JS
    // Ensure Content-Type is set
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message || 'An error occurred while verifying payment',
      type: error.name || 'UnknownError'
    });
  }
});

module.exports = router;
