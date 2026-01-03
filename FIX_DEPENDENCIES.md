# Fix Dependency Issues

## Problem
Getting `Cannot find module 'yargs-parser'` error when running `npm run dev`.

## Solution Steps

### Step 1: Clean Install (Recommended)

Run these commands in PowerShell from the project root:

```powershell
# 1. Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall all dependencies
npm install
```

### Step 2: If Step 1 Doesn't Work

Try installing the missing package directly:

```powershell
npm install yargs-parser --save-dev
npm install
```

### Step 3: Alternative - Run Servers Separately

If `concurrently` continues to cause issues, you can run the frontend and backend separately in two terminal windows:

**Terminal 1 (Backend):**
```powershell
npm run dev:backend
```

**Terminal 2 (Frontend):**
```powershell
npm run dev:frontend
```

### Step 4: Update Node.js (If Needed)

If the issue persists, ensure you're using Node.js 18+:
```powershell
node --version
```

If you need to update Node.js, download from [nodejs.org](https://nodejs.org/)

## After Fixing

Once dependencies are installed correctly, run:
```powershell
npm run dev
```

This should start both the backend (port 5000) and frontend (port 3000) servers.

