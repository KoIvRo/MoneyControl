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
    except:
        return None


def create_jwt():
    pass