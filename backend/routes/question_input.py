from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import select, delete

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
HISTORY_BUDGET = 6000

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
    if conversation_id:
        conversation = db.execute( # IMPORTANT BECAUSE WE ARE ASKING IF ANY CONVO LIKE THIS EXIST OR NOT
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
        ).scalar_one_or_none()

        if conversation is None:
            raise HTTPException(status_code=404, detail="CONVERSATION NOT FOUND")

    # Find the notes that match the question
    
    keywords = keyword(text)
                                # stop at the first (latest) one
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
    # Load the older messages of this chat (stays empty for a new chat)
    history = []
    if conversation is not None:
        rows = db.execute(
            select(Message.role, Message.content)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.id.desc())
            .limit(40)
        ).all()

        kept = []
        total = 0
        for row in rows:  # newest first
            total += len(row.content)
            if total > HISTORY_BUDGET:
                break
            kept.append(row)

        kept.reverse()  # oldest first, the order the AI needs

        if kept and kept[0].role == "assistant":
            kept.pop(0)  # its question was cut off, so drop it

        history = [{"role": row.role, "content": row.content} for row in kept]
    # Ask the AI
    
    if len(keywords) <= 3 and history:
            for message in reversed(history):        # newest first
                if message["role"] == "user":
                    keywords = keywords + keyword(message["content"])
                    break
    answer = GenerateAnswer(text, context = context, history = history)

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


@router_question.get("/conversations")
def list_conversations(
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    rows = db.execute(
        select(Conversation.id, Conversation.title, Conversation.updated_at)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()

    return [
        {"id": row.id, "title": row.title, "updated_at": row.updated_at}
        for row in rows
    ]


@router_question.get("/conversations/{conversation_id}")
def open_conversation(
    conversation_id: int,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    conversation = db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    ).scalar_one_or_none()
    if conversation is None:
        raise HTTPException(status_code=404, detail="CONVERSATION NOT FOUND")

    rows = db.execute(
        select(Message.role, Message.content, Message.created_at)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.id)
    ).all()

    return {
        "id": conversation.id,
        "title": conversation.title,
        "messages": [
            {"role": row.role, "content": row.content, "created_at": row.created_at}
            for row in rows
        ],
    }


@router_question.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    result = db.execute(
        delete(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="CONVERSATION NOT FOUND")

    db.commit()
    return {"deleted": True}