$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Write-Host "Scanning all JSON files in project root: $projectRoot"

Get-ChildItem -Path $projectRoot -Filter *.json -Recurse -ErrorAction SilentlyContinue | Where-Object { 
    $_.FullName -notmatch 'node_modules' -and 
    $_.FullName -notmatch '\\\.git' -and
    $_.FullName -notmatch '\\\.gemini' -and
    $_.FullName -notmatch '\\\.claude'
} | ForEach-Object {
    try {
        $null = Get-Content $_.FullName -Raw | ConvertFrom-Json
    } catch {
        Write-Host "Invalid JSON in $($_.FullName): $_"
    }
}
Write-Host "Scan complete."
