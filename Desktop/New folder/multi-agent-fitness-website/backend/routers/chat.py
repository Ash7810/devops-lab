from fastapi import APIRouter, Depends
from models import ChatMessage, ChatResponse
from routers.dependencies import get_current_user
from agents.orchestrator import orchestrator
from database import get_db

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Handle chat message with AI assistant"""
    
    # Get user profile
    user = await db.users.find_one({"_id": current_user["_id"]})
    user_profile = user.get("profile", {}) if user else {}
    user_profile["user_id"] = str(user["_id"])
    
    # Get recent user notes for context
    recent_notes = await db.notes.find(
        {"user_id": str(user["_id"])}
    ).sort("created_at", -1).limit(5).to_list(length=5)
    
    user_notes = "\n".join([note["content"] for note in recent_notes])
    
    # Get conversation history (optional, can be stored in DB)
    # For now, we'll generate without history
    
    # Generate response using orchestrator
    response = await orchestrator.handle_chat_message(
        message=message.message,
        user_profile=user_profile,
        conversation_history=None,  # Can be fetched from DB in future
        user_notes=user_notes
    )
    
    return ChatResponse(response=response)
