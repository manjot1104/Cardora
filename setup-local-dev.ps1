# Setup script for local development
Write-Host "Setting up local development environment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Create .env.local file
Write-Host "[1/3] Creating .env.local file..." -ForegroundColor Yellow
$envContent = "NEXT_PUBLIC_API_URL=http://localhost:5000"
if (Test-Path ".env.local") {
    Write-Host "  ⚠ .env.local already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "  Do you want to overwrite it? (y/n)"
    if ($overwrite -eq 'y') {
        Set-Content -Path ".env.local" -Value $envContent
        Write-Host "  ✓ .env.local updated" -ForegroundColor Green
    } else {
        Write-Host "  → Keeping existing .env.local" -ForegroundColor Gray
    }
} else {
    Set-Content -Path ".env.local" -Value $envContent
    Write-Host "  ✓ .env.local created" -ForegroundColor Green
}

# Step 2: Kill existing processes
Write-Host "[2/3] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
$portProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($portProcess) {
    Stop-Process -Id $portProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}
Write-Host "  ✓ Cleaned up" -ForegroundColor Green

# Step 3: Start server
Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting npm run dev..." -ForegroundColor Cyan
Write-Host ""

npm run dev


