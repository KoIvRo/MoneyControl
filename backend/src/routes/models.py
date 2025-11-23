from pydantic import BaseModel, EmailStr


class UserRegistration(BaseModel):
    """Модель для регистрации."""

    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    """Модель для логина."""

    email: EmailStr
    password: str
