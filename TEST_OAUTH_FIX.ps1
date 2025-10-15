# Test OAuth Fix
Write-Host "Testing OAuth Fix..." -ForegroundColor Yellow
Write-Host ""

# Test the endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/user/google" -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    
    if ($response.StatusCode -eq 302) {
        Write-Host "✓ SUCCESS! OAuth is working - redirecting to Google" -ForegroundColor Green
        Write-Host "Location: $($response.Headers.Location)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Unexpected status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 302) {
        Write-Host "✓ SUCCESS! OAuth is working - redirecting to Google" -ForegroundColor Green
        Write-Host "Location: $($_.Exception.Response.Headers.Location)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Still showing error page" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Now test in your browser:" -ForegroundColor Yellow
Write-Host "1. Go to: http://localhost:3000/CreateAccount" -ForegroundColor White
Write-Host "2. Click 'Sign in using Google'" -ForegroundColor White
Write-Host "3. You should be redirected to Google login page" -ForegroundColor White
