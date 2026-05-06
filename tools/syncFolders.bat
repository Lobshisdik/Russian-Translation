@echo off
setlocal enabledelayedexpansion

REM Define source and destination paths
set "SOURCE_PATH=C:\Users\nocol\Documents\GitHub\esoteric-heavy-industries"
set "DEST_PATH=C:\Users\nocol\Documents\Output\esoteric-heavy-industries"

echo Starting copy operation...
echo Source: %SOURCE_PATH%
echo Destination: %DEST_PATH%
echo.

REM Create destination directory if it doesn't exist
if not exist "%DEST_PATH%" (
    echo Creating destination directory...
    mkdir "%DEST_PATH%"
)

REM Copy js folder - only different files
echo Copying js folder...
if exist "%SOURCE_PATH%\js" (
    robocopy "%SOURCE_PATH%\js" "%DEST_PATH%\js" /E /XO /R:3 /W:5 /MT:8
    if !errorlevel! geq 8 (
        echo ERROR: Failed to copy js folder
    ) else (
        echo js folder copied successfully
    )
) else (
    echo WARNING: js folder not found in source
)

echo.

REM Copy data folder - only different files
echo Copying data folder...
if exist "%SOURCE_PATH%\data" (
    robocopy "%SOURCE_PATH%\data" "%DEST_PATH%\data" /E /XO /R:3 /W:5 /MT:8
    if !errorlevel! geq 8 (
        echo ERROR: Failed to copy data folder
    ) else (
        echo data folder copied successfully
    )
) else (
    echo WARNING: data folder not found in source
)

echo.
echo Copy operation completed!
echo.

REM Show summary of what was copied
echo Summary:
robocopy "%SOURCE_PATH%\js" "%DEST_PATH%\js" /E /XO /L /NP /NDL /NFL | find "Files :"
robocopy "%SOURCE_PATH%\data" "%DEST_PATH%\data" /E /XO /L /NP /NDL /NFL | find "Files :"

pause