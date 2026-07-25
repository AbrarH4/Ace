from fastapi import APIRouter, Body
router_question = APIRouter()
from routes.retrieval import Ranking_System, keyword
from routes import loader
from routes.provider import GenerateAnswer
model_loaded = False
@router_question.post('/question_input')
async def receive_question(text: str = Body(..., embed=True)):
    global model_loaded
    print(text)
    _, model_loaded = loader.bg_model_loading()
    if not model_loaded:
        loader.bg_model_loading()
        model_loaded = True
    keywords = keyword(text)
    bestnote,_ = Ranking_System(keywords, text)
    contents = [] 
    try:  
        for top_note in bestnote:
            content = loader.Notes[top_note]
            contents.append(content)
        context = "\n\n".join(contents)
        response = GenerateAnswer(text, context)
    except Exception as e:
        print(type(bestnote))
        response = ""
    return {"answer": response}
    