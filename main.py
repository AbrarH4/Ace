from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.quiz import Quiz_router
from backend.routes.notes import router
from backend.routes.question_input import router_question
from backend.routes.auth import router_auth
from backend.routes.flashcards import Flashcard_router
from backend.auth.dependencies import current_router
from backend.routes.cronjob import cron

app = FastAPI()
app.include_router(router)
app.include_router(router_question)
app.include_router(router_auth, prefix="/auth")
app.include_router(Flashcard_router)
app.include_router(Quiz_router)
app.include_router(current_router)
app.include_router(cron)
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)