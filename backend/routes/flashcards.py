from fastapi import APIRouter, Depends
from fastapi.responses import Response
from backend.auth.dependencies import get_current_user
from backend.routes.provider import generateFlashcard
from backend.database import get_content_db, Note
from pydantic import BaseModel
from sqlalchemy import select 
import json

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
    # print(contexts, request.count, request.topic)
    responseFlashcard = generateFlashcard(
    context=contexts,
    flashcard_count=request.count,
    topic=request.topic
)
    return responseFlashcard


class flashcard_export(BaseModel):
    question: list[str]
    answer: list[str]
@Flashcard_router.post("/exportflashcard")
def export_flashcard(flashcards:flashcard_export): #  WE NEED THE LISTS OF QUESTION AND ANSWER SO THAT WE CAN LOOP THROUGH EACH
    flashcards_list = [] 
    if len(flashcards.question) != len(flashcards.answer):
        if len(flashcards.question) > len(flashcards.answer):
                difference = len(flashcards.question) - len(flashcards.answer)
                for i in range(difference):
                    flashcards.answer.append("")
        else:
                if len(flashcards.answer) > len(flashcards.question):
                                difference = len(flashcards.answer) - len(flashcards.question)
                                for i in range(difference):
                                    flashcards.question.append("QUESTION")
    for question, answer in zip(flashcards.question, flashcards.answer):
        flashcards_list.append(f"{question}\t{answer}") # LATER PARSE THIS INTO JSON FOR RETURNING
    file_text = "\n".join(flashcards_list)
    return Response(
    content=file_text,
    media_type="text/plain",
    headers={
        "Content-Disposition": 'attachment; filename="ace_flashcards.txt"'
    }
) # FRONTEND WILL RECEIVE THIS AND LET THE USER EXPORT THE FLASHCARDS