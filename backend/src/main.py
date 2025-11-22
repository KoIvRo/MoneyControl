import uvicorn
from fastapi import FastAPI
from database.database import create_db

app = FastAPI()


def main() -> None:
    """Точка запуска REST API."""
    create_db()
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)


@app.get("/")
async def root_get() -> None:
    return {"title": "Hello, World!"}


if __name__ == "__main__":
    main()
