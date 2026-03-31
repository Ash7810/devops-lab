from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from database import get_db
from models import UserCreate, UserLogin, UserResponse
from services.auth_service import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    decode_token
)
from routers.dependencies import get_current_user
from datetime import datetime
from bson import ObjectId
import secrets

router = APIRouter()

@router.post("/signup", response_model=dict)
async def signup(user_data: UserCreate, db=Depends(get_db)):
    """Create new user account"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = {
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": get_password_hash(user_data.password),
        "profile": None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    
    # Create token
    token = create_access_token(data={"sub": str(result.inserted_id), "email": user_data.email})
    
    return {"token": token, "user": {"id": user_dict["id"], "name": user_data.name, "email": user_data.email}}

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin, db=Depends(get_db)):
    """Login and get access token"""
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(data={"sub": str(user["_id"]), "email": user["email"]})
    
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "profile": user.get("profile")
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user=Depends(get_current_user), db=Depends(get_db)):
    """Get current user information"""
    user = await db.users.find_one({"_id": current_user["_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "profile": user.get("profile")
    }
