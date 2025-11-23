from pydantic import BaseModel, EmailStr
from datetime import datetime


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


class TransactionCreate(BaseModel):
    """Модель для создания транзакции."""

    amount: int
    category: str
    date: datetime
    comment: str
    account_id: int
