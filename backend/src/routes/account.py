from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import User, Account
from .models import AccountCreate


account_router = APIRouter()


@account_router.get("/{id}")
async def account(id: int, request: Request, db: Session = Depends(get_db)):
    """Информация об аккаунте."""
    request_user = request.state.user
    
    account = db.query(Account).filter(Account.id == id).first()

    if account.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)

    return {"account": account}


@account_router.post("/")
async def create_account(data: AccountCreate, request: Request, db: Session = Depends(get_db)):
    """Создание аккаунта."""
    request_user = request.state.user

    exsiting_user = db.query(User).filter(User.id == request_user["user_id"]).first()
    if not exsiting_user:
        raise HTTPException(status_code=401)
    
    new_account = Account(
        name = data.name,
        balance=data.balance,
        user_id=exsiting_user.id
    )
    
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return {"account": new_account}


@account_router.delete("/{id}")
async def delete_account(id: int, request: Request, db: Session = Depends(get_db)):
    """Удаление аккаунта."""
    request_user = request.state.user

    account = db.query(Account).filter(Account.id == id).first()

    if not account:
        raise HTTPException(status_code=404)
    
    if account.user_id != request_user["user_id"]:
        raise HTTPException(status_code=401)
    
    db.delete(account)
    db.commit()

    return {"detail": "Account deleted"}