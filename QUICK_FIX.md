# Quick Fix for yargs-parser Error

## Problem
Getting `Cannot find module 'yargs-parser'` error even after npm install.

## Solution 1: Install yargs-parser directly (Recommended)

Run this command:

```powershell
npm install yargs-parser@latest --save-dev --force
```

Then try:
```powershell
npm run dev
```

## Solution 2: Close all programs and retry

The EPERM errors suggest files are locked. Close:
- VS Code / Cursor
- All terminal windows
- Any Node.js processes
- File Explorer windows in the project folder

Then run:
```powershell
npm install yargs-parser@latest --save-dev --force
npm run dev
```

## Solution 3: Run as Administrator

1. Right-click PowerShell
2. Select "Run as Administrator"
3. Navigate to project: `cd D:\Users\Dell\Cardora1`
4. Run: `npm install yargs-parser@latest --save-dev --force`
5. Try: `npm run dev`

## Solution 4: Use the fix script

Run the PowerShell script I created:
```powershell
.\fix-yargs.ps1
```

If you get execution policy error:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\fix-yargs.ps1
```

## Solution 5: Run servers separately (Workaround)

If nothing works, run servers in separate terminals:

**Terminal 1:**
```powershell
npm run dev:backend
```

**Terminal 2:**
```powershell
npm run dev:frontend
```

This bypasses the concurrently issue entirely.

