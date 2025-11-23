# Backend for MoneyControl

## For start

In backend directory
```
poetry install
poetry run startserver
```

or

In src/
```
uvicorn main:app --reload --host=0.0.0.0 --port=8000
```

## Documentation

#### Autentification

For autentification using JWT token.

Endpoints:
* POST auth/register (email: str, password: str, name: str)
* POST auth/login (email: str, password: str)

For check

```
curl -X POST "http://localhost:8000/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"mypassword123\",\"name\":\"Ivan\"}"
```

```
curl -X POST "http://localhost:8000/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"mypassword123\"}"
```

## Tools
* Python
* FastAPI
* uvicorn
* SQLite

### Made by
* Korotaev Ivan
