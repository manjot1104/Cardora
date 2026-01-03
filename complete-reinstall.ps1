# Complete Reinstall Script for Cardora
# Run this as Administrator if you get permission errors

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cardora - Complete Reinstall Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin (optional)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠ Warning: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "  If you get permission errors, run PowerShell as Admin" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Remove node_modules
Write-Host "[1/5] Removing corrupted node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    try {
        Remove-Item -Recurse -Force node_modules -ErrorAction Stop
        Write-Host "  ✓ node_modules removed successfully" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Error removing node_modules: $_" -ForegroundColor Red
        Write-Host "  → Try closing VS Code, terminals, and File Explorer" -ForegroundColor Yellow
        Write-Host "  → Or restart your computer and try again" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "  ✓ node_modules doesn't exist (already clean)" -ForegroundColor Gray
}

# Step 2: Remove package-lock.json
Write-Host "[2/5] Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Write-Host "  ✓ package-lock.json removed" -ForegroundColor Green
} else {
    Write-Host "  ✓ package-lock.json doesn't exist" -ForegroundColor Gray
}

# Step 3: Clear npm cache
Write-Host "[3/5] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force | Out-Null
Write-Host "  ✓ npm cache cleared" -ForegroundColor Green

# Step 4: Install dependencies
Write-Host "[4/5] Installing dependencies (this may take 5-10 minutes)..." -ForegroundColor Yellow
Write-Host "  Please wait..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Installation failed!" -ForegroundColor Red
    Write-Host "  → Check the error messages above" -ForegroundColor Yellow
    exit 1
}

Write-Host "  ✓ Dependencies installed successfully" -ForegroundColor Green

# Step 5: Verify installation
Write-Host "[5/5] Verifying critical packages..." -ForegroundColor Yellow
$criticalPackages = @("express", "next", "mongoose", "stripe", "tr46", "mime-db", "yargs-parser")
$allGood = $true

foreach ($pkg in $criticalPackages) {
    if (Test-Path "node_modules\$pkg") {
        Write-Host "  ✓ $pkg" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $pkg MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
if ($allGood) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ⚠ Some packages are missing" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running: npm install --force" -ForegroundColor Yellow
}

