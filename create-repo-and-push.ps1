# Script to create GitHub repo and push code using GitHub API
param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    [string]$RepoName = "WEBSITE_BLINKOFAIIO_2",
    [string]$GitHubUsername = "Sagar"
)

Write-Host "Creating GitHub repository..." -ForegroundColor Green

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
    
    # Push code
    Write-Host "Pushing code..." -ForegroundColor Green
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Code pushed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next: Configure GitHub Pages at:" -ForegroundColor Yellow
        Write-Host "https://github.com/$GitHubUsername/$RepoName/settings/pages" -ForegroundColor Cyan
        Write-Host "Select 'GitHub Actions' as the source." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}


