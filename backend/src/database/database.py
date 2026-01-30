import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{os.getenv('POSTGRES_USER', 'admin')}:"
    f"{os.getenv('POSTGRES_PASSWORD', 'admin')}@"
    f"{os.getenv('POSTGRES_HOST', 'postgres')}:"
    f"{os.getenv('POSTGRES_PORT', '5432')}/"
    f"{os.getenv('POSTGRES_DB', 'moneycontrol')}"
)

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def create_db() -> None:
    """Создание базы данных."""
    # Если база уже есть, не выполняется
    Base.metadata.create_all(bind=engine)


def get_db():
    """Получение сессии с базой данных."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
