<#
.SYNOPSIS
Direct Sync: Sends specified files directly to a remote mirror.
Now includes data folder, protects data/prefabs/Map*.json, and purges *mz3d* files.
#>
$ErrorActionPreference = "Stop"

# =========================================================================
# CONFIGURATION
# =========================================================================
$MirrorRemoteUrl = "https://github.com/nocoldiz/hypernet-explorer-plugins.git" # (Or your ssh git@... url)
$DestinationBranch = "main"

$AllowedItems = @(
    "js", "hypernet", "docs", "books", "data", # <-- Added "data" here
    "hypernet-explorer.js", "hypernet-explorer.html",
    "run_game.bat", "run_server.bat", "server_p2p.js", 
    "server.js", "game_messages.csv", "Credits.md", 
    "package-lock.json", "package.json", "readme.md", "README.md"
)

# Set location to project root (parent of tools folder)
Set-Location "$PSScriptRoot\.."
# =========================================================================

# 1. Verify we are in a Git repo and prompt for a message
git rev-parse --is-inside-work-tree >$null 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "Must be run inside a Git repository."; exit 1 }

$CommitName = Read-Host "Enter the commit message for this sync"
if ([string]::IsNullOrWhiteSpace($CommitName)) { Write-Error "Commit message required."; exit 1 }

Write-Host "`nScanning current directory and building virtual snapshot..." -ForegroundColor Cyan

# 2. Tell Git to use a temporary staging area so we don't ruin your actual one
$env:GIT_INDEX_FILE = ".git/mirror_sync_index"

try {
    # Clear the temporary index
    git read-tree --empty

    # 3. Stage the allowed root folders and files
    foreach ($item in $AllowedItems) {
        if (Test-Path $item) {
            git add $item
        }
    }

    # 4. Filter the 'tools' folder (Only .html, .js, .md)
    if (Test-Path "tools") {
        Get-ChildItem -Path "tools" -Recurse | Where-Object { $_.Extension -match '\.(html|js|md)$' } | ForEach-Object {
            $GitPath = $_.FullName.Replace("$PWD\", "").Replace("\", "/")
            git add $GitPath
        }
    }

    # 5. REMOVE ANY FILES WITH "mz3d" IN THE NAME
    # We check the actual filename (Leaf) to ensure we delete anything containing 'mz3d'
    $mz3dFiles = git ls-files | Where-Object { ([System.IO.Path]::GetFileName($_)) -match 'mz3d' }
    if ($mz3dFiles) {
        Write-Host "Filtering out mz3d files..." -ForegroundColor DarkGray
        $mz3dFiles | ForEach-Object { git rm --cached --quiet --force $_ }
    }

    # 6. REMOVE MAP FILES (Except those in data/prefabs/)
    # Matches Map<numbers>.json anywhere, BUT specifically skips paths starting with 'data/prefabs/'
    $mapFiles = git ls-files | Where-Object { 
        $_ -match '(^|/)map[0-9]+\.json$' -and 
        $_ -notmatch '^data/prefabs/' 
    }
    if ($mapFiles) {
        Write-Host "Filtering out root/data Map files (keeping prefabs)..." -ForegroundColor DarkGray
        $mapFiles | ForEach-Object { git rm --cached --quiet --force $_ }
    }

    # 7. Write the snapshot to Git's database and create the commit
    $TreeHash = git write-tree
    if (!$TreeHash) { Write-Error "Failed to build Git tree. Are there matching files?"; exit 1 }

    $CommitHash = git commit-tree $TreeHash -m "$CommitName"
    Write-Host "Snapshot built successfully! (Virtual Commit: $CommitHash)" -ForegroundColor DarkGray

    # 8. Push that specific commit directly to the remote branch
    Write-Host "Pushing directly to mirror repository..." -ForegroundColor Yellow
    
    git push $MirrorRemoteUrl "$($CommitHash):refs/heads/$DestinationBranch" --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully synced to mirror!" -ForegroundColor Green
    } else {
        Write-Error "`n❌ Failed to push to remote."
    }

} finally {
    # 9. CLEANUP: Always delete the temporary index so normal Git commands work again
    if (Test-Path ".git/mirror_sync_index") {
        Remove-Item ".git/mirror_sync_index" -Force
    }
    $env:GIT_INDEX_FILE = $null
}