# Simple OAuth Test
Write-Host "Testing OAuth Fix..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/user/google" -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "✓ SUCCESS! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 302) {
        Write-Host "✓ SUCCESS! OAuth is working - redirecting to Google" -ForegroundColor Green
    } else {
        Write-Host "✗ Still showing error page" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Now test in browser: http://localhost:3000/CreateAccount" -ForegroundColor Cyan
