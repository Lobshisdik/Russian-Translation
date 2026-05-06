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
set /p STEAM_PASS="Enter your Steam password: "

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
