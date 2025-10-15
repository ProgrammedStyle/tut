# Script to add OAuth credentials to .env file
Write-Host "🔐 ADDING OAUTH CREDENTIALS TO .ENV FILE" -ForegroundColor Cyan
Write-Host ""

# Read current .env content
$envContent = Get-Content "server\.env"

# Create new content with OAuth credentials
$newContent = @()
foreach ($line in $envContent) {
    if ($line -match "^GOOGLE_CLIENT_ID=") {
        $newContent += "GOOGLE_CLIENT_ID=your-google-client-id-here"
    } elseif ($line -match "^GOOGLE_CLIENT_SECRET=") {
        $newContent += "GOOGLE_CLIENT_SECRET=your-google-client-secret-here"
    } elseif ($line -match "^FACEBOOK_CLIENT_ID=") {
        $newContent += "FACEBOOK_CLIENT_ID=your-facebook-client-id-here"
    } elseif ($line -match "^FACEBOOK_CLIENT_SECRET=") {
        $newContent += "FACEBOOK_CLIENT_SECRET=your-facebook-client-secret-here"
    } else {
        $newContent += $line
    }
}

# Write new content
$newContent | Set-Content "server\.env"

Write-Host "✅ Updated .env file with OAuth credential placeholders" -ForegroundColor Green
Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Open server\.env in a text editor" -ForegroundColor White
Write-Host "2. Replace the placeholder values with your real OAuth credentials:" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_ID=your-actual-google-client-id" -ForegroundColor Gray
Write-Host "   - GOOGLE_CLIENT_SECRET=your-actual-google-client-secret" -ForegroundColor Gray
Write-Host "   - FACEBOOK_CLIENT_ID=your-actual-facebook-client-id" -ForegroundColor Gray
Write-Host "   - FACEBOOK_CLIENT_SECRET=your-actual-facebook-client-secret" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Save the file" -ForegroundColor White
Write-Host "4. Restart the backend server" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Then your Google and Facebook sign-in buttons will work!" -ForegroundColor Cyan
