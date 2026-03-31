from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileCreate(BaseModel):
    age: int
    weight: float
    height: float
    goals: List[str]
    preferences: Optional[str] = ""
    health_conditions: Optional[str] = ""

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    profile: Optional[dict] = None

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class NoteCreate(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: str
    content: str
    created_at: datetime

class PlanResponse(BaseModel):
    workout: str
    diet: str
    date: str
