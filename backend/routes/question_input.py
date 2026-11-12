from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import select

from backend.auth.dependencies import get_current_user
from backend.database import (
    Conversation,
    Message,
    get_content_db,
    get_user_notes,
    utc_now,
)
from backend.routes.provider import GenerateAnswer
from backend.routes.retrieval import Ranking_System, get_relevant_chunks, keyword

router_question = APIRouter()


@router_question.post("/question_input")
def receive_question(
    text: str = Body(..., embed=True),
    conversation_id: int | None = Body(None, embed=True),
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    if len(text) > 4000:
        raise HTTPException(status_code=400, detail="Your question is too long.")

    # If an id came in, find that conversation now.
    # It must match the id AND the logged-in user, otherwise: 404.
    conversation = None
    if conversation_id is not None:
        conversation = db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
        ).scalar_one_or_none()

        if conversation is None:
            raise HTTPException(status_code=404, detail="CONVERSATION NOT FOUND")

    # Find the notes that match the question
    keywords = keyword(text)
    notes = get_user_notes(db = db, user_id=user_id)

    if not notes:
        return {
            "response": "You haven't uploaded any notes yet. "
            "Upload a note first, then ask your question.",
            "conversation_id": conversation_id,
        }

    best_notes = Ranking_System(keywords, text, notes)
    chunks = [get_relevant_chunks(notes[name], keywords) for name in best_notes]
    context = "\n\n".join(chunks)

    # Ask the AI
    answer = GenerateAnswer(text, context)

    if answer is None:
        raise HTTPException(
            status_code=503,
            detail="The AI is busy, please try again in a moment.",
        )

    # Save everything, then commit once
    try:
        if conversation is None:
            conversation = Conversation(user_id=user_id, title=text.strip()[:40])
            db.add(conversation)
            db.flush()  # Postgres assigns the new conversation its id
        else:
            conversation.updated_at = utc_now()

        saved_id = conversation.id

        db.add_all(
            [
                Message(conversation_id=saved_id, role="user", content=text),
                Message(conversation_id=saved_id, role="assistant", content=answer),
            ]
        )
        db.commit()

        conversation_id = saved_id
    except Exception as e:
        db.rollback()
        print(e)

    return {"response": answer, "conversation_id": conversation_id}