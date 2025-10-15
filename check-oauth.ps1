Write-Host "Checking OAuth status..." -ForegroundColor Yellow

# Test the endpoint
$result = try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/user/google" -MaximumRedirection 0 -ErrorAction Stop
} catch {
    $_.Exception.Response
}

if ($result.StatusCode -eq 302) {
    Write-Host "SUCCESS: OAuth is working! Status: 302 (Redirect)" -ForegroundColor Green
    Write-Host "Location: $($result.Headers.Location)" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Still showing error page. Status: $($result.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test in browser: http://localhost:3000/CreateAccount" -ForegroundColor White
