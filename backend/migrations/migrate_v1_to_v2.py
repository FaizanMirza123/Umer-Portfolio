#!/usr/bin/env python3
"""
Migration script to update database schema for portfolio website
This script ensures all tables and columns exist with proper data types.

Run this with: python migrate_v1_to_v2.py
"""

import sqlite3
import json
import os
from datetime import datetime

# Database file path
DB_PATH = "portfolio.db"

def run_migration():
    """Run database migration to ensure schema compatibility"""
    print("Starting database migration...")
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Create tables if they don't exist
        print("Creating/updating tables...")
        
        # Settings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY,
                font_size VARCHAR(10) DEFAULT 'medium',
                theme VARCHAR(10) DEFAULT 'light',
                email VARCHAR(255),
                github_url VARCHAR(255),
                linkedin_url VARCHAR(255),
                twitter_url VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Heroes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS heroes (
                id INTEGER PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                profile_image VARCHAR(500),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Projects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(500),
                github_url VARCHAR(500),
                live_url VARCHAR(500),
                technologies TEXT,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Experiences table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS experiences (
                id INTEGER PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                company VARCHAR(200) NOT NULL,
                duration VARCHAR(100) NOT NULL,
                location VARCHAR(200),
                description TEXT,
                skills TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Check if we need to add new columns to existing tables
        print("Checking for missing columns...")
        
        # Get existing columns for each table
        def get_columns(table_name):
            cursor.execute(f"PRAGMA table_info({table_name})")
            return [column[1] for column in cursor.fetchall()]
        
        # Check settings table columns
        if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'").fetchone():
            settings_columns = get_columns('settings')
            new_columns = []
            
            if 'email' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN email VARCHAR(255)")
            if 'github_url' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN github_url VARCHAR(255)")
            if 'linkedin_url' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN linkedin_url VARCHAR(255)")
            if 'twitter_url' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN twitter_url VARCHAR(255)")
            if 'created_at' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            if 'updated_at' not in settings_columns:
                new_columns.append("ALTER TABLE settings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            
            for column_sql in new_columns:
                print(f"Adding column: {column_sql}")
                cursor.execute(column_sql)
        
        # Check heroes table columns
        if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='heroes'").fetchone():
            heroes_columns = get_columns('heroes')
            new_columns = []
            
            if 'created_at' not in heroes_columns:
                new_columns.append("ALTER TABLE heroes ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            if 'updated_at' not in heroes_columns:
                new_columns.append("ALTER TABLE heroes ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            
            for column_sql in new_columns:
                print(f"Adding column: {column_sql}")
                cursor.execute(column_sql)
        
        # Check projects table columns
        if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").fetchone():
            projects_columns = get_columns('projects')
            new_columns = []
            
            if 'created_at' not in projects_columns:
                new_columns.append("ALTER TABLE projects ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            if 'updated_at' not in projects_columns:
                new_columns.append("ALTER TABLE projects ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            
            for column_sql in new_columns:
                print(f"Adding column: {column_sql}")
                cursor.execute(column_sql)
        
        # Check experiences table columns
        if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='experiences'").fetchone():
            experiences_columns = get_columns('experiences')
            new_columns = []
            
            if 'created_at' not in experiences_columns:
                new_columns.append("ALTER TABLE experiences ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            if 'updated_at' not in experiences_columns:
                new_columns.append("ALTER TABLE experiences ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            
            for column_sql in new_columns:
                print(f"Adding column: {column_sql}")
                cursor.execute(column_sql)
        
        # Insert default settings if none exist
        cursor.execute("SELECT COUNT(*) FROM settings")
        if cursor.fetchone()[0] == 0:
            print("Creating default settings...")
            cursor.execute("""
                INSERT INTO settings (font_size, theme, email, github_url, linkedin_url, twitter_url)
                VALUES ('medium', 'light', 'umer.saeed@example.com', 'https://github.com', 'https://linkedin.com', 'https://twitter.com')
            """)
        
        # Commit changes
        conn.commit()
        print("Migration completed successfully!")
        
        # Show table stats
        cursor.execute("SELECT COUNT(*) FROM settings")
        settings_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM heroes")
        heroes_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM projects")
        projects_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM experiences")
        experiences_count = cursor.fetchone()[0]
        
        print(f"\nDatabase Statistics:")
        print(f"Settings: {settings_count} record(s)")
        print(f"Heroes: {heroes_count} record(s)")
        print(f"Projects: {projects_count} record(s)")
        print(f"Experiences: {experiences_count} record(s)")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()
