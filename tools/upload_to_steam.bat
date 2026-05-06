@echo off
REM Steam Upload Script for Hypernet Explorer
REM App ID: 4193010, Depot ID: 4193011

echo ========================================
echo Steam Upload Script
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
echo Starting upload to Steam...
echo.

REM Run steamcmd with build script
%STEAMCMD% +login %STEAM_USER% %STEAM_PASS% +run_app_build "%~dp0deploy\app_build_4193010.vdf" +quit

echo.
echo ========================================
echo Upload complete!
echo Check steam_build_output folder for logs
echo ========================================
pause
