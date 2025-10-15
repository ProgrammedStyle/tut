#!/usr/bin/env pwsh
# Start Both Servers in Separate Windows

Write-Host "🚀 Starting Jerusalem Virtual Guide..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "server\.env")) {
    Write-Host "❌ ERROR: server\.env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to create the .env file first!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick fix - Run ONE of these:" -ForegroundColor White
    Write-Host "  1. .\complete-setup.ps1  (automated)" -ForegroundColor Gray
    Write-Host "  2. Copy server\env-template.txt to server\.env  (manual)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

$currentPath = Get-Location

# Start Backend in new window
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$currentPath'; .\start-backend.ps1"

Start-Sleep -Seconds 2

# Start Frontend in new window
Write-Host "📦 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$currentPath'; .\start-frontend.ps1"

Write-Host ""
Write-Host "✅ Servers starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Once both are ready, open:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows or press Ctrl+C in each" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

