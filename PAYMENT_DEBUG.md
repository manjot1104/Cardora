# Payment Session Debugging Guide

## Error: "Failed to create payment session"

### Step 1: Check Server Console
When you try to make a payment, check your **server console** (where `npm run dev:backend` is running). You should see:

```
✅ Stripe Test Mode: Test keys detected
📦 Creating cart session with: { itemsCount: 1, total: 29.99, ... }
✅ Line items created: 1
✅ Stripe session created: cs_test_...
```

If you see errors, note them down.

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab. Look for:
- `💳 Creating payment session:` - Shows what data is being sent
- Any red error messages

### Step 3: Common Issues & Solutions

#### Issue 1: "Stripe is not configured"
**Error:** `Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.`

**Solution:**
1. Make sure `.env` file exists in root directory
2. Add: `STRIPE_SECRET_KEY=sk_test_...`
3. **Restart server** after adding keys
4. Check server console shows: `✅ Stripe Test Mode: Test keys detected`

#### Issue 2: "Invalid price" or "Invalid quantity"
**Error:** `Invalid price for item: ...` or `Invalid quantity for item: ...`

**Solution:**
1. Clear cart: Go to browser console → `localStorage.removeItem('cardora_cart')`
2. Add items to cart again
3. Make sure quantity > 0 and price > 0

#### Issue 3: Network Error / Connection Refused
**Error:** `Cannot connect to server` or `ECONNREFUSED`

**Solution:**
1. Check if backend server is running: `npm run dev:backend`
2. Check server is on port 5000
3. Check API URL in browser console: Should show `http://localhost:5000/api`

#### Issue 4: Stripe API Error
**Error:** `StripeInvalidRequestError` or similar

**Solution:**
1. Check Stripe key is valid test key (starts with `sk_test_`)
2. Check currency is valid (INR, USD, CAD, etc.)
3. Check unit_amount > 0 (minimum is 1 cent = 0.01)

### Step 4: Test Payment Flow

1. **Add item to cart:**
   - Go to `/dashboard/card`
   - Select Business Card
   - Click "Create Now"
   - Select template
   - Click "Add to Cart"

2. **Check cart:**
   - Open browser console
   - Type: `JSON.parse(localStorage.getItem('cardora_cart'))`
   - Verify items have: `price`, `quantity`, `name`

3. **Try payment:**
   - Go to `/dashboard/checkout`
   - Click "Pay" button
   - Check both browser console and server console for errors

### Step 5: Manual Testing

Test the API directly:

```bash
# In terminal, test the endpoint
curl -X POST http://localhost:5000/api/payment/create-cart-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{
      "name": "Test Cards",
      "quantity": 100,
      "price": 29.99,
      "size": "standard",
      "orientation": "horizontal"
    }],
    "total": 29.99,
    "currency": "INR",
    "country": "IN"
  }'
```

### Step 6: Check Environment Variables

Make sure `.env` file has:
```env
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/cardora
JWT_SECRET=your_secret
```

### Step 7: Verify Stripe Key Format

Test key should look like:
```
sk_test_YOUR_STRIPE_SECRET_KEY_HERE
```

- Starts with `sk_test_`
- About 100+ characters long
- No spaces or line breaks

### Quick Fix Checklist

- [ ] Server is running (`npm run dev:backend`)
- [ ] `.env` file exists with `STRIPE_SECRET_KEY`
- [ ] Server console shows: `✅ Stripe Test Mode: Test keys detected`
- [ ] Cart has valid items (check browser console)
- [ ] No network errors in browser console
- [ ] Currency is valid (INR, USD, CAD)
- [ ] All prices and quantities are > 0

### Still Not Working?

1. **Check server logs** - Look for detailed error messages
2. **Check browser console** - Look for network errors
3. **Verify Stripe Dashboard** - Go to https://dashboard.stripe.com/test/logs
4. **Test with simple data** - Try with just 1 item, quantity 1, price 1.00

### Debug Commands

```javascript
// In browser console:
// Check cart
JSON.parse(localStorage.getItem('cardora_cart'))

// Clear cart
localStorage.removeItem('cardora_cart')

// Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL)
```
