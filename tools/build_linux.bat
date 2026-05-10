@echo off
REM Script to prepare Linux Native Build for Hypernet Explorer
REM This script copies the game files to the Linux build directory.
REM You will need to add the Linux NW.js binaries to the output folder manually.

echo ========================================
echo Preparing Linux Native Build
echo ========================================
echo.
echo Build directory: C:\out\hypernet-explorer-linux
echo.

set "SRC=%~dp0.."
set "DEST=C:\out\hypernet-explorer-linux"

echo Copying selected files and folders to Linux build directory...

REM Copy folders
robocopy "%SRC%\books" "%DEST%\books" /E /NJH /NJS
robocopy "%SRC%\css" "%DEST%\css" /E /NJH /NJS
robocopy "%SRC%\fonts" "%DEST%\fonts" /E /NJH /NJS
robocopy "%SRC%\hypernet" "%DEST%\hypernet" /E /NJH /NJS
robocopy "%SRC%\img" "%DEST%\img" /E /NJH /NJS
robocopy "%SRC%\js" "%DEST%\js" /E /NJH /NJS
robocopy "%SRC%\audio" "%DEST%\audio" /E /NJH /NJS
robocopy "%SRC%\icon" "%DEST%\icon" /E /NJH /NJS
robocopy "%SRC%\data" "%DEST%\data" /E /NJH /NJS
robocopy "%SRC%\effects" "%DEST%\effects" /E /NJH /NJS
robocopy "%SRC%\movies" "%DEST%\movies" /E /NJH /NJS

REM Copy files
robocopy "%SRC%" "%DEST%" "hypernet-explorer.html" /NJH /NJS
robocopy "%SRC%" "%DEST%" "index.html" /NJH /NJS
robocopy "%SRC%" "%DEST%" "package.json" /NJH /NJS
robocopy "%SRC%" "%DEST%" "hypernet-explorer.js" /NJH /NJS

echo.
echo Editing System.json in target directory...
powershell -Command "$path = '%DEST%\data\System.json'; $json = Get-Content $path -Raw | ConvertFrom-Json; $json.startMapId = 557; $json.startX = 13; $json.startY = 5; $json | ConvertTo-Json -Depth 100 -Compress | Set-Content $path"

echo.
echo ========================================
echo Linux build preparation complete!
echo.
echo IMPORTANT: To make this a working native Linux build, you must:
echo 1. Download NW.js for Linux (x64) from https://dl.nwjs.io/
echo 2. Extract the files (nw, nw.pak, etc.) directly into:
echo    C:\out\hypernet-explorer-linux
echo ========================================
pause
