// Quick test script to verify email configuration
require('dotenv').config();

console.log('🧪 Testing Email Configuration...\n');

console.log('Environment Variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET (default: smtp.gmail.com)');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET (default: 587)');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'NOT SET (default: false)');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET (length: ' + process.env.SMTP_PASS.length + ')' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET (default: development)');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET (default: http://localhost:3000)');

console.log('\n📧 Testing SMTP Connection...');

const nodemailer = require('nodemailer');

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ SMTP_USER or SMTP_PASS not set in .env file!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Connection Failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\n💡 Common Issues:');
    console.error('1. Check if Gmail app password is correct');
    console.error('2. Make sure 2-Step Verification is enabled');
    console.error('3. Verify the app password was generated for "Mail"');
    console.error('4. Check if your firewall is blocking port 587');
    process.exit(1);
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('✅ Email configuration is working correctly.');
    console.log('\n📧 You can now send password reset emails.');
    process.exit(0);
  }
});
