#!/bin/bash
# Migration script for Windows using conda environment

echo "Portfolio Database Migration Script"
echo "==================================="

# Check if we're in the correct directory
if [ ! -f "main.py" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Check if conda is available
if ! command -v conda &> /dev/null; then
    echo "Error: Conda is not installed or not in PATH"
    echo "Please install Anaconda/Miniconda or make sure conda is in your PATH"
    exit 1
fi

# Activate base environment and run migration
echo "Activating conda base environment..."
conda activate base

echo "Running database migration..."
python migrations/migrate_v1_to_v2.py

if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
else
    echo "Migration failed. Please check the error messages above."
    exit 1
fi

echo "Migration script finished."
