import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router
from routes.user import user_router
from routes.account import account_router
from routes.transaction import transaction_router
from database.database import create_db
from middleware import JWTMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.add_middleware(JWTMiddleware)

app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")
app.include_router(account_router, prefix="/account")
app.include_router(transaction_router, prefix="/transaction")


def main() -> None:
    """Точка запуска REST API."""
    create_db()
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)


@app.get("/")
async def root_get() -> None:
    return {"title": "Hello, World!"}


if __name__ == "__main__":
    main()
