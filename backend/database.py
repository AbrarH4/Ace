from sqlalchemy import create_engine, true, select
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from sqlalchemy import DateTime, UniqueConstraint

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'ace.db'}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False) 
    full_name: Mapped[str] = mapped_column(nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    default= datetime.now,
    nullable=False
)

CONTENT_DATABASE_URL = f"sqlite:///{BASE_DIR / 'content.db'}"

content_engine = create_engine(CONTENT_DATABASE_URL)
ContentSessionLocal = sessionmaker(bind=content_engine)
class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(nullable=False)
    filename: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
        nullable=False
    )
    __table_args__ = (
        UniqueConstraint("user_id", "filename"),
    )
def get_user_notes(db, user_id):
    result = db.execute(
        select(Note).where(Note.user_id == user_id)
    )

    notes = result.scalars().all()

    return {
        note.filename: note.content
        for note in notes
    }
def get_content_db():
    db = ContentSessionLocal()

    try:
        yield db
    finally:
        db.close()
        
Base.metadata.create_all(bind=engine, tables=[User.__table__])
Base.metadata.create_all(bind=content_engine, tables=[Note.__table__])