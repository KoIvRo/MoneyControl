from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DATABASE_URL = "sqlite:///../db.sqlite3"


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_db() -> None:
    """Создание базы данных."""
    # Если база уже есть, не выполняется
    Base.metadata.create_all(bind=engine)


def get_db():
    """Получение сессии с базой данных."""
    db = session()
    try:
        yield db
    finally:
        db.close()
