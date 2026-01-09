# Environment Setup Guide

## Local Development Setup

### Step 1: Create `.env.local` file in root directory

Create a file named `.env.local` in the root directory (`D:\Users\Dell\Cardora1\.env.local`) with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This will make the frontend use your local backend server instead of the production server.

### Step 2: Start Local Backend Server

Make sure your local backend is running on port 5000:

```powershell
npm run dev
```

Or just the backend:

```powershell
npm run dev:backend
```

### Step 3: Verify

- Frontend should be on: `http://localhost:3000`
- Backend should be on: `http://localhost:5000`
- Check browser console - API calls should go to `http://localhost:5000/api`

## Production Setup

If you want to use the production backend (Render.com), set:

```
NEXT_PUBLIC_API_URL=https://cardora.onrender.com
```

## Troubleshooting

### CORS Error
- Make sure backend CORS allows `http://localhost:3000`
- Backend should be running on port 5000
- Check `.env.local` file exists and has correct URL

### Connection Error
- Check if backend server is running: `npm run dev:backend`
- Check port 5000 is free: `netstat -ano | findstr :5000`
- Kill existing processes: `Get-Process node | Stop-Process -Force`


