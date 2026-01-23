# Script to restart the server with updated environment variables

Write-Host "🔄 Restarting Server..." -ForegroundColor Yellow
Write-Host ""

# Kill existing node processes (be careful with this)
Write-Host "[1/3] Stopping existing Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "  ✓ Stopped Node processes" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "  → No Node processes found" -ForegroundColor Gray
}

# Verify .env file
Write-Host "[2/3] Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $smtpUser = (Get-Content .env | Select-String "SMTP_USER").ToString().Split('=')[1]
    $smtpPass = (Get-Content .env | Select-String "SMTP_PASS").ToString().Split('=')[1]
    if ($smtpUser -and $smtpPass) {
        Write-Host "  ✓ SMTP configuration found" -ForegroundColor Green
        Write-Host "  → SMTP_USER: $smtpUser" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠ SMTP configuration not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ .env file not found" -ForegroundColor Yellow
}

# Start server
Write-Host "[3/3] Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting with: npm run dev" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host ""
Write-Host "✅ Server restart initiated!" -ForegroundColor Green
Write-Host "📧 Email configuration should now be loaded." -ForegroundColor Green
Write-Host ""
Write-Host "💡 Check the new PowerShell window for server logs." -ForegroundColor Yellow
