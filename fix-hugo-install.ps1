# Fix Hugo Installation Issues
# Run this script as Administrator

Write-Host "Attempting to fix Chocolatey lock file issues..." -ForegroundColor Yellow

# Option 1: Remove the lock file
$lockFile = "C:\ProgramData\chocolatey\lib\ce020f33af5688ae4fa36aaf09180accb9de9921"
if (Test-Path $lockFile) {
    Write-Host "Removing lock file: $lockFile" -ForegroundColor Cyan
    try {
        Remove-Item -Path $lockFile -Force -ErrorAction Stop
        Write-Host "Lock file removed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Could not remove lock file. You may need to run this as Administrator." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Lock file not found. It may have been removed already." -ForegroundColor Yellow
}

# Option 2: Try direct winget installation (if available)
Write-Host "`nTrying direct winget installation..." -ForegroundColor Yellow
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Installing Hugo Extended via winget..." -ForegroundColor Cyan
    winget install Hugo.Hugo.Extended --accept-package-agreements --accept-source-agreements
} else {
    Write-Host "winget not found. Please install Hugo manually." -ForegroundColor Red
}

Write-Host "`nDone! If installation succeeded, close and reopen your terminal, then run: hugo version" -ForegroundColor Green





