# Stripe Payment Testing Guide

## Test Keys Configuration

Make sure your `.env` file (in the root directory) contains the following Stripe test keys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
FRONTEND_URL=http://localhost:3000
```

## Getting Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy your **Publishable key** and **Secret key**
4. Add them to your `.env` file

## Testing Payment Flow

### 1. Test Card Numbers

Use these Stripe test card numbers for testing:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### 2. Testing Business Card Cart Flow

1. **Add Items to Cart:**
   - Go to `/dashboard/card`
   - Select Business Card type
   - Choose quantity, size, orientation
   - Click "Create Now"
   - Select a template
   - Click "Add to Cart"

2. **Checkout:**
   - Click "View Cart" button
   - Review order summary
   - Select payment method (Stripe)
   - Click "Pay" button

3. **Payment:**
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Complete the payment

4. **Success:**
   - You'll be redirected to `/success` page
   - Cart will be automatically cleared
   - Payment record will be saved in database

### 3. Testing Direct Payment (from Card Page)

1. Go to `/pay/[username]` (if user has payment enabled)
2. Enter amount
3. Click "Pay with Stripe"
4. Use test card to complete payment

## Verifying Payments

### Check Stripe Dashboard
- Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/test/payments)
- You should see all test payments listed

### Check Database
- Payments are saved in the `payments` collection
- Status: `pending` → `completed` after successful payment

### Check Application
- Go to `/dashboard/payments` to see payment history
- Check analytics for payment tracking

## Common Issues

### Payment Session Not Created
- **Issue:** `STRIPE_SECRET_KEY` not found
- **Solution:** Make sure `.env` file exists and contains `STRIPE_SECRET_KEY`
- **Check:** Restart server after adding env variables

### Payment Verification Fails
- **Issue:** Webhook secret not configured
- **Solution:** Add `STRIPE_WEBHOOK_SECRET` to `.env` (optional for testing)
- **Note:** Webhooks are mainly for production, not required for basic testing

### Currency Mismatch
- **Issue:** Payment fails due to currency
- **Solution:** Make sure currency matches your country setting
- **Default:** INR for India, CAD for Canada, USD for others

## Environment Variables Required

```env
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (optional for testing)

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/cardora

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## Production vs Test Mode

- **Test Mode:** Use `sk_test_...` keys (current setup)
- **Production Mode:** Use `sk_live_...` keys
- **Important:** Never commit `.env` file with live keys to Git!

## Testing Checklist

- [ ] Stripe test keys added to `.env`
- [ ] Server restarted after adding keys
- [ ] Test card payment successful
- [ ] Cart checkout flow works
- [ ] Payment records saved in database
- [ ] Success page shows after payment
- [ ] Cart clears after successful payment

## Need Help?

- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com/test)
- [Stripe API Docs](https://stripe.com/docs/api)
