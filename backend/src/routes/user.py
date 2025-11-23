from fastapi import APIRouter, Request, Depends, HTTPException
from database.models import User, Account, Transaction
from sqlalchemy.orm import Session
from database.database import get_db


user_router = APIRouter()


@user_router.get("/me")
async def me(request: Request, db: Session = Depends(get_db)):
    """Получения полной информации о пользователе."""
    request_user = request.state.user

    exsiting_user = db.query(User).filter(User.id == request_user["user_id"]).first()
    if not exsiting_user:
        raise HTTPException("Invalid token")
    
    accounts = db.query(Account).filter(Account.user_id == exsiting_user.id).all()
    transactions = db.query(Transaction).filter(Transaction.user_id == exsiting_user.id).all()
    
    return {"email": exsiting_user.email, 
            "name": exsiting_user.name,
            "accounts": accounts,
            "transactions": transactions}