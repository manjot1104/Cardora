# 📧 SMTP Email Configuration Guide

This guide explains how to set up email sending for password reset functionality.

## 🔧 Setup for Local Development

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter name: "Cardora App"
6. Click **Generate**
7. Copy the 16-character app password (e.g., `gdbf ogdk ytyl admf`)

### Step 2: Add to .env File

Add these lines to your `.env` file in the root directory:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

**Important:** Remove spaces from the app password (e.g., `gdbfogdkytyladmf`)

### Step 3: Restart Server

After adding SMTP config, restart your server:
```bash
# Stop server (Ctrl+C) then:
npm run dev
```

## 🚀 Setup for Production (Render)

### Step 1: Get Gmail App Password

Follow the same steps as local development to get your Gmail app password.

### Step 2: Add Environment Variables on Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these environment variables:

| Key | Value | Example |
|-----|-------|---------|
| `SMTP_HOST` | `smtp.gmail.com` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` | `587` |
| `SMTP_SECURE` | `false` | `false` |
| `SMTP_USER` | Your Gmail address | `manjot1104@gmail.com` |
| `SMTP_PASS` | Your app password (no spaces) | `gdbfogdkytyladmf` |

### Step 3: Redeploy

After adding environment variables, Render will automatically redeploy your service.

## ✅ Testing Email Configuration

### Local Test

Run the test script:
```bash
node test-email-config.js
```

This will verify:
- Environment variables are set
- SMTP connection works
- Credentials are correct

### Production Test

1. Go to your app's forgot password page
2. Enter your email
3. Check:
   - Server logs on Render for email sending status
   - Your email inbox (may take a few minutes)
   - Spam folder

## 🐛 Troubleshooting

### Error: "Failed to send reset email"

**Possible causes:**
1. SMTP credentials not set on Render
2. Server not restarted after adding config
3. Wrong app password
4. 2-Step Verification not enabled

**Solutions:**
1. Check Render environment variables
2. Verify app password is correct (16 characters, no spaces)
3. Ensure 2-Step Verification is enabled
4. Check Render logs for detailed error messages

### Emails are delayed

Gmail may delay emails due to:
- Spam filtering
- Rate limiting
- New sender reputation

**Solution:** The reset link is always shown on the page if email fails or is delayed. Users can use the link directly.

### Authentication Failed (EAUTH)

**Cause:** Wrong app password or 2-Step Verification not enabled

**Solution:**
1. Generate a new app password
2. Make sure 2-Step Verification is enabled
3. Update `SMTP_PASS` in Render

### Connection Failed (ECONNECTION)

**Cause:** Network/firewall blocking port 587

**Solution:**
1. Check firewall settings
2. Verify port 587 is not blocked
3. Try using port 465 with `SMTP_SECURE=true`

## 📝 Notes

- **App passwords are 16 characters** (remove spaces when adding to .env)
- **Never commit .env file** to Git (it's in .gitignore)
- **Production uses Render environment variables** (not .env file)
- **Reset link is always available** even if email fails (shown on page)

## 🔒 Security Best Practices

1. Use app passwords, not your main Gmail password
2. Don't share app passwords
3. Regenerate app passwords if compromised
4. Use different app passwords for dev and production
