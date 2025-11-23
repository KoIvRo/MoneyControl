from passlib.context import CryptContext

# Используем pbkdf2_sha256 - надежно и без проблем с длиной
pwd_context = CryptContext(schemes=["pbkdf2_sha256"])

def get_pass_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_pass(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)