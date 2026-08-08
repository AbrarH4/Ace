from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.notes import router
from routes.question_input import router_question
from routes.auth import router_auth
app = FastAPI()
app.include_router(router)
app.include_router(router_question)
app.include_router(router_auth, prefix="/auth")
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