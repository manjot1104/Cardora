const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['profile_view', 'payment_view', 'payment_success', 'qr_scan', 'nfc_tap', 'cart_payment_view', 'cart_payment_success'],
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet', 'unknown'],
    default: 'unknown',
  },
  userAgent: String,
  ipAddress: String,
  referer: String,
}, {
  timestamps: true,
});

// Index for faster queries
analyticsSchema.index({ userId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);

