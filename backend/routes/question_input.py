from fastapi import APIRouter, Body, Depends
router_question = APIRouter()
from backend.routes.retrieval import Ranking_System, keyword
from backend.routes import loader
from backend.routes.provider import GenerateAnswer
from backend.auth.dependencies import get_current_user
from backend.database import get_content_db, get_user_notes


model_loaded = False
@router_question.post('/question_input')
async def receive_question(text: str = Body(..., embed=True),user_id=Depends(get_current_user),
    db=Depends(get_content_db),):
    global model_loaded
    _, model_loaded = loader.bg_model_loading()
    if not model_loaded:
        loader.bg_model_loading()
        model_loaded = True
    keywords = keyword(text)
    notes = get_user_notes(db, user_id)
    bestnote,_ = Ranking_System(keywords, text, notes )
    contents = [] 
    try:  
        for top_note in bestnote:
            content = notes[top_note]
            contents.append(content)
        context = "\n\n".join(contents)
        response = GenerateAnswer(text, context)
    except Exception as e:
        print(e)
        response = ""
    return {"response": response}
    