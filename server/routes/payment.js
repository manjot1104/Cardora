const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to detect device type
const detectDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/desktop|windows|mac|linux/i.test(userAgent)) return 'desktop';
  return 'unknown';
};

// @route   POST /api/payment/create-stripe-session
// @desc    Create Stripe checkout session
// @access  Public (can be called from payment page)
router.post('/create-stripe-session', async (req, res) => {
  try {
    const { username, amount, purpose, currency = 'USD' } = req.body;

    if (!username || !amount) {
      return res.status(400).json({ error: 'Username and amount are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !user.paymentEnabled) {
      return res.status(404).json({ error: 'Payment not available for this card' });
    }

    // Check if amount matches fixed amount requirement
    if (user.paymentType === 'fixed' && user.fixedAmount && amount !== user.fixedAmount) {
      return res.status(400).json({ error: `Payment amount must be ${user.fixedAmount}` });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: purpose || `Payment to ${user.name}`,
              description: `Payment for ${user.name}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
      metadata: {
        userId: user._id.toString(),
        username: user.username,
        purpose: purpose || 'general',
      },
    });

    // Create payment record
    await Payment.create({
      userId: user._id,
      amount,
      currency,
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      status: 'pending',
      purpose: purpose || 'general',
    });

    // Track payment view
    await Analytics.create({
      userId: user._id,
      type: 'payment_view',
      deviceType: detectDeviceType(req.get('user-agent')),
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Stripe payment
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { stripeSessionId: sessionId },
        {
          status: 'completed',
          stripePaymentIntentId: session.payment_intent,
          payerEmail: session.customer_details?.email,
        },
        { new: true }
      );

      if (payment) {
        // Track successful payment
        await Analytics.create({
          userId: payment.userId,
          type: 'payment_success',
          deviceType: 'unknown',
        });
      }

      res.json({ success: true, payment });
    } else {
      res.json({ success: false, status: session.payment_status });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// @route   GET /api/payment/history
// @desc    Get payment history for logged-in user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Webhook handler (exported separately for raw body middleware)
const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: 'completed',
        stripePaymentIntentId: session.payment_intent,
        payerEmail: session.customer_details?.email,
      }
    );

    // Track successful payment
    const payment = await Payment.findOne({ stripeSessionId: session.id });
    if (payment) {
      await Analytics.create({
        userId: payment.userId,
        type: 'payment_success',
        deviceType: 'unknown',
      });
    }
  }

  res.json({ received: true });
};

// Export webhook handler separately
router.webhook = webhookHandler;

module.exports = router;
