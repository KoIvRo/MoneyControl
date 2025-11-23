from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["pbkdf2_sha256"])


def get_pass_hash(password: str) -> str:
    """Хэширование пароля."""
    return pwd_context.hash(password)


def verify_pass(password: str, hashed_password: str) -> bool:
    """Проверка пароля на совпадение хэшу."""
    return pwd_context.verify(password, hashed_password)
