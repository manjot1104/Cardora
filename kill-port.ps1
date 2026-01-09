# PowerShell script to kill process using port 5000
$port = 5000

Write-Host "Finding process using port $port..." -ForegroundColor Yellow

# Find the process
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process ID: $process" -ForegroundColor Green
    Write-Host "Killing process..." -ForegroundColor Yellow
    
    # Kill the process
    Stop-Process -Id $process -Force
    
    Write-Host "Process killed successfully!" -ForegroundColor Green
    Write-Host "You can now run 'npm run dev' again." -ForegroundColor Cyan
} else {
    Write-Host "No process found using port $port" -ForegroundColor Red
    Write-Host "You may need to check for other processes or try a different port." -ForegroundColor Yellow
}


