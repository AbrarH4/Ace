import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "ace-users-are-smart"
ALGORITHM = "HS256"

def create_access_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=180),
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token):
    try:
        verification = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError as esc:
        raise ValueError("Invalid token") from esc

    return verification['sub']  