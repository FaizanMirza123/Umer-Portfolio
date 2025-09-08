# Portfolio Database Migrations

This directory contains database migration scripts to update your portfolio database schema.

## Running Migrations

### For Windows Users:

#### Using Command Prompt or PowerShell:

```bash
# Navigate to the backend directory
cd backend

# Run the migration script
run_migration.bat
```

#### Using Git Bash or WSL:

```bash
# Navigate to the backend directory
cd backend

# Make the script executable (first time only)
chmod +x run_migration.sh

# Run the migration script
./run_migration.sh
```

### Manual Migration:

If the automated scripts don't work, you can run the migration manually:

```bash
# Activate your conda base environment
conda activate base

# Navigate to backend directory
cd backend

# Run the migration script
python migrations/migrate_v1_to_v2.py
```

## What the Migration Does:

1. **Creates missing tables** if they don't exist:

   - `settings` - Stores website configuration
   - `heroes` - Stores hero section data
   - `projects` - Stores project information
   - `experiences` - Stores work experience data

2. **Adds missing columns** to existing tables:

   - Adds `created_at` and `updated_at` timestamps
   - Adds social media URL columns to settings
   - Ensures all columns have proper data types

3. **Creates default data**:
   - Inserts default settings if none exist

## Troubleshooting:

### Error: "Conda is not installed or not in PATH"

- Make sure Anaconda or Miniconda is installed
- Add conda to your system PATH
- Try opening "Anaconda Prompt" and running from there

### Error: "Please run this script from the backend directory"

- Navigate to the backend folder first: `cd backend`
- Then run the migration script

### Database Locked Error:

- Make sure the FastAPI backend server is not running
- Close any database browser tools that might have the database open
- Try running the migration again

## Backup:

Before running migrations, it's recommended to backup your database:

```bash
# In the backend directory
cp portfolio.db portfolio.db.backup
```

## Migration Log:

The migration script will show:

- Which tables were created/updated
- Which columns were added
- Final database statistics
- Any errors that occurred

If you encounter any issues, please check the error messages and ensure all prerequisites are met.
