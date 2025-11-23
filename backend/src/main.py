import uvicorn
from fastapi import FastAPI
from routes.auth import auth_router
from database.database import create_db
from middleware import JWTMiddleware


app = FastAPI()
app.add_middleware(JWTMiddleware)

app.include_router(auth_router, prefix="/auth")


def main() -> None:
    """Точка запуска REST API."""
    create_db()
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)


@app.get("/")
async def root_get() -> None:
    return {"title": "Hello, World!"}


if __name__ == "__main__":
    main()
