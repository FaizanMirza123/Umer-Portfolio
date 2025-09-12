from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
import json
import os
import uuid
from pathlib import Path

# Import local modules
from db import get_db, engine
from models import Base, Hero, Project, Experience, Settings
from schemas import (
    HeroCreate, HeroUpdate, Hero as HeroSchema,
    ProjectCreate, ProjectUpdate, Project as ProjectSchema,
    ExperienceCreate, ExperienceUpdate, Experience as ExperienceSchema,
    SettingsCreate, SettingsUpdate, Settings as SettingsSchema,
    UserLogin, Token, PortfolioData
)
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, ADMIN_USERNAME, ADMIN_PASSWORD, CORS_ORIGINS

# Create database tables
Base.metadata.create_all(bind=engine)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Portfolio API",
    description="API for managing portfolio website content",
    version="1.0.0"
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security setup
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Auth endpoints
@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    if user_data.username == ADMIN_USERNAME and user_data.password == ADMIN_PASSWORD:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Public endpoints
@app.get("/", response_model=PortfolioData)
async def get_portfolio_data(db: Session = Depends(get_db)):
    """Get all portfolio data for public view"""
    
    # Get hero data
    hero = db.query(Hero).first()
    
    # Get featured projects
    featured_projects = db.query(Project).filter(Project.is_featured == 1).all()
    
    # Get all projects
    projects = db.query(Project).all()
    
    # Get experiences
    experiences = db.query(Experience).all()
    
    # Get settings
    settings = db.query(Settings).first()
    if not settings:
        # Create default settings if none exist
        settings = Settings(
            font_size="medium", 
            theme="light",
            email="umer.saeed@example.com",
            github_url="https://github.com",
            linkedin_url="https://linkedin.com",
            twitter_url="https://twitter.com"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return PortfolioData(
        hero=hero,
        featured_projects=featured_projects,
        projects=projects,
        experiences=experiences,
        settings=settings
    )

# Hero endpoints
@app.get("/hero", response_model=Optional[HeroSchema])
async def get_hero(db: Session = Depends(get_db)):
    return db.query(Hero).first()

@app.post("/hero", response_model=HeroSchema)
async def create_or_update_hero(
    hero_data: HeroCreate, 
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    # Check if hero already exists
    existing_hero = db.query(Hero).first()
    
    if existing_hero:
        # Update existing hero
        for field, value in hero_data.dict().items():
            setattr(existing_hero, field, value)
        existing_hero.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_hero)
        return existing_hero
    else:
        # Create new hero
        db_hero = Hero(**hero_data.dict())
        db.add(db_hero)
        db.commit()
        db.refresh(db_hero)
        return db_hero

# Project endpoints
@app.get("/projects", response_model=List[ProjectSchema])
async def get_projects(
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if featured_only:
        query = query.filter(Project.is_featured == 1)
    return query.all()

@app.post("/projects", response_model=ProjectSchema)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    project_dict = project_data.dict()
    # Convert boolean to integer for SQLite
    project_dict['is_featured'] = 1 if project_dict.get('is_featured') else 0
    
    db_project = Project(**project_dict)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/projects/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_data.dict(exclude_unset=True)
    if 'is_featured' in update_data:
        update_data['is_featured'] = 1 if update_data['is_featured'] else 0
    
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db_project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

# Experience endpoints
@app.get("/experiences", response_model=List[ExperienceSchema])
async def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).all()

@app.post("/experiences", response_model=ExperienceSchema)
async def create_experience(
    experience_data: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_experience = Experience(**experience_data.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.put("/experiences/{experience_id}", response_model=ExperienceSchema)
async def update_experience(
    experience_id: int,
    experience_data: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    update_data = experience_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_experience, field, value)
    
    db_experience.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_experience)
    return db_experience

@app.delete("/experiences/{experience_id}")
async def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience deleted successfully"}

# Settings endpoints
@app.get("/settings", response_model=SettingsSchema)
async def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        # Create default settings if none exist
        settings = Settings(
            font_size="medium", 
            theme="light",
            email="umer.saeed@example.com",
            github_url="https://github.com",
            linkedin_url="https://linkedin.com",
            twitter_url="https://twitter.com"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/settings", response_model=SettingsSchema)
async def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_settings = db.query(Settings).first()
    if not db_settings:
        # Create new settings if none exist
        db_settings = Settings(font_size="medium", theme="light")
        db.add(db_settings)
        db.commit()
        db.refresh(db_settings)
    
    update_data = settings_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_settings, field, value)
    
    db_settings.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_settings)
    return db_settings


# File Upload Endpoint
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: str = Depends(verify_token)
):
    """Upload an image file and return the URL"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Only image files are allowed"
            )
        
        # Validate file size (max 5MB)
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 5MB"
            )
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Return the URL path
        file_url = f"/uploads/{unique_filename}"
        return {"message": "File uploaded successfully", "file_url": file_url}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")


# Toggle Project Featured Status
@app.patch("/projects/{project_id}/toggle-featured")
def toggle_project_featured(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    """Toggle the featured status of a project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Toggle the featured status
    project.is_featured = not project.is_featured
    project.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(project)
    
    return {
        "message": "Featured status updated successfully",
        "project_id": project_id,
        "is_featured": project.is_featured
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)