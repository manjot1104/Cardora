const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  // For Gmail, you can use app password
  // For other services, adjust accordingly
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // If no email config, log the reset link (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Password Reset Email (Email not configured):');
      console.log(`To: ${email}`);
      console.log(`Reset Link: ${resetUrl}`);
      console.log(`Token: ${resetToken}`);
      return { success: false, emailConfigured: false, message: 'Email logged (SMTP not configured)' };
    }

    console.log('📧 Attempting to send password reset email...');
    console.log('📧 SMTP Config:', {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'
    });

    const transporter = createTransporter();
    
    // Verify connection before sending
    console.log('📧 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      throw verifyError; // Re-throw to be caught by outer catch
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const mailOptions = {
      from: `"Cardora" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Cardora',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Cardora</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Cardora</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your Cardora account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Cardora
        
        Hello,
        
        We received a request to reset your password for your Cardora account.
        
        Click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
        
        This is an automated message. Please do not reply to this email.
      `,
    };

    console.log('📧 Sending email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Log the reset link even if email fails (for development)
    console.log('📧 Password Reset Link (Email failed):');
    console.log(`Reset Link: ${resetUrl}`);
    
    // Provide more helpful error messages
    let errorMessage = error.message;
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your Gmail app password.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Please check your internet connection and SMTP settings.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timed out. Please check your SMTP settings.';
    }
    
    return { success: false, error: errorMessage, errorCode: error.code };
  }
};

module.exports = {
  sendPasswordResetEmail,
};
