@echo off
REM Migration script for Windows using conda environment

echo Portfolio Database Migration Script
echo ===================================

REM Check if we're in the correct directory
if not exist "main.py" (
    echo Error: Please run this script from the backend directory
    exit /b 1
)

REM Check if conda is available
where conda >nul 2>&1
if errorlevel 1 (
    echo Error: Conda is not installed or not in PATH
    echo Please install Anaconda/Miniconda or make sure conda is in your PATH
    exit /b 1
)

REM Activate base environment and run migration
echo Activating conda base environment...
call conda activate base

echo Running database migration...
python migrations\migrate_v1_to_v2.py

if errorlevel 1 (
    echo Migration failed. Please check the error messages above.
    exit /b 1
) else (
    echo Migration completed successfully!
)

echo Migration script finished.
pause
