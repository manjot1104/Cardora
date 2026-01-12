# Deployment Guide: Cardora

This guide will help you deploy your Cardora project with:
- **Backend** on Render.com
- **Frontend** on Vercel

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **MongoDB Atlas** - Your MongoDB connection string (already have this)
5. **Stripe Account** - Your Stripe API keys (already have this)

---

## 🚀 Part 1: Deploy Backend on Render

### Step 1: Push Code to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `Cardora1` (or your repo name)
5. Configure the service:
   - **Name**: `cardora-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:backend`

### Step 3: Set Environment Variables on Render

In the Render dashboard, go to **Environment** section and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key` | Use a strong random string |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Your Stripe webhook secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Set this AFTER deploying frontend** |
| `PORT` | (Auto-set by Render) | Render automatically sets this |

**Important Notes:**
- For `JWT_SECRET`, generate a strong random string (you can use: `openssl rand -base64 32`)
- For `FRONTEND_URL`, you'll update this after deploying to Vercel
- Render automatically provides the `PORT` environment variable

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://cardora-backend.onrender.com`

### Step 5: Test Backend

Test your backend API:
```bash
curl https://your-backend-url.onrender.com/api/auth/test
```

**Save your backend URL** - you'll need it for the frontend deployment!

---

## 🎨 Part 2: Deploy Frontend on Vercel

### Step 1: Install Vercel CLI (Optional)

You can deploy via:
- **Web Dashboard** (Recommended for first time)
- **Vercel CLI**

For CLI:
```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Set Environment Variables on Vercel

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` |

**Important:** 
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- The `NEXT_PUBLIC_` prefix makes this available to the browser

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Once deployed, you'll get a URL like: `https://cardora.vercel.app`

### Step 5: Update Backend CORS

Now go back to Render and update the `FRONTEND_URL` environment variable:

1. Go to your Render service → **Environment**
2. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
3. Render will automatically redeploy with the new CORS settings

---

## 🔧 Part 3: Configure Stripe Webhooks

### Step 1: Get Your Render Backend URL

Your backend URL will be: `https://your-backend-name.onrender.com`

### Step 2: Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://your-backend-url.onrender.com/api/payment/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - Any other payment events you need
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)
6. Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

---

## ✅ Part 4: Verify Deployment

### Test Backend
```bash
# Test health endpoint (if you have one)
curl https://your-backend.onrender.com/api/auth/test

# Or test from browser
https://your-backend.onrender.com/api/auth/test
```

### Test Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try logging in
3. Check browser console for any errors
4. Verify API calls are going to your Render backend

### Common Issues

**CORS Errors:**
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that CORS allows `.vercel.app` domains

**API Connection Errors:**
- Verify `NEXT_PUBLIC_API_URL` in Vercel matches your Render backend URL
- Check that backend is running (Render dashboard shows "Live")

**MongoDB Connection:**
- Verify `MONGODB_URI` is correct in Render
- Check MongoDB Atlas allows connections from Render IPs (usually 0.0.0.0/0)

---

## 🔄 Part 5: Continuous Deployment

Both Render and Vercel automatically deploy when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Render and Vercel will automatically rebuild and deploy

---

## 📝 Environment Variables Summary

### Render (Backend)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-app.vercel.app
PORT=(auto-set by Render)
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🎯 Quick Reference URLs

After deployment, you'll have:
- **Backend API**: `https://your-backend.onrender.com`
- **Frontend App**: `https://your-app.vercel.app`
- **API Endpoints**: `https://your-backend.onrender.com/api/*`

---

## 🆘 Troubleshooting

### Backend won't start on Render
- Check build logs in Render dashboard
- Verify `startCommand` is `npm run start:backend`
- Check that `package.json` has the `start:backend` script

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend is running (Render dashboard)
- Test backend URL directly in browser

### CORS errors
- Update `FRONTEND_URL` in Render to match Vercel URL
- Redeploy backend after updating environment variables

### MongoDB connection issues
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check MongoDB connection string is correct
- Ensure database name is included in connection string

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

**Need Help?** Check the logs in both Render and Vercel dashboards for detailed error messages.



