# PowerShell script to set up environment files
Write-Host "🚀 Setting up environment configuration..." -ForegroundColor Cyan

# Check if .env already exists
if (Test-Path "server\.env") {
    Write-Host "⚠️  server\.env already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Copy template to .env
Copy-Item "server\env-template.txt" "server\.env"

Write-Host "✅ Created server\.env file!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Install MongoDB or use MongoDB Atlas (cloud database)" -ForegroundColor White
Write-Host "2. Update server\.env with your MongoDB connection string" -ForegroundColor White
Write-Host "3. Run 'cd server && npm run dev' to start backend" -ForegroundColor White
Write-Host "4. Run 'cd client && npm run dev' to start frontend" -ForegroundColor White
Write-Host ""
Write-Host "🔧 MongoDB Atlas Setup (Recommended):" -ForegroundColor Yellow
Write-Host "   1. Go to https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
Write-Host "   2. Create a free cluster (M0)" -ForegroundColor White
Write-Host "   3. Click 'Connect' → 'Connect your application'" -ForegroundColor White
Write-Host "   4. Copy the connection string" -ForegroundColor White
Write-Host "   5. Replace MONGO_URI in server\.env with your connection string" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

