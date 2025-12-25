# PowerShell script to create GitHub repository and push code
param(
    [string]$RepoName = "WEBSITE_BLINKOFAIIO_2",
    [string]$GitHubUsername = "",
    [string]$GitHubToken = ""
)

Write-Host "Setting up GitHub repository..." -ForegroundColor Green

# Get GitHub username from git config if not provided
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    $GitHubUsername = git config user.name
    if ([string]::IsNullOrEmpty($GitHubUsername)) {
        Write-Host "Please provide your GitHub username:" -ForegroundColor Yellow
        $GitHubUsername = Read-Host
    }
}

# Check if GitHub token is needed
if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "`nTo create the repository automatically, you need a GitHub Personal Access Token." -ForegroundColor Yellow
    Write-Host "You can create one at: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "Required scopes: repo, workflow" -ForegroundColor Yellow
    Write-Host "`nAlternatively, you can:" -ForegroundColor Yellow
    Write-Host "1. Create the repository manually at https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Name it: $RepoName" -ForegroundColor Cyan
    Write-Host "3. Do NOT initialize with README, .gitignore, or license" -ForegroundColor Cyan
    Write-Host "4. Then run: git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor Cyan
    Write-Host "5. Then run: git push -u origin main" -ForegroundColor Cyan
    Write-Host "`nOr provide a GitHub token to automate:" -ForegroundColor Yellow
    $GitHubToken = Read-Host "GitHub Personal Access Token (or press Enter to skip)"
}

# If token is provided, create repo via API
if (-not [string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "`nCreating repository via GitHub API..." -ForegroundColor Green
    
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $body = @{
        name = $RepoName
        description = "BlinkofAI website with Hugo and Tailwind CSS"
        private = $false
        auto_init = $false
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "Repository created successfully!" -ForegroundColor Green
        Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "Error creating repository: $_" -ForegroundColor Red
        Write-Host "You may need to create it manually at https://github.com/new" -ForegroundColor Yellow
        exit 1
    }
}

# Set up git remote
Write-Host "`nSetting up git remote..." -ForegroundColor Green
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote 'origin' already exists. Updating..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

Write-Host "Remote configured: $remoteUrl" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing code to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCode pushed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$GitHubUsername/$RepoName/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Under 'Source', select 'GitHub Actions'" -ForegroundColor Cyan
    Write-Host "3. The GitHub Actions workflow will automatically deploy your site!" -ForegroundColor Cyan
    Write-Host "`nYour site will be available at:" -ForegroundColor Green
    Write-Host "https://$GitHubUsername.github.io/$RepoName/" -ForegroundColor Cyan
} else {
    Write-Host "`nPush failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Create the repository manually at https://github.com/new" -ForegroundColor Yellow
    Write-Host "2. Then run: git push -u origin main" -ForegroundColor Yellow
}


