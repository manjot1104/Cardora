# Fix yargs-parser issue
# Run this script as Administrator if needed

Write-Host "Fixing yargs-parser installation..." -ForegroundColor Green

# Step 1: Try to remove yargs-parser specifically
Write-Host "`n1. Removing corrupted yargs-parser..." -ForegroundColor Yellow
if (Test-Path "node_modules\yargs-parser") {
    try {
        Remove-Item -Recurse -Force "node_modules\yargs-parser" -ErrorAction Stop
        Write-Host "   ✓ yargs-parser removed" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠ Could not remove (file may be locked)" -ForegroundColor Yellow
        Write-Host "   Try closing VS Code, terminals, or other programs using this folder" -ForegroundColor Yellow
    }
}

# Step 2: Install yargs-parser directly
Write-Host "`n2. Installing yargs-parser..." -ForegroundColor Yellow
npm install yargs-parser@latest --save-dev --force

# Step 3: Reinstall concurrently
Write-Host "`n3. Reinstalling concurrently..." -ForegroundColor Yellow
npm install concurrently@latest --save-dev --force

Write-Host "`n✓ Done! Try running: npm run dev" -ForegroundColor Green

