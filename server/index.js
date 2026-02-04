const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://cardora.onrender.com',
      'https://cardora.vercel.app',
      'https://cardoradigital.ca',
      'https://www.cardoradigital.ca',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    // Check if origin matches allowed list
    const isAllowedOrigin = allowedOrigins.indexOf(origin) !== -1;
    
    // Allow Vercel deployments (all *.vercel.app domains)
    const isVercelDomain = origin && (
      origin.includes('.vercel.app') || 
      origin.includes('vercel.app')
    );
    
    // In development, allow all origins
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Log for debugging
    console.log('🌐 CORS Check:', {
      origin,
      isAllowedOrigin,
      isVercelDomain,
      isDevelopment,
      allowedOrigins,
    });
    
    if (isAllowedOrigin || isVercelDomain || isDevelopment) {
      console.log('✅ CORS: Allowing origin:', origin);
      callback(null, true);
    } else {
      console.error('❌ CORS: Blocked origin:', origin);
      console.error('📋 Allowed origins:', allowedOrigins);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

app.use(cors(corsOptions));

// Stripe webhook endpoint needs raw body, so mount it before json middleware
const paymentRoutes = require('./routes/payment');
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes.webhook);

// JSON middleware for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/card', require('./routes/card'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', require('./routes/upload'));
app.use('/api/wedding', require('./routes/wedding'));
app.use('/api/unlock', require('./routes/unlock'));
app.use('/api/download', require('./routes/download'));
app.use('/api/rsvp', require('./routes/rsvp'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cardora')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('Please kill the process using this port or use a different port.');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

module.exports = app;
