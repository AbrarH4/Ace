from fastapi import Cookie, HTTPException
from auth.security import verify_access_token

def get_current_user(access_token: str | None = Cookie(default=None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not Authenticated!")
    user_id = verify_access_token(access_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Token!")
    return user_id