const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9_]+$/,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  profession: String,
  company: String,
  phone: String,
  whatsapp: String,
  address: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String,
    website: String,
    github: String,
  },
  profileEnabled: {
    type: Boolean,
    default: true,
  },
  paymentEnabled: {
    type: Boolean,
    default: false,
  },
  paymentType: {
    type: String,
    enum: ['fixed', 'custom'],
    default: 'custom',
  },
  fixedAmount: Number,
  stripePaymentLink: String,
  interacEmail: String,
  theme: {
    type: String,
    default: 'default',
  },
  // Wedding-specific fields (optional)
  weddingDate: String,
  venue: String,
  brideName: String,
  groomName: String,
  brideFatherName: String,
  brideMotherName: String,
  groomFatherName: String,
  groomMotherName: String,
  deceasedElders: String,
  // Card type and collection
  cardType: {
    type: String,
    enum: ['business', 'wedding', 'engagement', 'anniversary'],
    default: 'business',
  },
  collection: {
    type: String,
    enum: ['standard', 'signature'],
    default: 'standard',
  },
  // Country/Region support
  country: {
    type: String,
    enum: ['IN', 'CA'],
    default: 'IN',
  },
  currency: {
    type: String,
    default: 'INR',
  },
  // Image fields for cards
  profileImage: String, // URL to profile/logo image
  cardBackgroundImage: String, // URL to card background image
  cardImages: [{
    type: String, // Array of image URLs for cards
  }],
  // Password reset fields
  resetToken: String,
  resetTokenExpiry: Date,
  // Animated wedding invite fields
  animatedInviteSlug: String, // Unique slug for animated invite (e.g., "pedro-julia")
  animatedTemplateId: String, // Template ID for animated invite
  weddingStory: String, // Custom story text
  couplePhoto: String, // URL to couple photo
  weddingMusic: String, // URL to background music file
  weddingTime: String, // Wedding time (e.g., "6:00 PM")
  // Payment status for unlocking features
  cardPaid: {
    type: Boolean,
    default: false,
  },
  invitePaid: {
    type: Boolean,
    default: false,
  },
  // Gallery - downloaded cards/invites
  gallery: [{
    type: {
      type: String,
      enum: ['card', 'invite'],
    },
    templateId: String,
    slug: String,
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
    data: mongoose.Schema.Types.Mixed, // Store card/invite data snapshot
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

