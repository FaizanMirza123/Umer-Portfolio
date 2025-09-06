from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

# Hero Schemas
class HeroBase(BaseModel):
    name: str
    title: str
    description: str
    profile_image: Optional[str] = None

class HeroCreate(HeroBase):
    pass

class HeroUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    profile_image: Optional[str] = None

class Hero(HeroBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Add property to map snake_case to camelCase for frontend
    @property
    def profileImage(self):
        return self.profile_image

    class Config:
        from_attributes = True
        # Enable this to include computed properties in JSON response
        arbitrary_types_allowed = True
        
    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        # Add camelCase version for frontend compatibility
        data['profileImage'] = data.get('profile_image')
        return data

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = []
    is_featured: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    is_featured: Optional[bool] = None

class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Experience Schemas
class ExperienceBase(BaseModel):
    title: str
    company: str
    duration: str
    location: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = []

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None

class Experience(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Auth Schemas
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Portfolio Data Schema
class PortfolioData(BaseModel):
    hero: Optional[Hero] = None
    featured_projects: List[Project] = []
    projects: List[Project] = []
    experiences: List[Experience] = []