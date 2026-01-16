FROM python:3.12-slim

RUN pip install --upgrade pip && \
    pip install poetry

WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

EXPOSE 8000

COPY src /app/src
ENTRYPOINT ["python", "src/main.py"]
