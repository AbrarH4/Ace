from fastapi import APIRouter, Body, Depends
from backend.routes.retrieval import Ranking_System, keyword, get_relevant_chunks
from backend.routes.provider import GenerateAnswer
from backend.auth.dependencies import get_current_user
from backend.database import get_content_db, get_user_notes

router_question = APIRouter()


@router_question.post("/question_input")
def receive_question(
    text: str = Body(..., embed=True),
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    keywords = keyword(text)
    notes = get_user_notes(db, user_id)

    if not notes:
        return {
            "response": "You haven't uploaded any notes yet. "
            "Upload a note first, then ask your question."
        }

    best_notes = Ranking_System(keywords, text, notes)

    try:
        chunks = [get_relevant_chunks(notes[name], keywords) for name in best_notes]
        context = "\n\n".join(chunks)
        response = GenerateAnswer(text, context)
    except Exception as e:
        print(e)
        response = ""

    return {"response": response}