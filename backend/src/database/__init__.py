from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "sqlite:///../app.sqlite3"


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
session = sessionmaker(autocommit=False, autoflus=False, bind=engine)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
