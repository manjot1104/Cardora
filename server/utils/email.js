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

// Generic email sending function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If no email config, log the email (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email (Email not configured):');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      return { success: false, emailConfigured: false, message: 'Email logged (SMTP not configured)' };
    }

    const transporter = createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      throw verifyError;
    }
    
    const mailOptions = {
      from: `"Cardora" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send payment success email
const sendPaymentSuccessEmail = async (user, payment, paymentDetails = {}) => {
  try {
    const email = payment.payerEmail || user.email;
    console.log('📧 [sendPaymentSuccessEmail] Starting email send process...');
    console.log('📧 [sendPaymentSuccessEmail] Email address:', email);
    console.log('📧 [sendPaymentSuccessEmail] Payment ID:', payment._id);
    console.log('📧 [sendPaymentSuccessEmail] Payment amount:', payment.amount, payment.currency);
    
    // If no email config, log the email (for development)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️ [sendPaymentSuccessEmail] SMTP not configured!');
      console.log('📧 Payment Success Email (Email not configured):');
      console.log(`To: ${email}`);
      console.log(`Payment Amount: ${payment.amount} ${payment.currency}`);
      console.log(`Payment Purpose: ${payment.purpose}`);
      console.log('💡 To enable emails, add SMTP_USER and SMTP_PASS to .env file');
      return { success: false, emailConfigured: false, message: 'Email logged (SMTP not configured)' };
    }

    console.log('✅ [sendPaymentSuccessEmail] SMTP configured, proceeding...');
    console.log('📧 [sendPaymentSuccessEmail] SMTP_USER:', process.env.SMTP_USER);
    console.log('📧 Attempting to send payment success email...');
    const transporter = createTransporter();
    
    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      throw verifyError;
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userName = user.name || 'Valued Customer';
    const paymentDate = new Date(payment.createdAt || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build items list HTML
    let itemsHtml = '';
    if (paymentDetails.items && paymentDetails.items.length > 0) {
      itemsHtml = paymentDetails.items.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Item'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${payment.currency === 'INR' ? '₹' : '$'}${(item.price || 0).toFixed(2)}</td>
        </tr>
      `).join('');
    } else {
      itemsHtml = `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;" colspan="3">${payment.purpose || 'Payment'}</td>
        </tr>
      `;
    }

    // Build invite links HTML if any
    let inviteLinksHtml = '';
    if (paymentDetails.createdInvites && paymentDetails.createdInvites.length > 0) {
      inviteLinksHtml = `
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin-top: 0;">🎉 Your Invitation Links</h3>
          ${paymentDetails.createdInvites.map(invite => `
            <p style="margin: 10px 0;">
              <strong>Invitation Link:</strong><br>
              <a href="${invite.url}" style="color: #1976d2; word-break: break-all;">${invite.url}</a>
            </p>
          `).join('')}
          <p style="color: #666; font-size: 14px; margin-top: 15px;">
            Share these links with your guests to view your beautiful wedding invitation!
          </p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"Cardora Digital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Payment Successful - Cardora Digital',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Successful - Cardora</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Cardora</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; background: #4caf50; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 48px; color: white;">✓</span>
              </div>
              <h2 style="color: #333; margin: 0;">Payment Successful!</h2>
            </div>
            
            <p>Hello ${userName},</p>
            <p style="font-size: 18px; color: #4caf50; font-weight: bold; margin: 20px 0;">
              ✅ You have completed payment successfully!
            </p>
            <p>Thank you for your payment! Your transaction has been processed successfully.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
              <h3 style="color: #333; margin-top: 0;">Payment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${payment.stripeSessionId || payment._id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${paymentDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; text-align: right; font-size: 20px; font-weight: bold; color: #4caf50;">
                    ${payment.currency === 'INR' ? '₹' : payment.currency === 'CAD' ? 'C$' : '$'}${payment.amount.toFixed(2)} ${payment.currency}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                  <td style="padding: 8px 0; text-align: right; color: #4caf50; font-weight: bold;">Completed</td>
                </tr>
              </table>
            </div>

            ${paymentDetails.items && paymentDetails.items.length > 0 ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
                <h3 style="color: #333; margin-top: 0;">Items Purchased</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f5f5f5;">
                      <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                      <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
                      <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${inviteLinksHtml}

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">What's Next?</h3>
              <p style="margin: 10px 0;">
                • Access your dashboard to manage your cards and invitations<br>
                • Share your invitation links with your guests<br>
                • Customize your designs anytime
              </p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${frontendUrl}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
              </div>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you have any questions, please contact our support team.<br>
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Payment Successful - Cardora Digital
        
        Hello ${userName},
        
        ✅ You have completed payment successfully!
        
        Thank you for your payment! Your transaction has been processed successfully.
        
        Payment Details:
        Transaction ID: ${payment.stripeSessionId || payment._id}
        Date: ${paymentDate}
        Amount: ${payment.currency === 'INR' ? '₹' : payment.currency === 'CAD' ? 'C$' : '$'}${payment.amount.toFixed(2)} ${payment.currency}
        Status: Completed
        
        ${paymentDetails.items && paymentDetails.items.length > 0 ? `
        Items Purchased:
        ${paymentDetails.items.map(item => `- ${item.name || 'Item'} (Qty: ${item.quantity || 1}) - ${payment.currency === 'INR' ? '₹' : '$'}${(item.price || 0).toFixed(2)}`).join('\n')}
        ` : ''}
        
        ${paymentDetails.createdInvites && paymentDetails.createdInvites.length > 0 ? `
        Your Invitation Links:
        ${paymentDetails.createdInvites.map(invite => `- ${invite.url}`).join('\n')}
        ` : ''}
        
        What's Next?
        • Access your dashboard to manage your cards and invitations
        • Share your invitation links with your guests
        • Customize your designs anytime
        
        Dashboard: ${frontendUrl}/dashboard
        
        If you have any questions, please contact our support team.
        This is an automated message. Please do not reply to this email.
      `,
    };

    console.log('📧 [sendPaymentSuccessEmail] Sending email to:', email);
    console.log('📧 [sendPaymentSuccessEmail] Email subject: Payment Successful - Cardora');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [sendPaymentSuccessEmail] Payment success email sent successfully!');
    console.log('📧 [sendPaymentSuccessEmail] Message ID:', info.messageId);
    console.log('📧 [sendPaymentSuccessEmail] Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [sendPaymentSuccessEmail] Error sending payment success email:');
    console.error('❌ [sendPaymentSuccessEmail] Error code:', error.code);
    console.error('❌ [sendPaymentSuccessEmail] Error message:', error.message);
    console.error('❌ [sendPaymentSuccessEmail] Full error:', error);
    
    // Log payment details even if email fails (for development)
    console.log('📧 [sendPaymentSuccessEmail] Payment Success Email (Email failed):');
    console.log(`📧 [sendPaymentSuccessEmail] To: ${payment.payerEmail || user.email}`);
    console.log(`📧 [sendPaymentSuccessEmail] Payment Amount: ${payment.amount} ${payment.currency}`);
    console.log(`📧 [sendPaymentSuccessEmail] Payment Purpose: ${payment.purpose}`);
    
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
  sendEmail,
  sendPaymentSuccessEmail,
};
