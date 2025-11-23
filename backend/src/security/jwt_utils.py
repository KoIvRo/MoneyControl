import jwt


SECRET_KEY = "KEY"
ALGORITHM = "HS256"


def verify_jwt(token: str) -> dict:
    """Расшифровка jwt токена"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except Exception:
        return None


def create_token(user_id: int):
    """Создание access токена."""
    payload = {"user_id": user_id, "type": "access"}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
