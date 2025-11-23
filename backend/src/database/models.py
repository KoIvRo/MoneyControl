from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey


class Base(DeclarativeBase):
    """Класс для ORM базы данных."""

    pass


class User(Base):
    """Модель аккаунта пользователя в базе данных."""

    __tablename__ = "users"
    id = Column(Integer(), primary_key=True, autoincrement=True, index=True)
    name = Column(String(20))
    email = Column(String(30))
    password = Column(String(256))


class Account(Base):
    """Банковские счета пользователя в базе данных."""

    __tablename__ = "accounts"
    id = Column(Integer(), primary_key=True, autoincrement=True, index=True)
    name = Column(String(20))
    balance = Column(Integer())
    user_id = Column(Integer(), ForeignKey("users.id", ondelete="CASCADE"))


class Transaction(Base):
    """Транзакции пользователя привязанные к счету."""

    __tablename__ = "transactions"
    id = Column(Integer(), primary_key=True, autoincrement=True, index=True)
    amount = Column(Integer())
    category = Column(String(20))
    date = Column(DateTime())
    comment = Column(String(100))
    account_id = Column(Integer(), ForeignKey("accounts.id", ondelete="CASCADE"))
    user_id = Column(Integer(), ForeignKey("users.id", ondelete="CASCADE"))
