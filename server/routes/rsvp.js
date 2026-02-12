const express = require('express');
const RSVP = require('../models/RSVP');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @route   POST /api/rsvp/submit
// @desc    Submit RSVP for a wedding invite
// @access  Public (anyone can RSVP)
router.post('/submit', async (req, res) => {
  try {
    console.log('📝 RSVP submission request received:', {
      body: req.body,
      inviteSlug: req.body.inviteSlug
    });

    const {
      inviteSlug,
      guestName,
      guestEmail,
      attending = true,
      numberOfGuests = 1,
      dietaryRestrictions,
      message,
      phone,
    } = req.body;

    // Validation
    if (!inviteSlug) {
      console.error('❌ Missing inviteSlug');
      return res.status(400).json({ 
        success: false,
        error: 'Invite slug is required' 
      });
    }

    if (!guestName || guestName.trim() === '') {
      console.error('❌ Missing or empty guestName');
      return res.status(400).json({ 
        success: false,
        error: 'Guest name is required' 
      });
    }

    console.log('🔍 Searching for user with animatedInviteSlug:', inviteSlug);

    // Find the user who created this invite
    const user = await User.findOne({ animatedInviteSlug: inviteSlug });
    
    if (!user) {
      console.error('❌ User not found with animatedInviteSlug:', inviteSlug);
      // Try to find by username as fallback
      const userByUsername = await User.findOne({ username: inviteSlug });
      if (userByUsername) {
        console.log('✅ Found user by username, but animatedInviteSlug does not match');
      }
      return res.status(404).json({ 
        success: false,
        error: 'Wedding invite not found. Please check the invitation link.' 
      });
    }

    console.log('✅ User found:', user.email, 'User ID:', user._id);

    // Create RSVP
    const rsvp = await RSVP.create({
      inviteSlug,
      userId: user._id,
      guestName,
      guestEmail,
      attending,
      numberOfGuests,
      dietaryRestrictions,
      message,
      phone,
      status: attending ? 'confirmed' : 'declined',
    });

    // Send email notification to the couple
    if (user.email) {
      try {
        const subject = attending 
          ? `🎉 New RSVP: ${guestName} is attending your wedding!`
          : `😔 ${guestName} cannot attend your wedding`;
        
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B0000;">${subject}</h2>
            <div style="background: #f5f5dc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Guest Name:</strong> ${guestName}</p>
              ${guestEmail ? `<p><strong>Email:</strong> ${guestEmail}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Attending:</strong> ${attending ? '✅ Yes' : '❌ No'}</p>
              ${attending ? `<p><strong>Number of Guests:</strong> ${numberOfGuests}</p>` : ''}
              ${dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${dietaryRestrictions}</p>` : ''}
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px;">
              View all RSVPs in your dashboard: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/rsvps">Dashboard</a>
            </p>
          </div>
        `;

        await sendEmail({
          to: user.email,
          subject,
          html: emailBody,
        });
      } catch (emailError) {
        console.error('Failed to send RSVP email to couple:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send confirmation email to guest (if email provided)
    if (guestEmail && attending) {
      try {
        const guestSubject = `✅ RSVP Confirmed - ${user.groomName || 'Groom'} & ${user.brideName || 'Bride'}'s Wedding`;
        const guestEmailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 RSVP Confirmed!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Dear ${guestName},</p>
              <p>Thank you for confirming your attendance! We're thrilled that you'll be joining us to celebrate this special day.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="margin: 5px 0;"><strong>Wedding Details:</strong></p>
                <p style="margin: 5px 0;">${user.groomName || 'Groom'} & ${user.brideName || 'Bride'}</p>
                ${user.weddingDate ? `<p style="margin: 5px 0;"><strong>Date:</strong> ${user.weddingDate}</p>` : ''}
                ${user.venue ? `<p style="margin: 5px 0;"><strong>Venue:</strong> ${user.venue}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Number of Guests:</strong> ${numberOfGuests}</p>
              </div>
              ${dietaryRestrictions ? `<p><strong>Your Dietary Requirements:</strong> ${dietaryRestrictions}</p>` : ''}
              <p>We look forward to celebrating with you!</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                ${user.groomName || 'Groom'} & ${user.brideName || 'Bride'}
              </p>
            </div>
          </div>
        `;

        await sendEmail({
          to: guestEmail,
          subject: guestSubject,
          html: guestEmailBody,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email to guest:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('✅ RSVP created successfully:', rsvp._id);

    res.json({
      success: true,
      message: attending 
        ? 'Thank you for confirming your attendance!'
        : 'We\'re sorry you can\'t make it, but thank you for letting us know!',
      rsvp,
    });
  } catch (error) {
    console.error('❌ RSVP submission error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to submit RSVP. Please try again.' 
    });
  }
});

// @route   GET /api/rsvp/:inviteSlug
// @desc    Get all RSVPs for a specific invite (public stats)
// @access  Public
router.get('/:inviteSlug', async (req, res) => {
  try {
    const { inviteSlug } = req.params;
    
    const rsvps = await RSVP.find({ inviteSlug })
      .sort({ createdAt: -1 })
      .select('guestName attending numberOfGuests createdAt')
      .limit(50); // Limit for public view

    const stats = {
      total: rsvps.length,
      attending: rsvps.filter(r => r.attending).length,
      declined: rsvps.filter(r => !r.attending).length,
      totalGuests: rsvps
        .filter(r => r.attending)
        .reduce((sum, r) => sum + (r.numberOfGuests || 1), 0),
    };

    res.json({ success: true, rsvps, stats });
  } catch (error) {
    console.error('Get RSVPs error:', error);
    res.status(500).json({ error: 'Failed to fetch RSVPs' });
  }
});

// @route   GET /api/rsvp/dashboard/all
// @desc    Get all RSVPs for logged-in user's invites
// @access  Private
router.get('/dashboard/all', auth, async (req, res) => {
  try {
    const rsvps = await RSVP.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    // Group by invite slug
    const groupedRSVPs = {};
    rsvps.forEach(rsvp => {
      if (!groupedRSVPs[rsvp.inviteSlug]) {
        groupedRSVPs[rsvp.inviteSlug] = [];
      }
      groupedRSVPs[rsvp.inviteSlug].push(rsvp);
    });

    // Calculate stats
    const stats = {
      total: rsvps.length,
      attending: rsvps.filter(r => r.attending).length,
      declined: rsvps.filter(r => !r.attending).length,
      totalGuests: rsvps
        .filter(r => r.attending)
        .reduce((sum, r) => sum + (r.numberOfGuests || 1), 0),
    };

    res.json({
      success: true,
      rsvps,
      groupedRSVPs,
      stats,
    });
  } catch (error) {
    console.error('Get dashboard RSVPs error:', error);
    res.status(500).json({ error: 'Failed to fetch RSVPs' });
  }
});

// @route   DELETE /api/rsvp/:rsvpId
// @desc    Delete an RSVP (only by the invite owner)
// @access  Private
router.delete('/:rsvpId', auth, async (req, res) => {
  try {
    const rsvp = await RSVP.findById(req.params.rsvpId);
    
    if (!rsvp) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    // Check if user owns this invite
    if (rsvp.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await RSVP.findByIdAndDelete(req.params.rsvpId);
    res.json({ success: true, message: 'RSVP deleted' });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({ error: 'Failed to delete RSVP' });
  }
});

module.exports = router;
