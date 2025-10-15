#!/usr/bin/env pwsh
# Complete Setup and Start Script for Jerusalem Virtual Guide

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Jerusalem Virtual Guide - Setup & Start             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$rootPath = Get-Location

# Step 1: Create .env file
Write-Host "🔧 Step 1: Setting up environment configuration..." -ForegroundColor Yellow

if (Test-Path "server\.env") {
    Write-Host "   ✅ .env file already exists" -ForegroundColor Green
} else {
    if (Test-Path "server\env-template.txt") {
        Copy-Item "server\env-template.txt" "server\.env" -Force
        Write-Host "   ✅ Created server\.env from template" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Template file not found!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 2: Check MongoDB
Write-Host "🗄️  Step 2: Checking database configuration..." -ForegroundColor Yellow

# Read the .env file to check MONGO_URI
$envContent = Get-Content "server\.env" -Raw
if ($envContent -match "MONGO_URI=mongodb://localhost:27017") {
    Write-Host "   ⚠️  You're using LOCAL MongoDB" -ForegroundColor Yellow
    
    # Try to connect to local MongoDB
    $mongoRunning = $false
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", 27017)
        $tcpClient.Close()
        $mongoRunning = $true
    } catch {
        $mongoRunning = $false
    }
    
    if ($mongoRunning) {
        Write-Host "   ✅ Local MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   ❌ Local MongoDB is NOT running!" -ForegroundColor Red
        Write-Host ""
        Write-Host "   You have TWO options:" -ForegroundColor White
        Write-Host ""
        Write-Host "   ═══════════════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "   OPTION 1: MongoDB Atlas (Recommended - FREE)" -ForegroundColor Green
        Write-Host "   ═══════════════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "   1. Open: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
        Write-Host "   2. Sign up (free)" -ForegroundColor White
        Write-Host "   3. Create a FREE M0 Cluster" -ForegroundColor White
        Write-Host "   4. Click 'Connect' → 'Connect your application'" -ForegroundColor White
        Write-Host "   5. Copy the connection string" -ForegroundColor White
        Write-Host "   6. Open server\.env and replace MONGO_URI with your string" -ForegroundColor White
        Write-Host ""
        Write-Host "   ═══════════════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "   OPTION 2: Install MongoDB Locally" -ForegroundColor Yellow
        Write-Host "   ═══════════════════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "   1. Download: https://www.mongodb.com/try/download/community" -ForegroundColor White
        Write-Host "   2. Install MongoDB" -ForegroundColor White
        Write-Host "   3. Start MongoDB service" -ForegroundColor White
        Write-Host ""
        Write-Host "   After setting up MongoDB, run this script again!" -ForegroundColor Cyan
        Write-Host ""
        
        $choice = Read-Host "   Do you want to open MongoDB Atlas signup page? (y/n)"
        if ($choice -eq "y" -or $choice -eq "Y") {
            Start-Process "https://www.mongodb.com/cloud/atlas/register"
            Write-Host ""
            Write-Host "   📝 After setting up Atlas:" -ForegroundColor Yellow
            Write-Host "   1. Get your connection string" -ForegroundColor White
            Write-Host "   2. Open: server\.env" -ForegroundColor White
            Write-Host "   3. Replace MONGO_URI with your Atlas string" -ForegroundColor White
            Write-Host "   4. Run this script again: .\SETUP_AND_START.ps1" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
} else {
    Write-Host "   ✅ Using cloud/remote MongoDB" -ForegroundColor Green
}

Write-Host ""

# Step 3: Start servers
Write-Host "🚀 Step 3: Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Write-Host "   📦 Starting Backend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; cd server; Write-Host '🟢 BACKEND SERVER' -ForegroundColor Green; Write-Host 'Running on http://localhost:5000' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "   📦 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; cd client; Write-Host '🟢 FRONTEND SERVER' -ForegroundColor Green; Write-Host 'Running on http://localhost:3000' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  Servers Starting! ✅                     ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️  Wait 5-10 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Then open your browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "📊 Server status:" -ForegroundColor Cyan
Write-Host "   • Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 To stop servers:" -ForegroundColor Yellow
Write-Host "   Close the server windows or press Ctrl+C in each" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
Write-Host "   • If you see errors, check the server windows" -ForegroundColor Gray
Write-Host "   • Database errors? Set up MongoDB Atlas (see above)" -ForegroundColor Gray
Write-Host "   • See FIX_YOUR_WEBSITE_NOW.md for detailed help" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

