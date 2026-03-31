from fastapi import APIRouter, Depends, HTTPException
from models import PlanResponse
from routers.dependencies import get_current_user
from agents.orchestrator import orchestrator
from database import get_db
from datetime import datetime

router = APIRouter()

@router.get("/daily", response_model=PlanResponse)
async def get_daily_plan(
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Get today's workout and diet plan"""
    
    # Get user profile
    user = await db.users.find_one({"_id": current_user["_id"]})
    if not user or not user.get("profile"):
        raise HTTPException(status_code=400, detail="User profile not complete")
    
    user_profile = user["profile"]
    user_profile["user_id"] = str(user["_id"])
    
    # Get recent user notes
    recent_notes = await db.notes.find(
        {"user_id": str(user["_id"])}
    ).sort("created_at", -1).limit(5).to_list(length=5)
    
    user_notes = "\n".join([note["content"] for note in recent_notes])
    
    # Generate daily plan
    plan = await orchestrator.generate_daily_plan(user_profile, user_notes)
    
    return PlanResponse(
        workout=plan["workout"],
        diet=plan["diet"],
        date=datetime.utcnow().isoformat()
    )
