from fastapi import APIRouter, Depends
from pydantic import BaseModel
import hashlib
from pwdlib import PasswordHash
from database import User, get_db

router_auth = APIRouter()

password_hash = PasswordHash.recommended()

class RegisterRequest(BaseModel):
    firstName: str
    email: str
    password: str

def get_passwordhash(password: str):
    return password_hash.hash(password)
    
@router_auth.post("/register")
def register(data: RegisterRequest, db=Depends(get_db)):
    new_user = User(first_name = data.firstName, email = data.email, password_hash = get_passwordhash(data.password) )
    db.add(new_user)
    db.commit()
    print("USER ID:", new_user.id)
    print("EMAIL:", new_user.email)