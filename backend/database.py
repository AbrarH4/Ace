from sqlalchemy import create_engine, true
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from sqlalchemy import DateTime


engine = create_engine("sqlite:///ace.db")
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False) 
    first_name: Mapped[str] = mapped_column(nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    default= datetime.now,
    nullable=False
)
Base.metadata.create_all(bind=engine)    