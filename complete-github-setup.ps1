# Complete GitHub setup script for BlinkofAI website
# This script will create the repository, push code, and configure GitHub Pages

param(
    [string]$RepoName = "WEBSITE_BLINKOFAIIO_2",
    [string]$GitHubUsername = "Sagar"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Repository Setup for BlinkofAI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify git remote is set
Write-Host "Step 1: Checking git remote..." -ForegroundColor Green
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
$currentRemote = git remote get-url origin 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding git remote..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
} else {
    Write-Host "Updating git remote..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
}
Write-Host "Remote configured: $remoteUrl" -ForegroundColor Green
Write-Host ""

# Step 2: Try to push (repository must exist first)
Write-Host "Step 2: Pushing code to GitHub..." -ForegroundColor Green
Write-Host "Note: The repository must be created first at https://github.com/new" -ForegroundColor Yellow
Write-Host "Repository name: $RepoName" -ForegroundColor Cyan
Write-Host "Do NOT initialize with README, .gitignore, or license" -ForegroundColor Yellow
Write-Host ""

$pushAttempt = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Code pushed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Step 3: Configure GitHub Pages
    Write-Host "Step 3: GitHub Pages Configuration" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Your code has been pushed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$GitHubUsername/$RepoName/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Under Source, select GitHub Actions" -ForegroundColor Cyan
    Write-Host "3. The GitHub Actions workflow will automatically build and deploy your site!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your site will be available at:" -ForegroundColor Green
    Write-Host "https://$GitHubUsername.github.io/$RepoName/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The workflow will trigger automatically on the next push to main branch." -ForegroundColor Yellow
} else {
    Write-Host "Push failed. This usually means:" -ForegroundColor Red
    Write-Host "1. The repository does not exist yet" -ForegroundColor Yellow
    Write-Host "2. You need to authenticate" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create the repository:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: $RepoName" -ForegroundColor White
    Write-Host "3. Make it Public" -ForegroundColor White
    Write-Host "4. Do NOT check any initialization options" -ForegroundColor White
    Write-Host "5. Click Create repository" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again, or run:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "If you need to authenticate, GitHub will prompt you." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
