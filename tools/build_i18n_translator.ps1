# Build script for i18n Explorer Pro
# Requires: pip install PyQt6 pyinstaller

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "--- Installing Dependencies ---" -ForegroundColor Cyan
pip install PyQt6 pyinstaller

Write-Host "--- Building EXE ---" -ForegroundColor Cyan
# Build directly to the project root (one level up from tools)
pyinstaller --noconfirm --onefile --windowed --name "i18nTranslator" --icon "NONE" --distpath ".." "i18n_translator.py"

Write-Host "--- Cleaning Up ---" -ForegroundColor Cyan
Remove-Item -Path "build" -Recurse -ErrorAction SilentlyContinue
Remove-Item -Path "i18nTranslator.spec" -ErrorAction SilentlyContinue
# Remove the empty dist folder if it exists (though --distpath .. might create it there)
# Actually, --distpath .. puts the EXE in the parent dir.

Write-Host "--- Build Complete! ---" -ForegroundColor Green
$projectRoot = (Get-Item $scriptDir).Parent.FullName
Write-Host "EXE located in: $projectRoot\i18nTranslator.exe"
