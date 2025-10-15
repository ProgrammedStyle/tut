# Complete Setup Script for Jerusalem Virtual Guide
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Jerusalem Virtual Guide - Complete Setup        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "📦 Step 1: Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Create .env file
Write-Host ""
Write-Host "🔧 Step 2: Creating environment configuration..." -ForegroundColor Yellow

if (Test-Path "server\.env") {
    Write-Host "   ⚠️  server\.env already exists!" -ForegroundColor Yellow
} else {
    if (Test-Path "server\env-template.txt") {
        Copy-Item "server\env-template.txt" "server\.env"
        Write-Host "   ✅ Created server\.env" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Template file not found!" -ForegroundColor Red
        exit 1
    }
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "📚 Step 3: Installing dependencies..." -ForegroundColor Yellow

Write-Host "   Installing server dependencies..." -ForegroundColor Gray
Push-Location server
npm install --silent 2>&1 | Out-Null
Pop-Location
Write-Host "   ✅ Server dependencies installed" -ForegroundColor Green

Write-Host "   Installing client dependencies..." -ForegroundColor Gray
Push-Location client
npm install --silent 2>&1 | Out-Null
Pop-Location
Write-Host "   ✅ Client dependencies installed" -ForegroundColor Green

# Step 4: Check MongoDB
Write-Host ""
Write-Host "🗄️  Step 4: Checking MongoDB..." -ForegroundColor Yellow
$mongoVersion = mongod --version 2>$null
if ($mongoVersion) {
    Write-Host "   ✅ MongoDB is installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB is NOT installed locally" -ForegroundColor Yellow
    Write-Host "   You have two options:" -ForegroundColor White
    Write-Host "   A) Install MongoDB locally: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "   B) Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host ""
    Write-Host "   📝 IMPORTANT: You must set up MongoDB before running the app!" -ForegroundColor Red
    Write-Host "   After setting up MongoDB, update MONGO_URI in server\.env" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              Setup Complete! ✅                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🗄️  Set up MongoDB:" -ForegroundColor White
Write-Host "   Option A - MongoDB Atlas (Recommended):" -ForegroundColor Gray
Write-Host "   • Go to https://www.mongodb.com/cloud/atlas/register" -ForegroundColor Gray
Write-Host "   • Create free M0 cluster" -ForegroundColor Gray
Write-Host "   • Get connection string" -ForegroundColor Gray
Write-Host "   • Update MONGO_URI in server\.env" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option B - Local MongoDB:" -ForegroundColor Gray
Write-Host "   • Install from https://www.mongodb.com/try/download/community" -ForegroundColor Gray
Write-Host "   • Start MongoDB service" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🚀 Start the servers:" -ForegroundColor White
Write-Host "   Terminal 1: cd server && npm run dev" -ForegroundColor Gray
Write-Host "   Terminal 2: cd client && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🌐 Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: See QUICK_START.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

