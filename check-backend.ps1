# Quick script to check if backend is running
Write-Host "Checking backend server status..." -ForegroundColor Cyan
Write-Host ""

# Check port 5000
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $processId = $port5000.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    Write-Host "✅ Backend server is RUNNING!" -ForegroundColor Green
    Write-Host "   Process ID: $processId" -ForegroundColor Gray
    Write-Host "   Process Name: $($process.ProcessName)" -ForegroundColor Gray
    Write-Host "   Port: 5000" -ForegroundColor Gray
    Write-Host ""
    
    # Test if server responds
    Write-Host "Testing server connection..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body '{"test":"test"}' -ContentType "application/json" -ErrorAction Stop -TimeoutSec 3
        Write-Host "✅ Server is responding!" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ Server is responding (expected error for test request)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Server might not be fully ready" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ Backend server is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the server, run:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host "   OR" -ForegroundColor Gray
    Write-Host "   npm run dev:backend" -ForegroundColor Cyan
}

Write-Host ""




