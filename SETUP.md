# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- MongoDB URI (local or Atlas)
- JWT Secret (any random string)
- Stripe keys (get from Stripe Dashboard)

### Step 3: Start MongoDB
**Local:**
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod
```

**OR use MongoDB Atlas (cloud)** - just paste your connection string in `.env`

### Step 4: Run the App
```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

### Step 5: Create Your First Card
1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Fill in your profile
4. Enable payments (optional)
5. Get your QR code from Dashboard > Card Settings

## 📱 NFC Setup (Optional)

1. Buy NFC tags (NTAG215 recommended)
2. Use NFC writing app (Android: "NFC Tools")
3. Write your card URL: `http://localhost:3000/u/your-username`
4. Tap with phone to test!

**Tip:** In production, use your domain instead of localhost.

## 💳 Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get test keys from Dashboard > Developers > API Keys
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```

For webhooks (payment verification):
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the `whsec_...` secret to `.env` as `STRIPE_WEBHOOK_SECRET`.

## ✅ That's It!

Your Cardora MVP is ready! 🎉

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

For detailed documentation, see [README.md](README.md).

