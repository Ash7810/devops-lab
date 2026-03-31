from fastapi import APIRouter, Depends
from models import NoteCreate, NoteResponse
from routers.dependencies import get_current_user
from database import get_db
from datetime import datetime

router = APIRouter()

@router.post("", response_model=NoteResponse)
async def create_note(
    note: NoteCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Save user note/feedback"""
    
    # Save note to database
    note_dict = {
        "user_id": str(current_user["_id"]),
        "content": note.content,
        "created_at": datetime.utcnow()
    }
    
    result = await db.notes.insert_one(note_dict)
    
    # Process feedback through orchestrator
    user = await db.users.find_one({"_id": current_user["_id"]})
    user_profile = user.get("profile", {}) if user else {}
    user_profile["user_id"] = str(user["_id"])
    
    # Add to RAG knowledge base
    from services.rag_service import rag_service
    rag_service.add_user_note(str(current_user["_id"]), note.content)
    
    return NoteResponse(
        id=str(result.inserted_id),
        content=note.content,
        created_at=note_dict["created_at"]
    )

@router.get("", response_model=list[NoteResponse])
async def get_notes(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
    limit: int = 20
):
    """Get user's notes"""
    
    notes = await db.notes.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).limit(limit).to_list(length=limit)
    
    return [
        NoteResponse(
            id=str(note["_id"]),
            content=note["content"],
            created_at=note["created_at"]
        )
        for note in notes
    ]
