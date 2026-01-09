# 🚀 Deployment Checklist

Quick checklist for deploying Cardora to Render (Backend) and Vercel (Frontend).

## ✅ Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] MongoDB Atlas database is set up and accessible
- [ ] Stripe account is configured with API keys
- [ ] All local tests pass

## 🔧 Backend Deployment (Render)

- [ ] Create account at [render.com](https://render.com)
- [ ] Create new Web Service from GitHub repository
- [ ] Set service name: `cardora-backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm run start:backend`
- [ ] Add environment variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `MONGODB_URI` = (your MongoDB connection string)
  - [ ] `JWT_SECRET` = (generate strong random string)
  - [ ] `STRIPE_SECRET_KEY` = (your Stripe secret key)
  - [ ] `STRIPE_WEBHOOK_SECRET` = (set after webhook setup)
  - [ ] `FRONTEND_URL` = (set after Vercel deployment)
- [ ] Wait for deployment to complete
- [ ] Copy backend URL: `https://your-backend.onrender.com`
- [ ] Test backend is accessible

## 🎨 Frontend Deployment (Vercel)

- [ ] Create account at [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Framework: Next.js (auto-detected)
- [ ] Add environment variable:
  - [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
- [ ] Deploy
- [ ] Copy frontend URL: `https://your-app.vercel.app`
- [ ] Test frontend is accessible

## 🔄 Post-Deployment Configuration

- [ ] Update Render `FRONTEND_URL` with Vercel URL
- [ ] Wait for Render to redeploy
- [ ] Configure Stripe webhook:
  - [ ] Endpoint: `https://your-backend.onrender.com/api/payment/webhook`
  - [ ] Copy webhook secret
  - [ ] Update `STRIPE_WEBHOOK_SECRET` in Render
- [ ] Test full flow:
  - [ ] User registration
  - [ ] User login
  - [ ] Card creation
  - [ ] Payment flow (if applicable)

## 🧪 Testing

- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login
- [ ] Can create/view cards
- [ ] API calls work (check browser console)
- [ ] No CORS errors
- [ ] Payments work (if applicable)

## 📝 Notes

- Backend URL: `https://________________.onrender.com`
- Frontend URL: `https://________________.vercel.app`
- MongoDB: `mongodb+srv://...`
- Stripe Webhook: `https://________________.onrender.com/api/payment/webhook`

---

**Need help?** See `DEPLOYMENT.md` for detailed instructions.


