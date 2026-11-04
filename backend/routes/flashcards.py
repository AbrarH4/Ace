from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from backend.auth.dependencies import get_current_user
from backend.routes.provider import generateFlashcard
from backend.database import get_content_db, Note, FlashcardSet 
from pydantic import BaseModel
from sqlalchemy import select , delete
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
    if responseFlashcard:
        try:
            flashcard_row = FlashcardSet(user_id = user_id, title = request.topic.strip() or "ALL MY SETS", topic = request.topic or "ALL MY SETS", card_count = request.count, cards = responseFlashcard)
            db.add(flashcard_row)
            db.commit()
        except Exception as e:
            db.rollback()
            print(e)    
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
    
    
@Flashcard_router.get("/flashcards-set")
def list_flashcard(user_id = Depends(get_current_user), db = Depends(get_content_db)):
   
    rows = db.execute(select(FlashcardSet.id, FlashcardSet.title, FlashcardSet.card_count, FlashcardSet.created_at).where(FlashcardSet.user_id == user_id).order_by(FlashcardSet.created_at.desc())).all()
    return [
        
        {"id": row.id, "title":row.title, "card_count": row.card_count, "created_at": row.created_at}
        for row in rows
    ]    
    
@Flashcard_router.get("/flashcards-set/{set_id}")
def open_flashcard(set_id:int, user_id = Depends(get_current_user), db = Depends(get_content_db)):
    
    flashcard_result = db.execute(select(FlashcardSet.cards).where(FlashcardSet.id == set_id, FlashcardSet.user_id == user_id)).scalar_one_or_none()
    if flashcard_result is None:
        raise HTTPException(status_code=404, detail="FLASHCARDS NOT FOUND!")
    return flashcard_result
        
        
@Flashcard_router.delete("/flashcards-set/{set_id}")
def delete_flashcard(set_id: int, user_id=Depends(get_current_user), db=Depends(get_content_db)):
    result = db.execute(delete(FlashcardSet).where(user_id == FlashcardSet.user_id, set_id == FlashcardSet.id))
    if result.rowcount == 0:
        raise HTTPException(
            status_code= 404,
            detail = 'Set not found!'
            )
        
    db.commit()
    return "SET DELETED SUCCESSFULLY."
    