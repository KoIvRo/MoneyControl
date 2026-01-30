from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import User
from .models import UserRegistration, UserLogin
from security.pass_utils import get_pass_hash, verify_pass
from security.jwt_utils import create_token
from .redis import RedisBlacklist


auth_router = APIRouter()


@auth_router.post("/register")
async def register(user_data: UserRegistration, db: Session = Depends(get_db)):
    """Эндпоинт для регистрации."""
    exsiting_user = db.query(User).filter(User.email == user_data.email).first()
    if exsiting_user:
        raise HTTPException(status_code=400)

    hashed_password = get_pass_hash(user_data.password)

    new_user = User(
        name=user_data.name, email=user_data.email, password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_token(new_user.id)

    return {"access": access_token}


@auth_router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Эндпоинт для логина."""
    exsiting_user = db.query(User).filter(User.email == user_data.email).first()
    if not exsiting_user:
        raise HTTPException(status_code=400)

    if not verify_pass(user_data.password, exsiting_user.password):
        raise HTTPException(status_code=400)

    access_token = create_token(exsiting_user.id)

    return {"access": access_token}

@auth_router.post("/logout")
async def logout(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    access_token = authorization.split(" ")[1]
    await RedisBlacklist.add_token(access_token)
    return {"message": "Logged out"}
