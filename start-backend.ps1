#!/usr/bin/env pwsh
# Start Backend Server

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "server\.env")) {
    Write-Host "❌ ERROR: server\.env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to create the .env file first!" -ForegroundColor Yellow
    Write-Host "Run: .\complete-setup.ps1" -ForegroundColor Yellow
    Write-Host "Or manually rename: server\env-template.txt to server\.env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Start the server
Set-Location server
Write-Host "📦 Starting backend on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
npm run dev

