#!/usr/bin/env pwsh
# Start Frontend Server

Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Cyan
Write-Host ""

# Start the server
Set-Location client
Write-Host "📦 Starting frontend on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
npm run dev

