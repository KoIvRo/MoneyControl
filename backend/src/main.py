from fastapi import FastAPI
import uvicorn

app = FastAPI()


def main() -> None:
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)


@app.get("/")
def root_get() -> None:
    return {"title": "Hello, World!"}
