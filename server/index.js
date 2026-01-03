const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Stripe webhook endpoint needs raw body, so mount it before json middleware
const paymentRoutes = require('./routes/payment');
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes.webhook);

// JSON middleware for other routes
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/card', require('./routes/card'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/payment', paymentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cardora')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
