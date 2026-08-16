from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from routes.provider import generateFlashcard
from database import get_content_db, Note
from pydantic import BaseModel
from sqlalchemy import select 


Flashcard_router = APIRouter()

class FlashcardRequest(BaseModel):
    topic: str
    count: int

@Flashcard_router.post("/flashcards")
async def generate_flashcards(
    request: FlashcardRequest,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
    
):
    result = db.execute(select(Note).where(Note.user_id == user_id))
    notes = result.scalars().all()
    contexts = "".join(note.content for note in notes)
    print(contexts, request.count, request.topic)
    responseFlashcard = generateFlashcard(
    context=contexts,
    flashcard_count=request.count,
    topic=request.topic
)
    return responseFlashcard
    