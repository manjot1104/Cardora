const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  // Link to the wedding invite (by slug)
  inviteSlug: {
    type: String,
    required: true,
    index: true,
  },
  // Link to the user who created the invite
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Guest information
  guestName: {
    type: String,
    required: true,
    trim: true,
  },
  guestEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  // RSVP details
  attending: {
    type: Boolean,
    default: true,
  },
  numberOfGuests: {
    type: Number,
    default: 1,
    min: 1,
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  // Additional info
  phone: {
    type: String,
    trim: true,
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'confirmed',
  },
}, {
  timestamps: true,
});

// Index for faster queries
rsvpSchema.index({ userId: 1, inviteSlug: 1, createdAt: -1 });
rsvpSchema.index({ inviteSlug: 1, createdAt: -1 });

module.exports = mongoose.model('RSVP', rsvpSchema);
