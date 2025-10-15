# Website Diagnostic Script
Write-Host "🔍 DIAGNOSING YOUR WEBSITE..." -ForegroundColor Cyan
Write-Host ""

# Check if servers are running
Write-Host "1. Checking Server Status..." -ForegroundColor Yellow

$frontend = netstat -an | findstr ":3000"
$backend = netstat -an | findstr ":5000"

if ($frontend) {
    Write-Host "   ✅ Frontend Server (port 3000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend Server (port 3000): NOT RUNNING" -ForegroundColor Red
}

if ($backend) {
    Write-Host "   ✅ Backend Server (port 5000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend Server (port 5000): NOT RUNNING" -ForegroundColor Red
}

Write-Host ""

# Check environment file
Write-Host "2. Checking Environment Configuration..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    Write-Host "   ✅ Environment file exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Environment file missing" -ForegroundColor Red
}

# Check package.json files
Write-Host "3. Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "client\package.json") {
    Write-Host "   ✅ Client package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Client package.json missing" -ForegroundColor Red
}

if (Test-Path "server\package.json") {
    Write-Host "   ✅ Server package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Server package.json missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Open your browser and go to: http://localhost:3000" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Check the Console tab for any red error messages" -ForegroundColor White
Write-Host "4. Try clicking buttons to test functionality" -ForegroundColor White
Write-Host ""
Write-Host "📝 REPORT BACK:" -ForegroundColor Cyan
Write-Host "Tell me what you see and any error messages!" -ForegroundColor White
