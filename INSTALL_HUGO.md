# Installing Hugo on Windows

You have several options to install Hugo:

## Option 1: Using winget (Recommended - Built into Windows 10/11)

```powershell
winget install Hugo.Hugo.Extended
```

After installation, close and reopen your terminal, then verify:
```powershell
hugo version
```

## Option 2: Using Chocolatey

First install Chocolatey (run PowerShell as Administrator):
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install Hugo:
```powershell
choco install hugo-extended -y
```

## Option 3: Manual Installation

1. Download Hugo Extended from: https://github.com/gohugoio/hugo/releases
2. Extract to `C:\Hugo` (or your preferred location)
3. Add `C:\Hugo` to your system PATH
4. Restart your terminal

## Quick Preview (Without Hugo)

If you just want to preview the hero section right now, you can:

1. **Open directly in browser:**
   - Double-click `preview.html` in your file explorer
   - Or right-click and select "Open with" → your browser

2. **Use a simple HTTP server (if you have Node.js):**
   ```powershell
   npx http-server -p 8080
   ```
   Then visit: http://localhost:8080/preview.html





