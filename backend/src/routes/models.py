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


class AccountCreate(BaseModel):
    """Модель для создания счета."""

    name: str
    balance: int
