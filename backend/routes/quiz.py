from fastapi import APIRouter, Depends, HTTPException
from backend.auth.dependencies import get_current_user
from backend.routes.GenQuiz import get_quiz_context, test_evaluation
from backend.database import get_content_db
from backend.database import Note, QuizSet, QuizAttempts
from backend.routes.provider import GenerateQuiz
from pydantic import BaseModel
from sqlalchemy import select, delete

from backend.database import get_user_notes


Quiz_router = APIRouter()


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: str

class QuizEvaluationRequest(BaseModel):
    quiz: list[QuizQuestion]
    selectedAnswers: list[str]
    quiz_id: int | None = None

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
    if context is None:
        raise HTTPException(status_code=404, detail="UPLOAD NOTES FIRST!")
    generated_quiz = GenerateQuiz(
        context=context,
        quiz_count=request.count
    )
    quiz_id = None
    if generated_quiz:
        try:
            row = QuizSet(user_id = user_id, topic = request.topic.strip() or "ALL", title = request.topic.strip() or "ALL", question_count = request.count, questions = generated_quiz)
            db.add(row)
            db.commit()
            quiz_id = row.id
        except Exception as e:
            db.rollback()
            print(e)
        
    return {"quiz_id":quiz_id, "quiz": generated_quiz}

@Quiz_router.post("/quiz/evaluation")
def evaluation(request: QuizEvaluationRequest, user_id=Depends(get_current_user), db = Depends(get_content_db)):
    results = []
    if len(request.quiz) != len(request.selectedAnswers):
        raise HTTPException(
            status_code=400,
            detail="Number of answers does not match number of questions."
    )
         
    for question, user_answer in zip(request.quiz, request.selectedAnswers):
        result = test_evaluation(user_answer= user_answer, correct_answer= question.answer, explanation=question.explanation)
        results.append(result)
    if request.quiz_id:
        query = db.execute(select(QuizSet).where(QuizSet.user_id == user_id, QuizSet.id == request.quiz_id)).scalar_one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail = "QUIZ NOT FOUND!")
        
        score = sum(1 for result in results if result["correct"])
        total = len(results)
        try:
            attempt = QuizAttempts(user_id = user_id, quiz_id = request.quiz_id, score = score, total = total, answers = request.selectedAnswers)
            db.add(attempt)
            db.commit()
        except Exception as e:
            db.rollback()
            print(e)
            
    return results
    
    
@Quiz_router.get("/quizzes")
def list_Quizzes(user_id = Depends(get_current_user), db = Depends(get_content_db)):
    rows = db.execute(select(QuizSet.id, QuizSet.title, QuizSet.question_count, QuizSet.created_at).where(QuizSet.user_id == user_id).order_by(QuizSet.created_at.desc())).all()
    return [
            
            {"id": row.id, "title":row.title, "question_count": row.question_count, "created_at": row.created_at}
            for row in rows
        ]  
    
@Quiz_router.get("/quizzes/{quiz_id}")
def open_quiz(  quiz_id: int, user_id = Depends(get_current_user), db = Depends(get_content_db)):
    result = db.execute(select(QuizSet.questions).where(QuizSet.user_id == user_id, QuizSet.id == quiz_id)).scalar_one_or_none()
    if result is None:
        raise HTTPException(status_code=404, detail="QUIZ NOT FOUND!")
    return result

@Quiz_router.delete("/quizzes/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    result = db.execute(
        delete(QuizSet).where(QuizSet.id == quiz_id, QuizSet.user_id == user_id)
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="QUIZ NOT FOUND")

    db.commit()
    return {"deleted": True}

@Quiz_router.get("/quizzes/{quiz_id}/attempts")
def list_attempts(
    quiz_id: int,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    # the quiz must belong to this user
    owned_quiz = db.execute(
        select(QuizSet.id).where(QuizSet.id == quiz_id, QuizSet.user_id == user_id)
    ).scalar_one_or_none()
    if owned_quiz is None:
        raise HTTPException(status_code=404, detail="QUIZ NOT FOUND")

    rows = db.execute(
        select(
            QuizAttempts.id,
            QuizAttempts.score,
            QuizAttempts.total,
            QuizAttempts.created_at,
        )
        .where(QuizAttempts.quiz_id == quiz_id)
        .order_by(QuizAttempts.created_at.desc())
    ).all()

    return [
        {
            "id": row.id,
            "score": row.score,
            "total": row.total,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@Quiz_router.get("/quiz-attempts/{attempt_id}")
def open_attempt(
    attempt_id: int,
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    attempt = db.execute(
        select(QuizAttempts).where(QuizAttempts.id == attempt_id)
    ).scalar_one_or_none()
    if attempt is None:
        raise HTTPException(status_code=404, detail="ATTEMPT NOT FOUND")

    # the attempt's quiz must belong to this user
    questions = db.execute(
        select(QuizSet.questions).where(
            QuizSet.id == attempt.quiz_id, QuizSet.user_id == user_id
        )
    ).scalar_one_or_none()
    if questions is None:
        raise HTTPException(status_code=404, detail="ATTEMPT NOT FOUND")

    return {
        "quiz_id": attempt.quiz_id,
        "quiz": questions,
        "selectedAnswers": attempt.answers,
    }



                                                                             
                                                                             
                                                                             
                                                                             
                                                                             