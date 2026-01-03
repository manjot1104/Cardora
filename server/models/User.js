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

