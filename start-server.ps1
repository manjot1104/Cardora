# Script to start Cardora server
Write-Host "Starting Cardora Server..." -ForegroundColor Cyan

# Step 1: Kill any process on port 5000
Write-Host "`nStep 1: Checking port 5000..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process $process on port 5000. Killing it..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force
    Start-Sleep -Seconds 2
    Write-Host "Port 5000 is now free!" -ForegroundColor Green
} else {
    Write-Host "Port 5000 is free!" -ForegroundColor Green
}

# Step 2: Check MongoDB
Write-Host "`nStep 2: Checking MongoDB connection..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq 'Running') {
        Write-Host "MongoDB service is running!" -ForegroundColor Green
    } else {
        Write-Host "MongoDB service found but not running. Starting it..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "MongoDB service not found. Make sure MongoDB is installed and running." -ForegroundColor Yellow
    Write-Host "Or using MongoDB Atlas? Make sure MONGODB_URI is set in .env file." -ForegroundColor Yellow
}

# Step 3: Start the server
Write-Host "`nStep 3: Starting development server..." -ForegroundColor Yellow
Write-Host "Running: npm run dev`n" -ForegroundColor Cyan

npm run dev


