# deploy.ps1 — Windows variant of scripts/deploy.sh
#
# OPTIONAL. Recommended path: Settings → Pages → Deploy from a branch → main.
# Use this only if you want to isolate the deployed site on its own gh-pages branch.
#
# Requirements:
#   - git on PATH
#   - gh CLI on PATH and authenticated (gh auth login)  -- optional
#
# Usage (PowerShell):
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1

$ErrorActionPreference = 'Stop'

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot    = Resolve-Path "$ScriptDir\.."
$Branch      = 'gh-pages'
$CommitMsg   = "Deploy to GitHub Pages ($(Get-Date -Format 'yyyy-MM-dd HH:mm UTC'))"

Set-Location $RepoRoot

# Sanity check
if (-not (Test-Path 'index.html')) {
    Write-Error "index.html not found at repo root. Aborting."
    exit 1
}

# Check remote
$origin = git remote get-url origin 2>$null
if (-not $origin) {
    Write-Error "No 'origin' remote configured. Add one with:`n  git remote add origin https://github.com/jaraserg/LandingPages.git"
    exit 1
}

Write-Host "→ Using remote: $origin"

# Stash uncommitted changes
$hasChanges = (git diff --quiet) -and (git diff --cached --quiet)
if (-not $hasChanges) {
    Write-Host "WARN: uncommitted local changes detected. Stashing before deploy."
    $stashName = "deploy-stash-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
    git stash push -u -m $stashName | Out-Null
    $stashed = $true
} else {
    $stashed = $false
}

Write-Host "→ Creating/switching to branch '$Branch'…"
git checkout --orphan $Branch 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout $Branch
}

Write-Host "→ Pushing '$Branch' to origin (force)…"
git push origin $Branch --force

if ($stashed) {
    Write-Host "→ Restoring stashed local changes…"
    git stash pop | Out-Null
}

Write-Host ""
Write-Host "✅ Pushed to '$Branch'."
Write-Host ""
Write-Host "Next step: open https://github.com/jaraserg/LandingPages/settings/pages"
Write-Host "  Source : Deploy from a branch"
Write-Host "  Branch : $Branch"
Write-Host "  Folder : / (root)"
Write-Host "  Save."
Write-Host ""
Write-Host "Site will be live at: https://jaraserg.github.io/LandingPages/"