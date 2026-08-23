from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_current_user
from routes.GenQuiz import get_quiz_context, test_evaluation
from database import get_content_db
from database import Note
from routes.provider import GenerateQuiz
from pydantic import BaseModel
from sqlalchemy import select

from database import get_user_notes


Quiz_router = APIRouter()


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: str

class QuizEvaluationRequest(BaseModel):
    quiz: list[QuizQuestion]
    selectedAnswers: list[str]

class ReceiveTypes(BaseModel):
    topic: str
    count: int
    



@Quiz_router.post("/quiz")
def Gen_Quiz(
    request: ReceiveTypes,
    db=Depends(get_content_db),
    user_id=Depends(get_current_user)
):
    notes = get_user_notes(db, user_id)

    context = get_quiz_context(
        notes=notes,
        topic=request.topic
    )

    generated_quiz = GenerateQuiz(
        context=context,
        quiz_count=request.count
    )

    return generated_quiz

@Quiz_router.post("/quiz/evaluation")
def evaluation(request: QuizEvaluationRequest):
    results = []
    if len(request.quiz) != len(request.selectedAnswers):
        raise HTTPException(
            status_code=400,
            detail="Number of answers does not match number of questions."
    )
         
    for question, user_answer in zip(request.quiz, request.selectedAnswers):
        result = test_evaluation(user_answer= user_answer, correct_answer= question.answer, explanation=question.explanation)
        results.append(result)
    return results
    