# Cardora - Digital Business Card & Payment Platform

**One Tap. Endless Connections.**

Cardora is a premium digital business card platform with integrated payment capabilities. Share your professional information instantly via QR codes or NFC, and accept payments seamlessly.

## ✨ Features

- 📇 **Digital Business Cards** - Professional profiles with rich contact information
- 💳 **Smart Payments** - Stripe integration for instant transactions
- 📱 **NFC Enabled** - Tap-to-share functionality
- 🎮 **Gamified Experience** - Animations, badges, and milestones
- 📊 **Analytics Dashboard** - Track views, payments, and performance
- 🌓 **Dark/Light Mode** - Premium UI with glassmorphism design
- ⚡ **Real-time Updates** - Change your card anytime without reprogramming NFC

## 🚀 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Recharts (analytics)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Stripe API

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Stripe account (for payments)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Cardora1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:

```env
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb://localhost:27017/cardora
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cardora

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- The connection string should be: `mongodb://localhost:27017/cardora`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and database
- Get your connection string and update `MONGODB_URI` in `.env`

### 5. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from [Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys)
3. Add your test keys to `.env`:
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_test_`)
   - `STRIPE_WEBHOOK_SECRET`: For webhooks (see below)

**For Webhooks (Payment Verification):**

During development, use Stripe CLI:

```bash
# Install Stripe CLI
# Windows: Download from https://github.com/stripe/stripe-cli/releases
# Mac: brew install stripe/stripe-cli/stripe
# Linux: See Stripe docs

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payment/webhook
```

This will give you a webhook secret starting with `whsec_`. Add it to your `.env` file.

**For Production:**
- Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/payment/webhook`
- Use the webhook secret from Stripe Dashboard

### 6. Run the Application

**Development Mode (runs both frontend and backend):**

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

**Or run separately:**

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### 7. Build for Production

```bash
# Build frontend
npm run build

# Start production server
npm start
npm run start:backend
```

## 📱 Usage Guide

### Creating Your First Card

1. **Sign Up**: Visit `http://localhost:3000/signup` and create an account
2. **Complete Profile**: Go to Dashboard > Profile and fill in your information
3. **Enable Payments** (Optional): Go to Dashboard > Card Settings
   - Toggle "Payment Enabled"
   - Choose payment type (Fixed or Custom amount)
   - Add Interac email if needed
4. **Get Your Card URL**: Your card will be live at `/u/your-username`
5. **Share Your QR Code**: Download or share the QR code from Dashboard > Card Settings

### NFC Card Setup

1. **Get an NFC Chip/Tag**: Purchase NFC tags (NTAG213, NTAG215, or NTAG216 recommended)
2. **Program the NFC Tag**: Use an NFC writing app (Android: NFC Tools, iOS: NFC TagWriter)
3. **Write Your Card URL**: Store the URL `https://yourdomain.com/u/your-username` on the NFC chip
4. **Test**: Tap the chip with your phone - it should open your card!

**Important**: The NFC chip only stores the URL. All profile and payment data is stored in the database and can be updated anytime without reprogramming the NFC chip!

### Payment Flow

1. **Enable Payments**: Toggle "Payment Enabled" in Card Settings
2. **Choose Payment Type**:
   - **Fixed Amount**: Set a specific amount (e.g., $50 consultation fee)
   - **Custom Amount**: Let customers choose how much to pay
3. **Payment Methods**:
   - **Stripe**: Card payments, UPI, wallets (automatic checkout)
   - **Interac/E-Transfer**: Display email for manual transfers
4. **Receive Payments**: View payment history in Dashboard > Payments

### Analytics

Track your card performance:
- Profile views
- Payment page visits
- Successful payments
- Device statistics
- Revenue metrics

View analytics at Dashboard > Analytics

## 🏗️ Project Structure

```
Cardora1/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard pages
│   ├── u/[username]/        # Public card view
│   ├── pay/[username]/      # Payment page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── ...
├── components/              # React components
├── lib/                     # Utility functions
│   ├── api.js              # API client
│   └── auth.js             # Auth utilities
├── server/                  # Backend Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── index.js            # Server entry point
├── .env                    # Environment variables (create from .env.example)
└── package.json            # Dependencies
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Card
- `GET /api/card/:username` - Get public card data

### Payments
- `POST /api/payment/create-stripe-session` - Create Stripe checkout session
- `POST /api/payment/verify` - Verify payment completion
- `GET /api/payment/history` - Get payment history (protected)
- `POST /api/payment/webhook` - Stripe webhook handler

### Analytics
- `POST /api/analytics/track` - Track an event
- `GET /api/analytics/summary` - Get analytics summary (protected)

## 🎨 Customization

### Themes
Currently supports a default theme. You can extend the theme system by:
1. Adding theme options in the Card Settings
2. Creating CSS classes for different themes
3. Storing theme preference in user profile

### Payment Purposes
Edit the payment purpose options in `app/pay/[username]/page.js`:
```javascript
<option value="custom-purpose">Custom Purpose</option>
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network access in MongoDB Atlas if using cloud

### Stripe Payment Not Working
- Verify Stripe keys are correct in `.env`
- Check Stripe webhook is configured (for production)
- Use test cards from [Stripe docs](https://stripe.com/docs/testing)

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change port in `package.json` scripts for frontend

## 🔒 Security Notes

- **Change JWT_SECRET** in production to a strong random string
- Use environment variables for all secrets
- Enable HTTPS in production
- Validate and sanitize all user inputs
- Use Stripe's webhook signature verification in production

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for seamless digital connections**

