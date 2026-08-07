from sqlalchemy import select
from database import SessionLocal, User

db = SessionLocal()

statement = select(User)

result = db.execute(statement)

users = result.scalars().all()

for user in users:
    print(user.first_name)

db.close()