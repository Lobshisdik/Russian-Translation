@echo off
REM Steam Playtest Upload Script for Hypernet Explorer
REM App ID: 4413730, Depot ID: 4413731

echo ========================================
echo Steam Playtest Upload Script
echo ========================================
echo.
echo Build directory: C:\out\hypernet-explorer
echo.

REM Use steamcmd from C:\github\steamcmd
set STEAMCMD=C:\github\steamcmd\steamcmd.exe

if not exist "%STEAMCMD%" (
    echo ERROR: steamcmd.exe not found!
    echo Expected location: %STEAMCMD%
    pause
    exit /b 1
)

echo Using SteamCMD: %STEAMCMD%
echo.

REM Prompt for Steam credentials
set /p STEAM_USER="Enter your Steam username: "
for /f "usebackq delims=" %%i in (`powershell -Command "$p = Read-Host -Prompt 'Enter your Steam password' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p))"`) do set "STEAM_PASS=%%i"

echo.
echo Verifying credentials with Steam...
%STEAMCMD% +login %STEAM_USER% %STEAM_PASS% +quit
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Login failed! Please check your username and password.
    pause
    exit /b 1
)
echo Login successful.

echo.
echo Copying selected files and folders to build directory...

set "SRC=%~dp0.."
set "DEST=C:\out\hypernet-explorer"

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
echo Starting playtest upload to Steam...
echo.

REM Run steamcmd with build script
%STEAMCMD% +login %STEAM_USER% %STEAM_PASS% +run_app_build "%~dp0deploy\app_build_4413730.vdf" +quit

echo.
echo ========================================
echo Playtest upload complete!
echo Check steam_build_output_playtest folder for logs
echo ========================================
pause
