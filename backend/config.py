import os
from decouple import config

# Database Configuration
DATABASE_URL = config("DATABASE_URL", default="sqlite:///./portfolio.db")

# Security Configuration
SECRET_KEY = config("SECRET_KEY", default="your-secret-key-here-please-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Admin Configuration
ADMIN_USERNAME = config("ADMIN_USERNAME", default="umar_saeed")
ADMIN_PASSWORD = config("ADMIN_PASSWORD", default="Umar_Saeed_13579")

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://umer-saeed.vercel.app"
]