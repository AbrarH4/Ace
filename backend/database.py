import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import DateTime, UniqueConstraint, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

BASE_DIR = Path(__file__).resolve().parent

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_KEY")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_KEY is not set. Add it to your .env file "
        "or to your host's environment variables."
    )
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
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
        default=datetime.now,
        nullable=False
    )


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


# Notes now live in the same Neon database as users.
# These aliases keep any other file that imports the old names working.
content_engine = engine
ContentSessionLocal = SessionLocal
get_content_db = get_db


def get_user_notes(db, user_id):
    result = db.execute(
        select(Note).where(Note.user_id == user_id)
    )

    notes = result.scalars().all()

    return {
        note.filename: note.content
        for note in notes
    }


Base.metadata.create_all(bind=engine)