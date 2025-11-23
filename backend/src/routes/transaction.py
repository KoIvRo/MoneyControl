from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from database.models import Transaction
from database.database import get_db


transaction_router = APIRouter()


@transaction_router.get("/{id}")
def transaction_get(id: int, request: Request, db: Session = Depends(get_db)):
    """Получение информации о транзакции."""
    request_user = request.state.user

    transaction = db.query(Transaction).filter(Transaction.id == id).first()

    if not transaction:
        raise HTTPException(status_code=404)
    
    if transaction.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    return {"transaction": transaction}