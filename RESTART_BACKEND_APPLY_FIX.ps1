# Restart Backend Server with OAuth Fix Applied
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   RESTARTING BACKEND WITH OAUTH FIX" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Stop all existing Node.js processes
Write-Host "Step 1: Stopping existing backend processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✓ Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "✓ No Node.js processes to stop" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Verifying OAuth credentials..." -ForegroundColor Yellow
$envContent = Get-Content "server\.env" -Raw
if ($envContent -match "GOOGLE_CLIENT_ID=\S+" -and $envContent -match "GOOGLE_CLIENT_SECRET=\S+") {
    Write-Host "✓ Google OAuth credentials found" -ForegroundColor Green
} else {
    Write-Host "✗ Google OAuth credentials missing!" -ForegroundColor Red
}

if ($envContent -match "FACEBOOK_CLIENT_ID=\S+" -and $envContent -match "FACEBOOK_CLIENT_SECRET=\S+") {
    Write-Host "✓ Facebook OAuth credentials found" -ForegroundColor Green
} else {
    Write-Host "✗ Facebook OAuth credentials missing!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Starting backend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Look for these lines in the output:" -ForegroundColor Cyan
Write-Host "  ✓ Configuring Google OAuth" -ForegroundColor Green
Write-Host "  ✓ Configuring Facebook OAuth" -ForegroundColor Green
Write-Host ""
Write-Host "If you see '⚠ Google OAuth not configured', the fix didn't work." -ForegroundColor Yellow
Write-Host ""
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host ""

# Start backend in current window so user can see output
Set-Location server
npm run dev

