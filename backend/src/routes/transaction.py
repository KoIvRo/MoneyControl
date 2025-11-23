from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from database.models import Transaction, Account
from database.database import get_db
from .models import TransactionCreate


transaction_router = APIRouter()


@transaction_router.post("/")
async def transaction_add(data: TransactionCreate, request: Request, db: Session = Depends(get_db)):
    """Создание транзакции."""

    request_user = request.state.user

    new_transaction = Transaction(
        user_id=request_user["user_id"],
        amount=data.amount,
        category=data.category,
        date=data.date,
        comment=data.comment,
        account_id=data.account_id
    )

    existing_account = db.query(Account).filter(Account.id == data.account_id).first()
    if not existing_account:
        raise HTTPException(status_code=404)
    if existing_account.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    existing_account.balance += data.amount
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return {"transaction": new_transaction}


@transaction_router.delete("/{id}")
async def transaction_delete(id: int, request: Request, db: Session = Depends(get_db)):
    """Удаление транзакции."""
    request_user = request.state.user

    transaction = db.query(Transaction).filter(Transaction.id == id).first()

    if not transaction:
        raise HTTPException(status_code=404)
    if transaction.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    existing_account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if not existing_account:
        raise HTTPException(status_code=404)
    if existing_account.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    existing_account.balance -= transaction.amount

    db.delete(transaction)
    db.commit()

    return {"detail": "Transaction deleted"}


@transaction_router.get("/income")
async def transaction_income_get(request: Request, db: Session = Depends(get_db)):
    """Получение доходов."""
    request_user = request.state.user

    transactions = db.query(Transaction).filter(Transaction.amount > 0).filter(Transaction.user_id == request_user["user_id"]).all()

    if not transactions:
        raise HTTPException(status_code=404)
    
    return {"transactions": transactions}


@transaction_router.get("/consumption")
async def transaction_consumption_get(request: Request, db: Session = Depends(get_db)):
    """Получение расходов."""
    request_user = request.state.user

    transactions = db.query(Transaction).filter(Transaction.amount < 0).filter(Transaction.user_id == request_user["user_id"]).all()

    if not transactions:
        raise HTTPException(status_code=404)
    
    return {"transactions": transactions}


@transaction_router.get("/{id}")
async def transaction_get(id: int, request: Request, db: Session = Depends(get_db)):
    """Получение информации о транзакции."""
    request_user = request.state.user

    transaction = db.query(Transaction).filter(Transaction.id == id).first()

    if not transaction:
        raise HTTPException(status_code=404)
    
    if transaction.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    return {"transaction": transaction}
