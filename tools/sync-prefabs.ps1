# Sync prefabs from hypernet-explorer-prefabs repository

$prefabsRepo = "C:\github\hypernet-explorer-prefabs"
$sourceDir = "$prefabsRepo\data"
$targetDir = "$PSScriptRoot\..\data\prefabs"

# Pull latest changes from prefabs repository
Write-Host "Pulling latest changes from prefabs repository..." -ForegroundColor Cyan
Push-Location $prefabsRepo
try {
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to pull from git repository" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "Successfully pulled latest changes" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Copy Map*.json files
Write-Host "`nCopying Map*.json files..." -ForegroundColor Cyan
$mapFiles = Get-ChildItem -Path $sourceDir -Filter "Map*.json"

if ($mapFiles.Count -eq 0) {
    Write-Host "Warning: No Map*.json files found in $sourceDir" -ForegroundColor Yellow
    exit 0
}

# Ensure target directory exists
if (!(Test-Path $targetDir)) {
    Write-Host "Creating target directory: $targetDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Copy files
$copiedCount = 0
foreach ($file in $mapFiles) {
    Copy-Item -Path $file.FullName -Destination $targetDir -Force
    $copiedCount++
    Write-Host "  Copied: $($file.Name)" -ForegroundColor Gray
}

Write-Host "`nSuccessfully copied $copiedCount Map files to $targetDir" -ForegroundColor Green
