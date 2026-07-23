from fastapi import APIRouter, Body
router_question = APIRouter()

@router_question.post('/question_input')
async def receive_question(text: str = Body(..., embed=True)):
    print(text)