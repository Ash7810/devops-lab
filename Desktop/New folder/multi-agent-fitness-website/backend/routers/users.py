from fastapi import APIRouter, Depends
from datetime import datetime
from models import ProfileCreate
from routers.dependencies import get_current_user
from database import get_db

router = APIRouter()

@router.post("/profile")
async def update_profile(
    profile: ProfileCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Update user profile"""
    profile_dict = {
        "age": profile.age,
        "weight": profile.weight,
        "height": profile.height,
        "goals": profile.goals,
        "preferences": profile.preferences,
        "health_conditions": profile.health_conditions,
        "updated_at": datetime.utcnow()
    }
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile": profile_dict}}
    )
    
    return {"message": "Profile updated successfully"}
