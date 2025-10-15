# PowerShell script to fix MUI Grid components
Write-Host "🔧 Fixing MUI Grid components..." -ForegroundColor Cyan

# Function to fix Grid components in a file
function Fix-GridInFile {
    param($FilePath)
    
    if (Test-Path $FilePath) {
        Write-Host "   Fixing: $FilePath" -ForegroundColor Yellow
        
        # Read the file content
        $content = Get-Content $FilePath -Raw
        
        # Replace old Grid syntax with new syntax
        # Replace "Grid item xs=" with "Grid xs="
        $content = $content -replace 'Grid\s+item\s+xs=', 'Grid xs='
        $content = $content -replace 'Grid\s+item\s+sm=', 'Grid sm='
        $content = $content -replace 'Grid\s+item\s+md=', 'Grid md='
        $content = $content -replace 'Grid\s+item\s+lg=', 'Grid lg='
        $content = $content -replace 'Grid\s+item\s+xl=', 'Grid xl='
        
        # Write the fixed content back
        Set-Content $FilePath $content -NoNewline
        
        Write-Host "   ✅ Fixed: $FilePath" -ForegroundColor Green
    }
}

# Fix all JavaScript/JSX files in the client directory
$files = Get-ChildItem -Path "client" -Recurse -Include "*.js", "*.jsx", "*.ts", "*.tsx" | Where-Object { $_.Name -notlike "*node_modules*" }

foreach ($file in $files) {
    Fix-GridInFile $file.FullName
}

Write-Host ""
Write-Host "✅ All MUI Grid components have been fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 The changes will take effect automatically in your browser." -ForegroundColor Cyan
Write-Host "   If you don't see changes immediately, refresh the page (F5)." -ForegroundColor Gray
