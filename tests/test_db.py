import sys
from pathlib import Path
from sqlalchemy import text

project_root = Path(__file__).parent.parent
backend_src = project_root / "backend" / "src"

sys.path.append(str(backend_src))

from database.database import create_db, get_db


class TestDatabase:
    """Тест функционала бд."""

    def test_database_created(self) -> None:
        """БД создается."""
        try:
            create_db()
        except Exception as e:
            print(e)
            assert False
        else:
            assert True

    def test_database_indepotent(self) -> None:
        """Индепотентное создание базы данных."""
        try:
            create_db()
            create_db()
            create_db()
        except Exception as e:
            print(e)
            assert False
        else:
            assert True

    def test_get_db(self) -> None:
        """Получение коннекта к бд."""
        db_gen = get_db()
        db = next(db_gen)

        result = db.execute(text("SELECT 1"))

        assert result.scalar() == 1

    def test_table_exists(self) -> None:
        tables = ["users", "accounts", "transactions"]
        create_db()
        db_gen = get_db()
        db = next(db_gen)

        result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
        result = {row[0] for row in result}

        for table in tables:
            if table not in result:
                assert False

        assert True
