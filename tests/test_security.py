import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
backend_src = project_root / "backend" / "src"

sys.path.append(str(backend_src))

from security.jwt_utils import verify_jwt, create_token
from security.pass_utils import get_pass_hash, verify_pass


class TestJWT:
    """Тестирование jwt утилит."""

    TOKEN = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJ1c2VyX2lkIjoxLCJ0eXBlIjoiYWNjZXNzIn0."
        "6sCAY8zwf8ucfZCDiGiYve8KgiZU7SLurxMK9o2hiSw"
    )
    USER_ID = 1

    def test_create_jwt(self) -> None:
        assert self.TOKEN == create_token(self.USER_ID)

    def test_verify_jwt(self) -> None:
        assert verify_jwt(self.TOKEN).get("type", None) == "access"


class TestPass:
    """Тестирование паролей."""

    PASSWORD = "admin"

    def test_pass_hash(self) -> None:
        """Хэширование."""
        assert get_pass_hash(self.PASSWORD).startswith("$pbkdf2-sha256$")

    def test_verify_pass(self) -> None:
        """Верификация пароля."""
        hashed_pass = get_pass_hash(self.PASSWORD)
        assert verify_pass(self.PASSWORD, hashed_pass)
