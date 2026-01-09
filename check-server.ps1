# Diagnostic script to check server status
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cardora Server Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Port 5000 status
Write-Host "[1/4] Checking port 5000..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $processId = $port5000.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    Write-Host "  ⚠ Port 5000 is in use by process: $processId ($($process.ProcessName))" -ForegroundColor Red
    Write-Host "  → Run: Stop-Process -Id $processId -Force" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Port 5000 is free" -ForegroundColor Green
}

# Check 2: Node.js processes
Write-Host "[2/4] Checking Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  ⚠ Found $($nodeProcesses.Count) Node.js process(es) running:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "    - PID: $($_.Id), Name: $($_.ProcessName)" -ForegroundColor Gray
    }
    Write-Host "  → Run: Get-Process node | Stop-Process -Force" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ No Node.js processes running" -ForegroundColor Green
}

# Check 3: MongoDB connection
Write-Host "[3/4] Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq 'Running') {
        Write-Host "  ✓ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MongoDB service found but not running" -ForegroundColor Red
        Write-Host "  → Run: Start-Service -Name MongoDB" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ MongoDB service not found" -ForegroundColor Yellow
    Write-Host "  → Make sure MongoDB is installed or using MongoDB Atlas" -ForegroundColor Yellow
    Write-Host "  → Check .env file for MONGODB_URI" -ForegroundColor Yellow
}

# Check 4: Environment file
Write-Host "[4/4] Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ✓ .env file exists" -ForegroundColor Green
    $envContent = Get-Content .env -ErrorAction SilentlyContinue
    if ($envContent -match "MONGODB_URI") {
        Write-Host "  ✓ MONGODB_URI found in .env" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MONGODB_URI not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ .env file not found (optional if using default MongoDB)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Quick Fix Commands:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Kill all Node processes:" -ForegroundColor White
Write-Host "   Get-Process node | Stop-Process -Force" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Kill process on port 5000:" -ForegroundColor White
Write-Host "   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""


