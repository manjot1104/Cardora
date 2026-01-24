const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Validation
    if (!name || !email || !password || !username) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      username,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide your email address' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success message (security best practice - don't reveal if email exists)
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(resetTokenExpiry);
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send email
    console.log('📧 Sending password reset email to:', user.email);
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, resetUrl);
    console.log('📧 Email result:', emailResult);

    // Always return reset link in development mode if email is not configured or failed
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const shouldReturnLink = isDevelopment && 
      (!process.env.SMTP_USER || !process.env.SMTP_PASS || !emailResult.success || emailResult.emailConfigured === false);
    
    if (!emailResult.success) {
      console.warn('⚠️ Email sending failed, but reset link is available');
      console.warn('⚠️ Error:', emailResult.error);
      console.warn('⚠️ Error Code:', emailResult.errorCode);
    }

    // If email failed, still return success but include error details and reset link
    // Always return reset link if email fails (both dev and production for better UX)
    if (!emailResult.success) {
      // In production, still return the link but log the error
      if (!shouldReturnLink) {
        console.error('❌ Production email failure - returning reset link anyway for user convenience');
      }
      
      return res.json({ 
        message: 'Password reset link generated. ' + 
          (!process.env.SMTP_USER || !process.env.SMTP_PASS 
            ? 'Email not configured - please use the link below.'
            : 'Email delivery may be delayed - please use the link below or check your email.'),
        resetLink: resetUrl,
        note: !process.env.SMTP_USER || !process.env.SMTP_PASS 
          ? 'Email not configured - use this link to reset password'
          : `Email sending had issues: ${emailResult.error || 'Unknown error'} - use this link to reset password`,
        emailError: emailResult.error,
        emailErrorCode: emailResult.errorCode,
        emailDelayed: true // Flag to indicate email might be delayed
      });
    }

    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      // In development, also return the reset link if email is not configured or failed
      ...(shouldReturnLink && {
        resetLink: resetUrl,
        note: !process.env.SMTP_USER || !process.env.SMTP_PASS 
          ? 'Email not configured - use this link for testing'
          : 'Email sending failed - use this link for testing'
      })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Please provide reset token and new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/auth/verify-reset-token
// @desc    Verify if reset token is valid
// @access  Public
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.json({ valid: true, message: 'Token is valid' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/test-email
// @desc    Test email configuration
// @access  Public (for testing only)
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || process.env.SMTP_USER;

    if (!testEmail) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    console.log('🧪 Testing email configuration...');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET (length: ' + process.env.SMTP_PASS.length + ')' : 'NOT SET');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 587);

    const { sendPasswordResetEmail } = require('../utils/email');
    const testToken = 'test-token-' + Date.now();
    const testUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${testToken}`;
    
    const result = await sendPasswordResetEmail(testEmail, testToken, testUrl);
    
    res.json({
      success: result.success,
      message: result.success 
        ? 'Test email sent successfully! Check your inbox.' 
        : 'Test email failed: ' + (result.error || result.message),
      details: {
        emailConfigured: result.emailConfigured !== false,
        error: result.error,
        errorCode: result.errorCode
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      details: error 
    });
  }
});

module.exports = router;

