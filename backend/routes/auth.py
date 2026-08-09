from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import hashlib
from pwdlib import PasswordHash
from database import User, get_db
from sqlalchemy import select


router_auth = APIRouter()

password_hash = PasswordHash.recommended()

class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str

def get_passwordhash(password: str):
    return password_hash.hash(password)
    
@router_auth.post("/register")
def register(data: RegisterRequest, db=Depends(get_db)):
    existing_user = db.scalar(
    select(User).where(User.email == data.email)
)
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="⚠  An account with this email already exists."
        )
    new_user = User(full_name = data.fullName, email = data.email, password_hash = get_passwordhash(data.password) )
    db.add(new_user)
    db.commit()
    