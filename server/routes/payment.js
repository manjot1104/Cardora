const express = require('express');

// Verify Stripe key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not found in environment variables');
  console.warn('⚠️  Payment functionality will not work without Stripe keys');
} else {
  const keyPrefix = process.env.STRIPE_SECRET_KEY.substring(0, 7);
  if (keyPrefix === 'sk_test') {
    console.log('✅ Stripe Test Mode: Test keys detected');
  } else if (keyPrefix === 'sk_live') {
    console.log('🔴 Stripe Live Mode: Live keys detected - BE CAREFUL!');
  } else {
    console.warn('⚠️  Stripe key format unrecognized');
  }
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');
const { sendPaymentSuccessEmail } = require('../utils/email');

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

// @route   POST /api/payment/create-cart-session
// @desc    Create Stripe checkout session for cart items
// @access  Private
router.post('/create-cart-session', auth, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' });
  }
  try {
    const { items, total, currency = 'USD', country = 'IN' } = req.body;

    console.log('📦 Creating cart session with:', {
      itemsCount: items?.length,
      total,
      currency,
      country,
      userId: req.user._id,
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided');
      return res.status(400).json({ error: 'Cart items are required' });
    }

    if (!total || total <= 0) {
      console.error('❌ Invalid total:', total);
      return res.status(400).json({ error: 'Valid total amount is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.error('❌ User not found:', req.user._id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate and create line items for cart
    const lineItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.price || item.price <= 0) {
        console.error(`❌ Invalid price for item ${i + 1}:`, item);
        return res.status(400).json({ 
          error: `Invalid price for item: ${item.name || 'Unknown'}` 
        });
      }
      
      if (!item.quantity || item.quantity <= 0) {
        console.error(`❌ Invalid quantity for item ${i + 1}:`, item);
        return res.status(400).json({ 
          error: `Invalid quantity for item: ${item.name || 'Unknown'}` 
        });
      }
      
      const unitPrice = item.price / item.quantity;
      const unitAmountInCents = Math.round(unitPrice * 100);
      
      if (unitAmountInCents <= 0) {
        console.error(`❌ Invalid unit amount for item ${i + 1}:`, {
          price: item.price,
          quantity: item.quantity,
          unitPrice,
          unitAmountInCents,
        });
        return res.status(400).json({ 
          error: `Invalid unit price for item: ${item.name || 'Unknown'}` 
        });
      }
      
      lineItems.push({
        price_data: {
          currency: (currency || 'USD').toLowerCase(),
          product_data: {
            name: item.name || 'Business Cards',
            description: `${item.quantity} cards - ${item.size || 'standard'} - ${item.orientation || 'horizontal'}`,
          },
          unit_amount: unitAmountInCents,
        },
        quantity: item.quantity,
      });
    }

    console.log('✅ Line items created:', lineItems.length);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&type=cart`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/checkout`,
      metadata: {
        userId: user._id.toString(),
        username: user.username,
        type: 'cart',
        itemCount: items.length.toString(),
      },
    });

    // Create payment records for each item
    for (const item of items) {
      // Determine purpose based on item type
      let purpose = '';
      if (item.type === 'animated_invite') {
        purpose = `Animated Invites - ${item.name}`;
      } else if (item.type === 'business_card') {
        purpose = `Business Cards - ${item.name}`;
      } else if (item.type?.includes('_card')) {
        const cardType = item.type.replace('_card', '');
        purpose = `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Cards - ${item.name}`;
      } else {
        purpose = `${item.name || 'Cart Item'}`;
      }

      await Payment.create({
        userId: user._id,
        amount: item.price,
        currency: currency || 'USD',
        paymentMethod: 'stripe',
        stripeSessionId: session.id,
        status: 'pending',
        purpose: purpose,
        // Store item data for post-payment processing
        itemData: {
          type: item.type,
          templateId: item.templateId,
          slug: item.slug,
          formData: item.formData,
          quantity: item.quantity,
        },
      });
    }

    // Track payment view
    await Analytics.create({
      userId: user._id,
      type: 'cart_payment_view',
      deviceType: detectDeviceType(req.get('user-agent')),
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Create cart session error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
    
    // Return more detailed error message
    let errorMessage = 'Failed to create payment session';
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = error.message || 'Invalid payment request';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    console.log('🔍 [Payment Verify] Starting verification for session:', sessionId);
    const startTime = Date.now();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('🔍 [Payment Verify] Stripe session retrieved, payment_status:', session.payment_status);

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

      console.log('🔍 [Payment Verify] Payment record updated:', payment ? 'found' : 'not found');

      // Send response immediately, don't wait for email/analytics
      res.json({ success: true, payment });

      // Do non-blocking operations after response
      if (payment) {
        // Check if this is a cart payment from metadata (we already have session data)
        const isCartPayment = session.metadata?.type === 'cart';
        
        // Track successful payment (non-blocking)
        Analytics.create({
          userId: payment.userId,
          type: isCartPayment ? 'cart_payment_success' : 'payment_success',
          deviceType: 'unknown',
        }).catch(err => console.error('❌ Analytics error:', err));

        // Send payment success email (non-blocking)
        setImmediate(async () => {
          try {
            console.log('📧 Preparing to send payment success email...');
            const user = await User.findById(payment.userId);
            if (user) {
              console.log('📧 User found:', user.email);
              // Get all payments for this session (for cart payments)
              const allPayments = isCartPayment 
                ? await Payment.find({ stripeSessionId: sessionId, status: 'completed' })
                : [payment];
              
              console.log('📧 All payments for session:', allPayments.length);
              
              const paymentDetails = {
                items: allPayments.map(p => ({
                  name: p.purpose || 'Payment',
                  quantity: p.itemData?.quantity || 1,
                  price: p.amount,
                })),
              };

              console.log('📧 Payment details:', JSON.stringify(paymentDetails, null, 2));
              console.log('📧 Calling sendPaymentSuccessEmail...');

              // Send email (don't block response if email fails)
              sendPaymentSuccessEmail(user, payment, paymentDetails)
                .then(result => {
                  if (result.success) {
                    console.log('✅ Payment success email sent successfully!');
                    console.log('📧 Message ID:', result.messageId);
                  } else {
                    console.error('❌ Payment success email failed:', result.error || result.message);
                    console.error('❌ Email configured:', result.emailConfigured);
                  }
                })
                .catch(emailError => {
                  console.error('❌ Exception sending payment success email:', emailError);
                  console.error('❌ Error stack:', emailError.stack);
                });
            } else {
              console.error('❌ User not found for payment:', payment.userId);
            }
          } catch (emailError) {
            console.error('❌ Error preparing payment success email:', emailError);
            console.error('❌ Error stack:', emailError.stack);
          }
        });
      }

      const duration = Date.now() - startTime;
      console.log(`✅ [Payment Verify] Verification completed in ${duration}ms`);
    } else {
      console.log('⚠️ [Payment Verify] Payment not paid, status:', session.payment_status);
      res.json({ success: false, status: session.payment_status });
    }
  } catch (error) {
    console.error('❌ [Payment Verify] Error:', error);
    console.error('❌ [Payment Verify] Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify payment',
      message: error.message 
    });
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
      // Check if this is a cart payment from metadata
      const isCartPayment = session.metadata?.type === 'cart';
      
      await Analytics.create({
        userId: payment.userId,
        type: isCartPayment ? 'cart_payment_success' : 'payment_success',
        deviceType: 'unknown',
      });

      // Unlock card/invite based on payment
      const user = await User.findById(payment.userId);
      if (user) {
        if (isCartPayment) {
          // For cart payments, check metadata for item types
          // We'll unlock based on what was purchased
          // This is handled in a separate endpoint after payment verification
        } else {
          // For direct payments, unlock card
          user.cardPaid = true;
          await user.save();
        }

        // Send payment success email via webhook
        try {
          // Get all payments for this session (for cart payments)
          const allPayments = isCartPayment 
            ? await Payment.find({ stripeSessionId: session.id, status: 'completed' })
            : [payment];
          
          const paymentDetails = {
            items: allPayments.map(p => ({
              name: p.purpose || 'Payment',
              quantity: p.itemData?.quantity || 1,
              price: p.amount,
            })),
          };

          // Send email (don't block webhook response if email fails)
          console.log('📧 [Webhook] Preparing to send payment success email...');
          sendPaymentSuccessEmail(user, payment, paymentDetails)
            .then(result => {
              if (result.success) {
                console.log('✅ [Webhook] Payment success email sent successfully!');
                console.log('📧 [Webhook] Message ID:', result.messageId);
              } else {
                console.error('❌ [Webhook] Payment success email failed:', result.error || result.message);
                console.error('❌ [Webhook] Email configured:', result.emailConfigured);
              }
            })
            .catch(emailError => {
              console.error('❌ [Webhook] Exception sending payment success email:', emailError);
              console.error('❌ [Webhook] Error stack:', emailError.stack);
            });
        } catch (emailError) {
          console.error('Error preparing payment success email in webhook:', emailError);
          // Don't fail the webhook if email fails
        }
      }
    }
  }

  res.json({ received: true });
};

// Export webhook handler separately
router.webhook = webhookHandler;

module.exports = router;
