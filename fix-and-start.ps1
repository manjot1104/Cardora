# Script to fix common issues and start server
Write-Host "Fixing issues and starting server..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all Node processes
Write-Host "[1/3] Killing all Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "  ✓ Done" -ForegroundColor Green

# Step 2: Free port 5000
Write-Host "[2/3] Freeing port 5000..." -ForegroundColor Yellow
$portProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($portProcess) {
    Stop-Process -Id $portProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "  ✓ Port 5000 freed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Port 5000 is already free" -ForegroundColor Green
}

# Step 3: Start server
Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting npm run dev..." -ForegroundColor Cyan
Write-Host ""

npm run dev


